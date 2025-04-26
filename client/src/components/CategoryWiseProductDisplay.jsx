import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Axios from "../utils/Axios";
import summaryApi from "../common/Summary";
import AxiosToastError from "../utils/AxiosToastError";
import CardLoading from "./CardLoading";
import CardProduct from "./CardProduct";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef(null);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();
  const loadingCardNumber = new Array(6).fill(null);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summaryApi.getProductByCategory,
        data: { id },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
  }, []);

  const valideURLConvert = (str) => {
    return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  };

  const handleRedirectProductListpage = () => {
    const subcategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id === id)
    );

    if (!subcategory) {
      console.error("Subcategory not found for category ID:", id);
      return "#";
    }

    const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
    return url;
  };

  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <div className="mb-8">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 border-b border-gray-300">
        <h3 className="font-bold text-xl text-gray-800">{name}</h3>
        <Link
          to={handleRedirectProductListpage()}
          className="text-green-600 hover:text-green-500 font-medium transition"
        >
          See All
        </Link>
      </div>
      <div className="relative container mx-auto px-4">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-4 overflow-x-auto scroll-smooth py-4"
        >
          {loading &&
            loadingCardNumber.map((_, index) => (
              <CardLoading key={"CategoryWiseProduct123" + index} />
            ))}

          {data.map((p, index) => (
            <CardProduct data={p} key={p._id + "CategoryWiseProduct" + index} />
          ))}
        </div>
        {/** Scroll Buttons */}
        <div className="absolute inset-0  justify-between items-center pointer-events-none hidden lg:flex">
          <button
            onClick={scrollLeft}
            className="z-10 relative bg-gray-100 hover:bg-gray-200 shadow-lg p-3 rounded-full pointer-events-auto transition"
          >
            <TiChevronLeft size={24} />
          </button>
          <button
            onClick={scrollRight}
            className="z-10 relative bg-gray-100 hover:bg-gray-200 shadow-lg p-3 rounded-full pointer-events-auto transition"
          >
            <TiChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryWiseProductDisplay;
