// import React, { useState } from 'react'
// import { useGlobalContext } from '../provider/GlobalProvider'
// import { DisplayPriceSlRupees } from '../utils/DisplayPriceSlRupees'
// import AddAddress from '../components/AddAddress'
// import { useSelector } from 'react-redux'
// import AxiosToastError from '../utils/AxiosToastError'
// import Axios from '../utils/Axios'
// import SummaryApi from '../common/Summary'
// import toast from 'react-hot-toast'
// import { useNavigate } from 'react-router-dom'
// import { loadStripe } from '@stripe/stripe-js';


// const CheckoutPage = () => {
//   const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem,fetchOrder } = useGlobalContext()
//   const [openAddress, setOpenAddress] = useState(false)
//   const addressList = useSelector(state => state.addresses.addressList)
//   const [selectAddress, setSelectAddress] = useState(0)
//   const cartItemsList = useSelector(state => state.cartItem.cart)
//   const navigate = useNavigate()

//   const handleCashOnDelivery = async() => {
//       try {
//           const response = await Axios({
//             ...SummaryApi.CashOnDeliveryOrder,
//             data : {
//               list_items : cartItemsList,
//               addressId : addressList[selectAddress]?._id,
//               subTotalAmt : totalPrice,
//               totalAmt :  totalPrice,
//             }
//           })

//           const { data : responseData } = response

//           if(responseData.success){
//               toast.success(responseData.message)
//               if(fetchCartItem){
//                 fetchCartItem()
//               }
//               if(fetchOrder){
//                 fetchOrder()
//               }
//               navigate('/success',{
//                 state : {
//                   text : "Order"
//                 }
//               })
//           }

//       } catch (error) {
//         AxiosToastError(error)
//       }
//   }

//   // const handleOnlinePayment = async()=>{
//   //   try {
//   //       toast.loading("Loading...")
//   //       const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
//   //       const stripePromise = await loadStripe(stripePublicKey)
       
//   //       const response = await Axios({
//   //           ...SummaryApi.payment_url,
//   //           data : {
//   //             list_items : cartItemsList,
//   //             addressId : addressList[selectAddress]?._id,
//   //             subTotalAmt : totalPrice,
//   //             totalAmt :  totalPrice,
//   //           }
//   //       })

//   //       const { data : responseData } = response

//   //       stripePromise.redirectToCheckout({ sessionId : responseData.id })
        
//   //       if(fetchCartItem){
//   //         fetchCartItem()
//   //       }
//   //       if(fetchOrder){
//   //         fetchOrder()
//   //       }
//   //   } catch (error) {
//   //       AxiosToastError(error)
//   //   }
//   // }


//   const handleOnlinePayment = async () => {
//     try {
//       // Validate address selection
//       if (!addressList[selectAddress]?._id) {
//         toast.error('Please select a shipping address');
//         return;
//       }

//       // Validate cart items
//       if (cartItemsList.length === 0) {
//         toast.error('Your cart is empty');
//         return;
//       }

//       const loadingToast = toast.loading('Processing payment...');

//       // Prepare payload
//       const payload = {
//         list_items: cartItemsList.map(item => ({
//           productId: {
//             _id: item.productId._id,
//             name: item.productId.name,
//             price: item.productId.price,
//             discount: item.productId.discount || 0,
//             image: item.productId.image
//           },
//           quantity: item.quantity
//         })),
//         addressId: addressList[selectAddress]._id
//       };

//       // Create payment session
//       const response = await Axios({
//         ...SummaryApi.payment_url,
//         data: payload
//       });

//       if (!response.data?.success) {
//         throw new Error(response.data?.message || 'Failed to create payment session');
//       }

//       // Initialize Stripe
//       const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
//       if (!stripe) {
//         throw new Error('Payment system not available');
//       }

//       // Redirect to Stripe checkout
//       const { error } = await stripe.redirectToCheckout({
//         sessionId: response.data.sessionId
//       });

//       if (error) {
//         throw error;
//       }

//     } catch (error) {
//       console.error('Payment error:', error);
//       toast.error(
//         error.response?.data?.message || 
//         error.message || 
//         'Payment processing failed. Please try again.'
//       );
//     } finally {
//       toast.dismiss();
//     }
//   };

//   console.log("addressList",addressList)
//   return (
//     <section className='bg-blue-50 mt-40'>
//       <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
//         <div className='w-full'>
//           {/***address***/}
//           <h3 className='text-lg font-semibold'>Choose your address</h3>
//           <div className='bg-white p-2 grid gap-4'>
//             {
//               addressList.map((address, index) => {
//                 return (
//                   <label htmlFor={"address" + index} className={!address.status && "hidden"}>
//                     <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
//                       <div>
//                         <input id={"address" + index} type='radio' value={index} onChange={(e) => setSelectAddress(e.target.value)} name='address' />
//                       </div>
//                       <div>
//                         <p>{address.address_line}</p>
//                         <p>{address.city}</p>
//                         <p>{address.state}</p>
//                         <p>{address.country} - {address.pincode}</p>
//                         <p>{address.mobile}</p>
//                       </div>
//                     </div>
//                   </label>
//                 )
//               })
//             }
//             <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
//               Add address
//             </div>
//           </div>



//         </div>

