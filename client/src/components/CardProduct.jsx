import React, { useState } from 'react';
import { DisplayPriceSlRupees } from '../utils/DisplayPriceSlRupees';
import { Link } from 'react-router-dom';
import { valideURLConvert } from '../utils/valideURLConvert';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import summaryApi from '../common/Summary';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import { useGlobalContext } from '../provider/GlobalProvider';
import toast from 'react-hot-toast';
import AddToCartButton from './AddToCartButton';

const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`;
  const [loading,setLoading] = useState(false)
  // const { fetchCartItem } = useGlobalContext()

  // const handleADDTocart = async(e)=>{
  //     e.preventDefault()
  //     e.stopPropagation()

  //     try {
  //       setLoading(true)

  //       const response = await Axios({
  //         ...summaryApi.addTocart,
  //         data : {
  //           productId : data?._id
  //         }

  //       })

  //       const { data : responseData} = response
  //       if(responseData.success){
  //         toast.success(responseData.message)
  //         if(fetchCartItem){
  //           fetchCartItem()
  //         }

  //       }
  //     } catch (error) {
  //       AxiosToastError(error)
  //     }finally{
  //       setLoading(false)
  //     }

  // }

  return (
    <Link 
      to={url} 
      className="bg-white border border-gray-200 rounded-lg p-4 grid gap-4 hover:shadow-lg 
      transition-shadow transform hover:-translate-y-1 w-full sm:w-80 md:min-w-[250px] lg:min-w-[250px] xl:w-72 max-w-full  "
    >
      {/** Image Section **/}
      <div className="h-40 sm:h-52 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/** Delivery Time **/}
      <div className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full w-fit mx-auto sm:mx-0">
        Home Delivery
      </div>

      {/** Product Name **/}
      <div className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2 text-center sm:text-left">
        {data.name}
      </div>

      {/** Unit Info **/}
      <div className="text-gray-600 text-xs sm:text-sm lg:text-base text-center sm:text-left">
        {data.unit}
      </div>

      {/** Price and Add Button **/}
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-lg font-bold text-gray-800 text-center sm:text-left">
            {DisplayPriceSlRupees(pricewithDiscount(data.price, data.discount))}
          </div>
          <div className="flex flex-col items-center sm:items-start">
            {data.discount && (
              <>
                <p className="line-through text-gray-500 text-sm sm:text-base">
                  {DisplayPriceSlRupees(data.price)}
                </p>
                <p className="font-bold text-green-600 text-sm sm:text-base lg:text-lg">
                  {data.discount}% <span className="text-gray-500 text-xs">Discount</span>
                </p>
              </>
            )}
          </div>
        </div>
        {data.stock === 0 ? (
          <p className="text-red-500 text-lg my-2">Out of Stock</p>
        ) : (
          <AddToCartButton data={data}/>
        )}
        
      </div>
    </Link>
  );
};

export default CardProduct;
