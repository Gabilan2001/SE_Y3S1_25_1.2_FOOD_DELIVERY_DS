import React, { useEffect, useState, useCallback } from 'react';
import CardLoading from '../components/CardLoading';
import SummaryApi from '../common/Summary';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import CardProduct from '../components/CardProduct';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router-dom';
import noDataImage from '../assets/NoData.jpg';

const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [error, setError] = useState(null);
  const params = useLocation();
  const searchText = params?.search?.slice(3) || '';

  const fetchData = useCallback(async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: { search: searchText, page },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData((prev) => (page === 1 ? responseData.data : [...prev, ...responseData.data]));
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [searchText, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFetchMore = () => {
    if (page < totalPage) setPage((prev) => prev + 1);
  };

  return (
    <section className="bg-white mt-40 min-h-screen">
      <div className="container mx-auto p-4">
        <p className="font-semibold text-lg mb-4">
          Search Results: {data.length}
        </p>

        {error && (
          <div className="text-center text-red-500 mb-4">
            {error}
          </div>
        )}

        <InfiniteScroll
          dataLength={data.length}
          hasMore={page < totalPage}
          next={handleFetchMore}
          loader={
            <div className="flex justify-center py-4">
              <CardLoading />
            </div>
          }
          endMessage={
            data.length > 0 && (
              <p className="text-center mt-4 text-gray-500">
                You've reached the end of the results.
              </p>
            )
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.map((p, index) => (
              <CardProduct data={p} key={p?._id + 'searchProduct' + index} />
            ))}
          </div>
        </InfiniteScroll>

        {!loading && data.length === 0 && !error && (
          <div className="flex flex-col justify-center items-center w-full mx-auto">
            <img
              src={noDataImage}
              className="w-full max-w-xs h-auto block"
              alt="No Data"
            />
            <p className="font-semibold mt-2">No Data Found</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchPage;
