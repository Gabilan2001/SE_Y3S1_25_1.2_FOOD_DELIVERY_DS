import React from 'react';
import { TbShoppingCartFilled } from 'react-icons/tb';
import { DisplayPriceSlRupees } from '../utils/DisplayPriceSlRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import { Link } from 'react-router-dom';
import { FaCaretRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const CartMobileLink = () => {
  // Retrieve values from global context
  const { totalPrice = 0, totalQty = 0 } = useGlobalContext();

  // Retrieve cart items from Redux store
  const cartItem = useSelector((state) => state.cartItem?.cart || []);

  // Ensure cartItem is an array
  if (!Array.isArray(cartItem)) {
    console.error('cartItem is not an array. Please check your Redux state.');
    return null;
  }

  return (
    <>
      {cartItem.length > 0 && (
        <div className="sticky bottom-4 px-4">
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-4 rounded-lg text-neutral-100 shadow-lg flex justify-between items-center lg:hidden transition-transform duration-200 hover:scale-105">
            <div className="flex items-center gap-3">
              {/* Shopping Cart Icon */}
              <div className="bg-white p-2 rounded-full text-green-600 shadow-md">
                <TbShoppingCartFilled size={24} />
              </div>
              {/* Cart Details */}
              <div>
                <p className="text-sm font-medium">{totalQty} Items</p>
                <p className="font-bold text-lg">
                  {DisplayPriceSlRupees(totalPrice)}
                </p>
              </div>
            </div>
            {/* View Cart Button */}
            <Link
              to="/cart"
              className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-full font-semibold shadow-md hover:bg-green-100 transition-all"
            >
              <span className="text-sm">View Cart</span>
              <FaCaretRight />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CartMobileLink;





// import React from 'react'
// import { useGlobalContext } from '../provider/GlobalProvider';
// import { FaCartShopping } from 'react-icons/fa6'
// import { DisplayPriceSlRupees } from '../utils/DisplayPriceSlRupees'
// import { Link } from 'react-router-dom'
// import { FaCaretRight } from "react-icons/fa";
// import { useSelector } from 'react-redux'


// const CartMobileLink = () => {
//     const { totalPrice, totalQty} = useGlobalContext()
//     const cartItem = useSelector(state => state.cartItem.cart)

//   return (
//     <>
//         {
//             cartItem[0] && (
//             <div className='sticky bottom-4 p-2'>
//             <div className='bg-green-600 px-2 py-1 rounded text-neutral-100 text-sm  flex items-center justify-between gap-3 lg:hidden'>
//                     <div className='flex items-center gap-2'>
//                         <div className='p-2 bg-green-500 rounded w-fit'>
//                             <FaCartShopping/>
//                         </div>
//                         <div className='text-xs'>
//                                 <p>{totalQty} items</p>
//                                 <p>{DisplayPriceSlRupees(totalPrice)}</p>
//                         </div>
//                     </div>

//                     <Link to={"/cart"} className='flex items-center gap-1'>
//                         <span className='text-sm'>View Cart</span>
//                         <FaCaretRight/>
//                     </Link>
//                 </div>
//             </div>
//             )
//         }
//     </>
    
//   )
// }

// export default CartMobileLink