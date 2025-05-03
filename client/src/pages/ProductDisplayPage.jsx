// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import SummaryApi from '../common/Summary';
// import Axios from '../utils/Axios';
// import AxiosToastError from '../utils/AxiosToastError';
// import { FaAngleLeft, FaChevronRight } from "react-icons/fa";
// import { DisplayPriceSlRupees } from '../utils/DisplayPriceSlRupees';
// import Divider from '../components/Divider';
// import image1 from '../assets/minute_delivery.jpeg';
// import image2 from '../assets/bestDeal.jpg';
// import image3 from '../assets/wide.jpg';
// import { pricewithDiscount } from '../utils/PriceWithDiscount';
// import { original } from '@reduxjs/toolkit';
// import AddToCartButton from '../components/AddToCartButton';

// const ProductDisplayPage = () => {
//     const params = useParams();
//     const productId = params?.product?.split("-")?.slice(-1)[0]; // Extract product ID
//     const [data, setData] = useState({
//         name: "",
//         image: []
//     });
//     const [image, setImage] = useState(0); // Current selected image index
//     const [loading, setLoading] = useState(false);
//     const [visibleStart, setVisibleStart] = useState(0); // Start index of visible thumbnails
//     const visibleCount = 5; // Number of thumbnails to display

//     // Fetch product details from API
//     const fetchProductDetails = async () => {
//         try {
//             setLoading(true);
//             const response = await Axios({
//                 ...SummaryApi.getProductDetails,
//                 data: { productId }
//             });
//             const { data: responseData } = response;
//             if (responseData.success) {
//                 setData(responseData.data);
//             }
//         } catch (error) {
//             AxiosToastError(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchProductDetails();
//     }, [params]);

//     // Scroll handlers for the image carousel
//     const handleScrollRight = () => {
//         if (visibleStart + visibleCount < data.image.length) {
//             setVisibleStart(visibleStart + 1);
//         }
//     };

//     const handleScrollLeft = () => {
//         if (visibleStart > 0) {
//             setVisibleStart(visibleStart - 1);
//         }
//     };

//     return (
//       // <section className="container mx-auto px-4 lg:px-8 grid gap-6 grid-cols-1 lg:grid-cols-2 mt-24 relative z-10 ">
//       <section className="container mx-auto px-4 lg:px-8 grid gap-6 grid-cols-1 lg:grid-cols-2 mt-24 pt-16 relative z-10">
//       {/* Image Display Section */}
//       <div>
//         <div className="relative bg-white rounded-lg shadow-md">
//           {data.image.length > 0 ? (
//             <img
//               src={data.image[image]}
//               alt="product"
//               className="w-full h-64 sm:h-80 md:h-96 object-contain rounded-t-lg"
//             />
//           ) : (
//             <p className="text-center py-20">Loading image...</p>
//           )}
//         </div>
    
//         {/* Image Carousel */}
//         <div className="relative flex items-center justify-center lg:justify-between mt-4">
//           {/* Left Arrow */}
//               <button
//                 onClick={handleScrollLeft}
//                 className={`absolute left-0 z-10 bg-white p-2 rounded-full shadow-lg transform -translate-x-1/2 ${
//                   visibleStart === 0 ? "opacity-50 pointer-events-none" : ""
//                 }`}
//               >
//                 <FaAngleLeft />
//               </button>
    
//           {/* Thumbnail Carousel */}
//           <div className="flex gap-2 sm:gap-4 overflow-x-scroll w-full items-center justify-center">
//             {data.image
//               .slice(visibleStart, visibleStart + visibleCount)
//               .map((img, index) => (
//                 <div
//                   key={index}
//                   className={`w-16 sm:w-20 h-16 sm:h-20 cursor-pointer shadow-md rounded-lg ${
//                     visibleStart + index === image
//                       ? "border-2 border-green-500"
//                       : "border border-gray-300"
//                   }`}
//                   onClick={() => setImage(visibleStart + index)}
//                 >
//                   <img
//                     src={img}
//                     alt={`thumbnail-${visibleStart + index}`}
//                     className="w-full h-full object-cover rounded-lg"
//                   />
//                 </div>
//               ))}
//           </div>
    
//           {/* Right Arrow */}
//             <button
//               onClick={handleScrollRight}
//               className={`absolute right-0 z-10 bg-white p-2 rounded-full shadow-lg transform translate-x-1/2 ${
//                 visibleStart + visibleCount >= data.image.length
//                   ? "opacity-50 pointer-events-none"
//                   : ""
//               }`}
//             >
//               <FaChevronRight />
//             </button>
//         </div>
//       </div>
    
//       {/* Product Details Section */}
// <div>
//   <h2 className="text-xl sm:text-2xl font-semibold mb-4">
//     {data.name || "Loading..."}
//   </h2>
//   <p className="text-sm text-gray-600 mb-4">{data.unit || "No unit specified"}</p>
//   <Divider />
  