//         <div className='w-full max-w-md bg-white py-4 px-2'>
//           {/**summary**/}
//           <h3 className='text-lg font-semibold'>Summary</h3>
//           <div className='bg-white p-4'>
//             <h3 className='font-semibold'>Bill details</h3>
//             <div className='flex gap-4 justify-between ml-1'>
//               <p>Items total</p>
//               <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceSlRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceSlRupees(totalPrice)}</span></p>
//             </div>
//             <div className='flex gap-4 justify-between ml-1'>
//               <p>Quntity total</p>
//               <p className='flex items-center gap-2'>{totalQty} item</p>
//             </div>
//             <div className='flex gap-4 justify-between ml-1'>
//               <p>Delivery Charge</p>
//               <p className='flex items-center gap-2'>Free</p>
//             </div>
//             <div className='font-semibold flex items-center justify-between gap-4'>
//               <p >Grand total</p>
//               <p>{DisplayPriceSlRupees(totalPrice)}</p>
//             </div>
//           </div>
//           <div className='w-full flex flex-col gap-4'>
//             <button className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold' onClick={handleOnlinePayment}>Online Payment</button>

//             <button className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white' onClick={handleCashOnDelivery}>Cash on Delivery</button>
//           </div>
//         </div>
//       </div>


//       {
//         openAddress && (
//           <AddAddress close={() => setOpenAddress(false)} />
//         )
//       }
//     </section>
//   )
// }

// export default CheckoutPage


import React, { useState } from 'react';
import { useGlobalContext } from '../provider/GlobalProvider';
import { DisplayPriceSlRupees } from '../utils/DisplayPriceSlRupees';
import AddAddress from '../components/AddAddress';
import { useSelector } from 'react-redux';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';
import SummaryApi from '../common/Summary';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';

const CheckoutPage = () => {
  const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext();
  const [openAddress, setOpenAddress] = useState(false);
  const addressList = useSelector(state => state.addresses.addressList);
  const [selectAddress, setSelectAddress] = useState(0);
  const cartItemsList = useSelector(state => state.cartItem.cart);
  const navigate = useNavigate();

  const handleCashOnDelivery = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: cartItemsList,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: totalPrice,
          totalAmt: totalPrice,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        if (fetchCartItem) fetchCartItem();
        if (fetchOrder) fetchOrder();
        navigate('/success', {
          state: {
            text: "Order",
          },
        });
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      // Validate address selection
      if (!addressList[selectAddress]?._id) {
        toast.error('Please select a shipping address');
        return;
      }

      // Validate cart items
      if (cartItemsList.length === 0) {
        toast.error('Your cart is empty');
        return;
      }

      const loadingToast = toast.loading('Processing payment...');

      // Prepare payload
      const payload = {
        list_items: cartItemsList.map(item => ({
          productId: {
            _id: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            discount: item.productId.discount || 0,
            image: item.productId.image,
          },
          quantity: item.quantity,
        })),
        addressId: addressList[selectAddress]._id,
        subTotalAmt: totalPrice,
        totalAmt: totalPrice,
      };

      console.log('Payment payload:', payload); // Debug payload

      // Create payment session
      const response = await Axios({
        ...SummaryApi.payment_url,
        data: payload,
      });

      console.log('Payment API response:', response); // Debug API response

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to create payment session');
      }

      // Ensure sessionId exists in response
      if (!response.data.sessionId) {
        throw new Error('No session ID returned from payment API');
      }

      // Initialize Stripe
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      if (!stripe) {
        throw new Error('Failed to initialize Stripe. Check your Stripe public key.');
      }

      console.log('Stripe initialized successfully'); // Debug Stripe initialization

      // Redirect to Stripe checkout with only sessionId
      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (error) {
        console.error('Stripe redirect error:', error); // Debug redirect error
        throw new Error(error.message || 'Failed to redirect to Stripe checkout');
      }

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(
        error.response?.data?.message ||
        error.message ||
        'Payment processing failed. Please try again.'
      );
    } finally {
      toast.dismiss();
    }
  };

  console.log("addressList", addressList);
  return (
    <section className='bg-blue-50 mt-40'>
      <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>
        <div className='w-full'>
          {/***address***/}
          <h3 className='text-lg font-semibold'>Choose your address</h3>
          <div className='bg-white p-2 grid gap-4'>
            {addressList.map((address, index) => (
              <label htmlFor={"address" + index} className={!address.status && "hidden"} key={index}>
                <div className='border rounded p-3 flex gap-3 hover:bg-blue-50'>
                  <div>
                    <input
                      id={"address" + index}
                      type='radio'
                      value={index}
                      onChange={(e) => setSelectAddress(e.target.value)}
                      name='address'
                    />
                  </div>
                  <div>
                    <p>{address.address_line}</p>
                    <p>{address.city}</p>
                    <p>{address.state}</p>
                    <p>{address.country} - {address.pincode}</p>
                    <p>{address.mobile}</p>
                  </div>
                </div>
              </label>
            ))}
            <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
              Add address
            </div>
          </div>
        </div>

        <div className='w-full max-w-md bg-white py-4 px-2'>
          {/**summary**/}
          <h3 className='text-lg font-semibold'>Summary</h3>
          <div className='bg-white p-4'>
            <h3 className='font-semibold'>Bill details</h3>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Items total</p>
              <p className='flex items-center gap-2'><span className='line-through text-neutral-400'>{DisplayPriceSlRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceSlRupees(totalPrice)}</span></p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Quntity total</p>
              <p className='flex items-center gap-2'>{totalQty} item</p>
            </div>
            <div className='flex gap-4 justify-between ml-1'>
              <p>Delivery Charge</p>
              <p className='flex items-center gap-2'>Free</p>
            </div>
            <div className='font-semibold flex items-center justify-between gap-4'>
              <p>Grand total</p>
              <p>{DisplayPriceSlRupees(totalPrice)}</p>
            </div>
          </div>
          <div className='w-full flex flex-col gap-4'>
            <button className='py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold' onClick={handleOnlinePayment}>Online Payment</button>
            <button className='py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white' onClick={handleCashOnDelivery}>Cash on Delivery</button>
          </div>
        </div>
      </div>
      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;