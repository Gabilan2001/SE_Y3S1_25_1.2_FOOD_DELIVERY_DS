import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common/Summary';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { FaAngleLeft, FaChevronRight } from "react-icons/fa";
import { DisplayPriceSlRupees } from '../utils/DisplayPriceSlRupees';
import Divider from '../components/Divider';
//import image1 from '../assets/minute_delivery.jpeg';
//import image2 from '../assets/bestDeal.jpg';
//import image3 from '../assets/wide.jpg';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import { original } from '@reduxjs/toolkit';
import AddToCartButton from '../components/AddToCartButton';

const ProductDisplayPage = () => {
    const params = useParams();
    const productId = params?.product?.split("-")?.slice(-1)[0]; // Extract product ID
    const [data, setData] = useState({
        name: "",
        image: []
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
                data: { productId }
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
      <section className="container mx-auto px-4 lg:px-8 grid gap-6 grid-cols-1 lg:grid-cols-2 mt-24 relative z-10 ">
      {/* Image Display Section */}
      <div>
        <div className="relative bg-white rounded-lg shadow-md">
          {data.image.length > 0 ? (
            <img
              src={data.image[image]}
              alt="product"
              className="w-full h-64 sm:h-80 md:h-96 object-contain rounded-t-lg"
            />
          ) : (
            <p className="text-center py-20">Loading image...</p>
          )}
        </div>
    
        {/* Image Carousel */}
        <div className="relative flex items-center justify-center lg:justify-between mt-4">
          {/* Left Arrow */}
              <button
                onClick={handleScrollLeft}
                className={`absolute left-0 z-10 bg-white p-2 rounded-full shadow-lg transform -translate-x-1/2 ${
                  visibleStart === 0 ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <FaAngleLeft />
              </button>
    
          {/* Thumbnail Carousel */}
          <div className="flex gap-2 sm:gap-4 overflow-x-scroll w-full items-center justify-center">
            {data.image
              .slice(visibleStart, visibleStart + visibleCount)
              .map((img, index) => (
                <div
                  key={index}
                  className={`w-16 sm:w-20 h-16 sm:h-20 cursor-pointer shadow-md rounded-lg ${
                    visibleStart + index === image
                      ? "border-2 border-green-500"
                      : "border border-gray-300"
                  }`}
                  onClick={() => setImage(visibleStart + index)}
                >
                  <img
                    src={img}
                    alt={`thumbnail-${visibleStart + index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
          </div>
    
          {/* Right Arrow */}
            <button
              onClick={handleScrollRight}
              className={`absolute right-0 z-10 bg-white p-2 rounded-full shadow-lg transform translate-x-1/2 ${
                visibleStart + visibleCount >= data.image.length
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              <FaChevronRight />
            </button>
        </div>
      </div>
    
      {/* Product Details Section */}
<div>
  <h2 className="text-xl sm:text-2xl font-semibold mb-4">
    {data.name || "Loading..."}
  </h2>
  <p className="text-sm text-gray-600 mb-4">{data.unit || "No unit specified"}</p>
  <Divider />
  
  {/* Price Section */}
  <div className="my-4">
    {data.price ? (
      <div>
        <p className="text-lg mb-2">Price:</p>
        <div className="border border-green-600 px-4 py-2 rounded bg-green-50 inline-block">
          {DisplayPriceSlRupees(pricewithDiscount(data.price, data.discount))}
        </div>
        {data.discount && (
          <>
            <p className="line-through">{DisplayPriceSlRupees(data.price)}</p>
            <p className="font-bold text-green-600 lg:text-2xl">
              {data.discount}% <span className="text-base text-neutral-500">Discount</span>
            </p>
          </>
        )}
      </div>
    ) : (
      <p>Loading price...</p>
    )}
  </div>

  {/* Description Section */}
  <h3 className="font-semibold mb-2">Description:</h3>
  <p className="text-sm text-gray-600 mb-4 whitespace-pre-wrap">
    {data.description || "No description available."}
  </p>

  {/* Stock and Add to Cart Button */}
  {data.stock === 0 ? (
    <p className="text-red-500 text-lg my-2">Out of Stock</p>
  ) : (
    //<button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all w-full sm:w-auto">
    <div className='my-4'>
      <AddToCartButton data={data}/>
    </div>
    //</button>
  )}
  <Divider />

  {/* Additional Details */}
  <div className="mt-6">
    {data.more_details && (
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="font-semibold mb-2">More Details:</h4>
        {Object.keys(data.more_details).map((key, index) => (
          <div key={index} className="mb-2">
            <p className="font-semibold">{key}:</p>
            <p className="text-sm">{data.more_details[key]}</p>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Highlight Images Section */}
  <div>
        <div className='flex  items-center gap-4 my-4'>
            <img
            src={image1}
            alt='superfast delivery'
            className='w-20 h-20'
          />
          <div className='text-sm'>
            <div className='font-semibold'>Superfast Delivery</div>
            <p>Get your orer delivered to your doorstep at the earliest from dark stores near you.</p>
          </div>
      </div>
      <div className='flex  items-center gap-4 my-4'>
          <img
            src={image2}
            alt='Best prices offers'
            className='w-20 h-20'
          />
          <div className='text-sm'>
            <div className='font-semibold'>Best Prices & Offers</div>
            <p>Best price destination with offers directly from the nanufacturers.</p>
          </div>
      </div>
      <div className='flex  items-center gap-4 my-4'>
          <img
            src={image3}
            alt='Wide Assortment'
            className='w-20 h-20'
          />
          <div className='text-sm'>
            <div className='font-semibold'>Wide Assortment</div>
            <p>Choose from 5000+ products across food personal care, household & other categories.</p>
          </div>
      </div>
    </div>



</div>

    </section>
    
    );
};

export default ProductDisplayPage;


// import React, { useEffect, useRef, useState } from 'react'
// import { useParams } from 'react-router-dom'
// import SummaryApi from '../common/Summary'
// import Axios from '../utils/Axios'
// import AxiosToastError from '../utils/AxiosToastError'
// import { FaAngleRight,FaAngleLeft } from "react-icons/fa6";
// import { DisplayPriceSlRupees } from '../utils/DisplayPriceSlRupees'
// import Divider from '../components/Divider'
// import image1 from '../assets/minute_delivery.png'
// import image2 from '../assets/Best_Prices_Offers.png'
// import image3 from '../assets/Wide_Assortment.png'
// import { pricewithDiscount } from '../utils/PriceWithDiscount'
// import AddToCartButton from '../components/AddToCartButton'

// const ProductDisplayPage = () => {
//   const params = useParams()
//   let productId = params?.product?.split("-")?.slice(-1)[0]
//   const [data,setData] = useState({
//     name : "",
//     image : []
//   })
//   const [image,setImage] = useState(0)
//   const [loading,setLoading] = useState(false)
//   const imageContainer = useRef()

//   const fetchProductDetails = async()=>{
//     try {
//         const response = await Axios({
//           ...SummaryApi.getProductDetails,
//           data : {
//             productId : productId 
//           }
//         })

//         const { data : responseData } = response

//         if(responseData.success){
//           setData(responseData.data)
//         }
//     } catch (error) {
//       AxiosToastError(error)
//     }finally{
//       setLoading(false)
//     }
//   }

//   useEffect(()=>{
//     fetchProductDetails()
//   },[params])
  
//   const handleScrollRight = ()=>{
//     imageContainer.current.scrollLeft += 100
//   }
//   const handleScrollLeft = ()=>{
//     imageContainer.current.scrollLeft -= 100
//   }
//   console.log("product data",data)
//   return (
//     <section className='container mx-auto p-4 grid lg:grid-cols-2 '>
//         <div className=''>
//             <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
//                 <img
//                     src={data.image[image]}
//                     className='w-full h-full object-scale-down'
//                 /> 
//             </div>
//             <div className='flex items-center justify-center gap-3 my-2'>
//               {
//                 data.image.map((img,index)=>{
//                   return(
//                     <div key={img+index+"point"} className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image && "bg-slate-300"}`}></div>
//                   )
//                 })
//               }
//             </div>
//             <div className='grid relative'>
//                 <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
//                       {
//                         data.image.map((img,index)=>{
//                           return(
//                             <div className='w-20 h-20 min-h-20 min-w-20 scr cursor-pointer shadow-md' key={img+index}>
//                               <img
//                                   src={img}
//                                   alt='min-product'
//                                   onClick={()=>setImage(index)}
//                                   className='w-full h-full object-scale-down' 
//                               />
//                             </div>
//                           )
//                         })
//                       }
//                 </div>
//                 <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute  items-center'>
//                     <button onClick={handleScrollLeft} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
//                         <FaAngleLeft/>
//                     </button>
//                     <button onClick={handleScrollRight} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
//                         <FaAngleRight/>
//                     </button>
//                 </div>
//             </div>
//             <div>
//             </div>

//             <div className='my-4  hidden lg:grid gap-3 '>
//                 <div>
//                     <p className='font-semibold'>Description</p>
//                     <p className='text-base'>{data.description}</p>
//                 </div>
//                 <div>
//                     <p className='font-semibold'>Unit</p>
//                     <p className='text-base'>{data.unit}</p>
//                 </div>
//                 {
//                   data?.more_details && Object.keys(data?.more_details).map((element,index)=>{
//                     return(
//                       <div>
//                           <p className='font-semibold'>{element}</p>
//                           <p className='text-base'>{data?.more_details[element]}</p>
//                       </div>
//                     )
//                   })
//                 }
//             </div>
//         </div>


//         <div className='p-4 lg:pl-7 text-base lg:text-lg'>
//             <p className='bg-green-300 w-fit px-2 rounded-full'>10 Min</p>
//             <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>  
//             <p className=''>{data.unit}</p> 
//             <Divider/>
//             <div>
//               <p className=''>Price</p> 
//               <div className='flex items-center gap-2 lg:gap-4'>
//                 <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
//                     <p className='font-semibold text-lg lg:text-xl'>{DisplayPriceSlRupees(pricewithDiscount(data.price,data.discount))}</p>
//                 </div>
//                 {
//                   data.discount && (
//                     <p className='line-through'>{DisplayPriceInRupees(data.price)}</p>
//                   )
//                 }
//                 {
//                   data.discount && (
//                     <p className="font-bold text-green-600 lg:text-2xl">{data.discount}% <span className='text-base text-neutral-500'>Discount</span></p>
//                   )
//                 }
                
//               </div>

//             </div> 
              
//               {
//                 data.stock === 0 ? (
//                   <p className='text-lg text-red-500 my-2'>Out of Stock</p>
//                 ) 
//                 : (
//                   // <button className='my-4 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded'>Add</button>
//                   <div className='my-4'>
//                     <AddToCartButton data={data}/>
//                   </div>
//                 )
//               }
           

//             <h2 className='font-semibold'>Why shop from binkeyit? </h2>
//             <div>
//                   <div className='flex  items-center gap-4 my-4'>
//                       <img
//                         src={image1}
//                         alt='superfast delivery'
//                         className='w-20 h-20'
//                       />
//                       <div className='text-sm'>
//                         <div className='font-semibold'>Superfast Delivery</div>
//                         <p>Get your orer delivered to your doorstep at the earliest from dark stores near you.</p>
//                       </div>
//                   </div>
//                   <div className='flex  items-center gap-4 my-4'>
//                       <img
//                         src={image2}
//                         alt='Best prices offers'
//                         className='w-20 h-20'
//                       />
//                       <div className='text-sm'>
//                         <div className='font-semibold'>Best Prices & Offers</div>
//                         <p>Best price destination with offers directly from the nanufacturers.</p>
//                       </div>
//                   </div>
//                   <div className='flex  items-center gap-4 my-4'>
//                       <img
//                         src={image3}
//                         alt='Wide Assortment'
//                         className='w-20 h-20'
//                       />
//                       <div className='text-sm'>
//                         <div className='font-semibold'>Wide Assortment</div>
//                         <p>Choose from 5000+ products across food personal care, household & other categories.</p>
//                       </div>
//                   </div>
//             </div>

//             {/****only mobile */}
//             <div className='my-4 grid gap-3 '>
//                 <div>
//                     <p className='font-semibold'>Description</p>
//                     <p className='text-base'>{data.description}</p>
//                 </div>
//                 <div>
//                     <p className='font-semibold'>Unit</p>
//                     <p className='text-base'>{data.unit}</p>
//                 </div>
//                 {
//                   data?.more_details && Object.keys(data?.more_details).map((element,index)=>{
//                     return(
//                       <div>
//                           <p className='font-semibold'>{element}</p>
//                           <p className='text-base'>{data?.more_details[element]}</p>
//                       </div>
//                     )
//                   })
//                 }
//             </div>
//         </div>
//     </section>
//   )
// }

// export default ProductDisplayPage