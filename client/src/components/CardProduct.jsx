// import React, { useState } from 'react';
// import { DisplayPriceSlRupees } from '../utils/DisplayPriceSlRupees';
// import { Link } from 'react-router-dom';
// import { valideURLConvert } from '../utils/valideURLConvert';
// import { pricewithDiscount } from '../utils/PriceWithDiscount';
// import summaryApi from '../common/Summary';
// import AxiosToastError from '../utils/AxiosToastError';
// import Axios from '../utils/Axios';
// import { useGlobalContext } from '../provider/GlobalProvider';
// import toast from 'react-hot-toast';
// import AddToCartButton from './AddToCartButton';

// const CardProduct = ({ data }) => {
//   const url = `/product/${valideURLConvert(data.name)}-${data._id}`;
//   const [loading,setLoading] = useState(false)
//   // const { fetchCartItem } = useGlobalContext()

//   // const handleADDTocart = async(e)=>{
//   //     e.preventDefault()
//   //     e.stopPropagation()

//   //     try {
//   //       setLoading(true)

//   //       const response = await Axios({
//   //         ...summaryApi.addTocart,
//   //         data : {
//   //           productId : data?._id
//   //         }

//   //       })

//   //       const { data : responseData} = response
//   //       if(responseData.success){
//   //         toast.success(responseData.message)
//   //         if(fetchCartItem){
//   //           fetchCartItem()
//   //         }

//   //       }
//   //     } catch (error) {
//   //       AxiosToastError(error)
//   //     }finally{
//   //       setLoading(false)
//   //     }

//   // }

//   return (
//     <Link 
//       to={url} 
//       className="bg-white border border-gray-200 rounded-lg p-4 grid gap-4 hover:shadow-lg 
//       transition-shadow transform hover:-translate-y-1 w-full sm:w-80 md:min-w-[250px] lg:min-w-[250px] xl:w-72 max-w-full  "
//     >
//       {/** Image Section **/}
//       <div className="h-40 sm:h-52 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
//         <img
//           src={data.image[0]}
//           alt={data.name}
//           className="w-full h-full object-contain"
//         />
//       </div>

//       {/** Delivery Time **/}
//       <div className="bg-green-100 text-green-600 text-xs font-semibold px-2 py-1 rounded-full w-fit mx-auto sm:mx-0">
//         Home Delivery
//       </div>

//       {/** Product Name **/}
//       <div className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2 text-center sm:text-left">
//         {data.name}
//       </div>

//       {/** Unit Info **/}
//       <div className="text-gray-600 text-xs sm:text-sm lg:text-base text-center sm:text-left">
//         {data.unit}
//       </div>

//       {/** Price and Add Button **/}
//       <div className="flex flex-col gap-3 mt-2">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//           <div className="text-lg font-bold text-gray-800 text-center sm:text-left">
//             {DisplayPriceSlRupees(pricewithDiscount(data.price, data.discount))}
//           </div>
//           <div className="flex flex-col items-center sm:items-start">
//             {data.discount && (
//               <>
//                 <p className="line-through text-gray-500 text-sm sm:text-base">
//                   {DisplayPriceSlRupees(data.price)}
//                 </p>
//                 <p className="font-bold text-green-600 text-sm sm:text-base lg:text-lg">
//                   {data.discount}% <span className="text-gray-500 text-xs">Discount</span>
//                 </p>
//               </>
//             )}
//           </div>
//         </div>
//         {data.stock === 0 ? (
//           <p className="text-red-500 text-lg my-2">Out of Stock</p>
//         ) : (
//           <AddToCartButton data={data}/>
//         )}
        
//       </div>
//     </Link>
//   );
// };

// export default CardProduct;
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
  const [loading, setLoading] = useState(false);
  const { fetchCartItem } = useGlobalContext();

  const handleADDTocart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setLoading(true);

      const response = await Axios({
        ...summaryApi.addTocart,
        data: {
          productId: data?._id,
        },
      });

      const { data: responseData } = response;
      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) {
          fetchCartItem();
        }
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={url}
      className="bg-white border border-amber-200 rounded-xl p-4 grid gap-4 hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 w-full sm:w-80 md:min-w-[250px] lg:min-w-[250px] xl:w-72 max-w-full animate-fadeIn"
    >
      {/** Image Section **/}
      <div className="h-40 sm:h-52 bg-amber-50 rounded-lg flex items-center justify-center overflow-hidden border-2 border-orange-100 hover:border-orange-300 transition-colors duration-300">
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-contain hover:rotate-2 transition-transform duration-300"
        />
      </div>

      {/** Delivery Badge **/}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full w-fit mx-auto sm:mx-0 animate-pulse-slow shadow-lg">
        Home Delivery
      </div>

      {/** Product Name **/}
      <div className="font-medium text-gray-800 text-sm sm:text-base line-clamp-2 text-center sm:text-left hover:text-orange-700 transition-colors duration-300">
        {data.name}
      </div>

      {/** Unit Info **/}
      <div className="text-gray-600 text-xs sm:text-sm lg:text-base text-center sm:text-left">
        {data.unit}
      </div>

      {/** Price and Add Button **/}
      <div className="flex flex-col gap-3 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="text-lg font-bold text-orange-800 text-center sm:text-left">
            {DisplayPriceSlRupees(pricewithDiscount(data.price, data.discount))}
          </div>
          <div className="flex flex-col items-center sm:items-start">
            {data.discount && (
              <>
                <p className="line-through text-gray-500 text-sm sm:text-base">
                  {DisplayPriceSlRupees(data.price)}
                </p>
                <p className="font-bold text-red-600 text-sm sm:text-base lg:text-lg animate-pulse-slow">
                  {data.discount}% <span className="text-gray-500 text-xs">Discount</span>
                </p>
              </>
            )}
          </div>
        </div>
        {data.stock === 0 ? (
          <p className="text-red-600 text-lg font-semibold text-center animate-bounce">Out of Stock</p>
        ) : (
          <AddToCartButton data={data} loading={loading} onClick={handleADDTocart} />
        )}
      </div>
    </Link>
  );
};

export default CardProduct;