//   {/* Price Section */}
//   <div className="my-4">
//     {data.price ? (
//       <div>
//         <p className="text-lg mb-2">Price:</p>
//         <div className="border border-green-600 px-4 py-2 rounded bg-green-50 inline-block">
//           {DisplayPriceSlRupees(pricewithDiscount(data.price, data.discount))}
//         </div>
//         {data.discount && (
//           <>
//             <p className="line-through">{DisplayPriceSlRupees(data.price)}</p>
//             <p className="font-bold text-green-600 lg:text-2xl">
//               {data.discount}% <span className="text-base text-neutral-500">Discount</span>
//             </p>
//           </>
//         )}
//       </div>
//     ) : (
//       <p>Loading price...</p>
//     )}
//   </div>

//   {/* Description Section */}
//   <h3 className="font-semibold mb-2">Description:</h3>
//   <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">
//     {data.description || "No description available."}
//   </p>

//   {/* Stock and Add to Cart Button */}
//   {data.stock === 0 ? (
//     <p className="text-red-500 text-lg my-2">Out of Stock</p>
//   ) : (
//     //<button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto">
//     <div className='my-4'>
//       <AddToCartButton data={data}/>
//     </div>
//     //</button>
//   )}
//   <Divider />

//   {/* Additional Details */}
//   <div className="mt-6">
//     {data.more_details && (
//       <div className="border rounded-lg p-4 bg-gray-50">
//         <h4 className="font-semibold mb-2">More Details:</h4>
//         {Object.keys(data.more_details).map((key, index) => (
//           <div key={index} className="mb-2">
//             <p className="font-semibold">{key}:</p>
//             <p className="text-sm">{data.more_details[key]}</p>
//           </div>
//         ))}
//       </div>
//     )}
//   </div>

//   {/* Highlight Images Section */}
//   <div>
//         <div className='flex  items-center gap-4 my-4'>
//             <img
//             src={image1}
//             alt='superfast delivery'
//             className='w-20 h-20'
//           />
//           <div className='text-sm'>
//             <div className='font-semibold'>Superfast Delivery</div>
//             <p>Get your orer delivered to your doorstep at the earliest from dark stores near you.</p>
//           </div>
//       </div>
//       <div className='flex  items-center gap-4 my-4'>
//           <img
//             src={image2}
//             alt='Best prices offers'
//             className='w-20 h-20'
//           />
//           <div className='text-sm'>
//             <div className='font-semibold'>Best Prices & Offers</div>
//             <p>Best price destination with offers directly from the nanufacturers.</p>
//           </div>
//       </div>
//       <div className='flex  items-center gap-4 my-4'>
//           <img
//             src={image3}
//             alt='Wide Assortment'
//             className='w-20 h-20'
//           />
//           <div className='text-sm'>
//             <div className='font-semibold'>Wide Assortment</div>
//             <p>Choose from 5000+ products across food personal care, household & other categories.</p>
//           </div>
//       </div>
//     </div>



// </div>

//     </section>
    
//     );
// };

// export default ProductDisplayPage;



