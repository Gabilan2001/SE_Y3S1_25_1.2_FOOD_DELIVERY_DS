import React, { useEffect, useState } from "react";
import SummaryApi from "../common/Summary";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";

const ProductAdmin = () => {
  const [productData, setProductData] = useState([]); // Products for current page
  const [page, setPage] = useState(1); // Current page
  const [loading, setLoading] = useState(false); // Loading state
  const [totalPageCount, setTotalPageCount] = useState(1); // Total pages
  const [search, setSearch] = useState(""); // Search query
  const [error, setError] = useState(null); // Error state

  // Fetch product data from API
  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: {
          page,
          limit: 12,
          search,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setTotalPageCount(responseData.totalNoPage); // Set total page count
        setProductData(responseData.data); // Set fetched products
      } else {
        throw new Error("Failed to fetch products.");
      }
    } catch (error) {
      setError(error.message || "An error occurred while fetching products.");
      AxiosToastError(error); // Display error notification
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when the page or search changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProductData();
    }, 300); // Debounce delay for search

    return () => clearTimeout(delayDebounce); // Cleanup debounce
  }, [page, search]);

  // Handle pagination
  const handleNext = () => {
    if (page < totalPageCount) setPage((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  // Handle search input change
  const handleOnChange = (e) => {
    setSearch(e.target.value); // Update search query
    setPage(1); // Reset to the first page
  };

  return (
    <section className="min-h-screen bg-gray-50 p-4">
      {/* Header Section */}
      <div className="p-4 bg-white shadow-md flex items-center justify-between gap-4 rounded">
        <h2 className="font-semibold text-lg">Product Management</h2>
        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded border focus-within:border-blue-400">
          <IoSearchOutline size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-transparent outline-none text-gray-700"
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="my-4 text-center text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Products Section */}
      <div className="p-4 bg-white shadow rounded mt-4">
        {loading ? (
          <Loading /> // Display loading spinner
        ) : productData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {productData.map((product, index) => (
              <ProductCardAdmin
                key={product._id || index}
                data={product}
                fetchProductData={fetchProductData}
              />
            ))}
          </div>
        ) : (
          // Display when no products match the search
          <div className="text-center text-gray-500">
            <p className="text-lg font-semibold">No Products Found</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          className={`px-4 py-2 rounded ${
            page <= 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={page <= 1}
        >
          Previous
        </button>
        <span className="text-sm font-semibold">
          Page {page} of {totalPageCount}
        </span>
        <button
          onClick={handleNext}
          className={`px-4 py-2 rounded ${
            page >= totalPageCount
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
          disabled={page >= totalPageCount}
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default ProductAdmin;