import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common/Summary';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { FaAngleLeft, FaChevronRight } from 'react-icons/fa';
import { DisplayPriceSlRupees } from '../utils/DisplayPriceSlRupees';
import Divider from '../components/Divider';
import image1 from '../assets/minute_delivery.jpeg';
import image2 from '../assets/bestDeal.jpg';
import image3 from '../assets/wide.jpg';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from '../components/AddToCartButton';

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params?.product?.split('-')?.slice(-1)[0]; // Extract product ID
  const [data, setData] = useState({
    name: '',
    image: [],
  });
  const [image, setImage] = useState(0); // Current selected image index
  const [loading, setLoading] = useState(false);
  const [visibleStart, setVisibleStart] = useState(0); // Start index of visible thumbnails
  const visibleCount = 5; // Number of thumbnails to display

  // Fetch product details from API
  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId },
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
    fetchProductDetails();
  }, [params]);

  // Scroll handlers for the image carousel
  const handleScrollRight = () => {
    if (visibleStart + visibleCount < data.image.length) {
      setVisibleStart(visibleStart + 1);
    }
  };

  const handleScrollLeft = () => {
    if (visibleStart > 0) {
      setVisibleStart(visibleStart - 1);
    }
  };

  return (
    <section className="container mx-auto px-4 lg:px-8 grid gap-6 grid-cols-1 lg:grid-cols-2 mt-24 pt-16 relative z-10 bg-gradient-to-br from-amber-100 to-orange-50 animate-fadeIn">
      {/* Image Display Section */}
      <div className="relative">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-200">
          {data.image.length > 0 ? (
            <img
              src={data.image[image]}
              alt="product"
              className="w-full h-64 sm:h-80 md:h-96 object-contain rounded-t-2xl transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <p className="text-center py-20 text-gray-500">Loading image...</p>
          )}
        </div>

        {/* Image Carousel */}
        <div className="relative flex items-center justify-center lg:justify-between mt-4">
          {/* Left Arrow */}
          <button
            onClick={handleScrollLeft}
            className={`absolute left-0 z-10 bg-white p-2 rounded-full shadow-lg transform -translate-x-1/2 hover:bg-amber-100 transition-all duration-300 animate-bounce ${
              visibleStart === 0 ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <FaAngleLeft className="text-orange-600" />
          </button>

          {/* Thumbnail Carousel */}
          <div className="flex gap-2 sm:gap-4 overflow-x-scroll w-full items-center justify-center">
            {data.image
              .slice(visibleStart, visibleStart + visibleCount)
              .map((img, index) => (
                <div
                  key={index}
                  className={`w-16 sm:w-20 h-16 sm:h-20 cursor-pointer shadow-md rounded-lg border-2 ${
                    visibleStart + index === image
                      ? 'border-green-500 ring-2 ring-green-300'
                      : 'border-gray-300 hover:border-orange-400'
                  } transition-all duration-300`}
                  onClick={() => setImage(visibleStart + index)}
                >
                  <img
                    src={img}
                    alt={`thumbnail-${visibleStart + index}`}
                    className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity duration-200"
                  />
                </div>
              ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleScrollRight}
            className={`absolute right-0 z-10 bg-white p-2 rounded-full shadow-lg transform translate-x-1/2 hover:bg-amber-100 transition-all duration-300 animate-bounce ${
              visibleStart + visibleCount >= data.image.length
                ? 'opacity-50 pointer-events-none'
                : ''
            }`}
          >
            <FaChevronRight className="text-orange-600" />
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-orange-800 bg-gradient-to-r from-amber-200 to-orange-100 p-2 rounded-lg animate-slideIn">
          {data.name || 'Loading...'}
        </h2>
        <p className="text-sm text-gray-600">{data.unit || 'No unit specified'}</p>
        <Divider />

        {/* Price Section */}
        <div className="my-4">
          {data.price ? (
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-700">Price:</p>
              <div className="border-2 border-green-600 bg-green-50 px-4 py-2 rounded-lg shadow-inner inline-block animate-pulse-slow">
                {DisplayPriceSlRupees(pricewithDiscount(data.price, data.discount))}
              </div>
              {data.discount && (
                <>
                  <p className="line-through text-gray-500">{DisplayPriceSlRupees(data.price)}</p>
                  <p className="font-bold text-red-600 text-xl animate-bounce-slow">
                    {data.discount}% <span className="text-sm text-neutral-500">Discount</span>
                  </p>
                </>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading price...</p>
          )}
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <h3 className="font-semibold text-orange-700">Description:</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">
            {data.description || 'No description available.'}
          </p>
        </div>

        {/* Stock and Add to Cart Button */}
        {data.stock === 0 ? (
          <p className="text-red-600 text-xl font-semibold text-center animate-bounce">Out of Stock</p>
        ) : (
          <div className="my-4 animate-slideIn">
            <AddToCartButton data={data} />
          </div>
        )}
        <Divider />

        {/* Additional Details */}
        <div className="mt-6">
          {data.more_details && (
            <div className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h4 className="font-semibold text-orange-800 mb-3">More Details:</h4>
              {Object.keys(data.more_details).map((key, index) => (
                <div key={index} className="mb-2 hover:bg-amber-100 p-2 rounded-lg transition-all duration-300">
                  <p className="font-semibold text-gray-800">{key}:</p>
                  <p className="text-sm text-gray-600">{data.more_details[key]}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Highlight Images Section */}
        <div className="space-y-6 mt-6">
          <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fadeIn">
            <img
              src={image1}
              alt="superfast delivery"
              className="w-20 h-20 rounded-lg object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="text-sm">
              <div className="font-semibold text-green-700">Superfast Delivery</div>
              <p className="text-gray-600">Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fadeIn delay-200">
            <img
              src={image2}
              alt="Best prices offers"
              className="w-20 h-20 rounded-lg object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="text-sm">
              <div className="font-semibold text-orange-700">Best Prices & Offers</div>
              <p className="text-gray-600">Best price destination with offers directly from the manufacturers.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fadeIn delay-400">
            <img
              src={image3}
              alt="Wide Assortment"
              className="w-20 h-20 rounded-lg object-cover hover:scale-105 transition-transform duration-300"
            />
            <div className="text-sm">
              <div className="font-semibold text-amber-700">Wide Assortment</div>
              <p className="text-gray-600">Choose from 5000+ products across food, personal care, household & other categories.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDisplayPage;