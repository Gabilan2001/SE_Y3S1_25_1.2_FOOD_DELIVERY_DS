import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import Search from './Search';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../hooks/useMobile';
import { FaCartShopping } from "react-icons/fa6";
import { useSelector } from 'react-redux';
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import UserMenu from './UserMenu';
import { DisplayPriceSlRupees } from '../utils/DisplayPriceSlRupees';
import { useGlobalContext } from '../provider/GlobalProvider';
import DisplayCartItem from './DisplayCartItem';

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const cartItem = useSelector(state => state.cartItem.cart);
  const { totalPrice, totalQty } = useGlobalContext();
  const [openCartSection, setOpenCartSection] = useState(false);

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  const handleCloseUserMenu = () => {
    setOpenUserMenu(false);
  };

  const handleMobileUser = () => {
    if (!user._id) {
      navigate("/login");
      return;
    }
    navigate("/user");
  };

  return (
    <div>
      <header className="h-24 lg:h-20 lg:shadow-md fixed top-0 left-0 right-0 z-50 flex-col justify-center gap-1 bg-white">
        {
          !(isSearchPage && isMobile) && (
            <div className="container mx-auto flex items-center px-4 justify-between">
              {/** Logo */}
              <div className="h-full">
                <Link to={"/"} className="h-full flex justify-center items-center">
                  <img
                    src={logo}
                    width={120}
                    height={240}
                    alt="logo"
                    className="hidden lg:block"
                  />
                  <img
                    src={logo}
                    width={60}
                    height={120}
                    alt="logo"
                    className="block lg:hidden"
                  />
                </Link>
              </div>
              {/** Search */}
              <div className='hidden lg:block'>
                <Search />
              </div>
              {/** Login and Cart */}
              <div className='flex items-center gap-4'>
                {/**user icons display in only mobile version */}
                <button className='text-neutral-500 lg:hidden' onClick={handleMobileUser}>
                  <FaRegCircleUser size={25} />
                </button>
                {/** Desktop View */}
                <div className='hidden lg:flex items-center gap-6'>
                  {
                    user?._id ? (
                      <div className='relative'>
                        <div onClick={() => setOpenUserMenu(prev => !prev)} className='flex items-center gap-2 cursor-pointer text-gray-700 hover:text-blue-600'>
                          <p className="font-medium">Account</p>
                          {
                            openUserMenu ? (
                              <MdKeyboardDoubleArrowUp size={25} />
                            ) : (
                              <MdKeyboardDoubleArrowDown size={25} />
                            )
                          }
                        </div>
                        {
                          openUserMenu && (
                            <div className='absolute right-0 top-12'>
                              <div className='bg-white rounded-lg p-4 min-w-52 shadow-lg'>
                                <UserMenu close={handleCloseUserMenu} />
                              </div>
                            </div>
                          )
                        }
                      </div>
                    ) : (
                      <button onClick={redirectToLoginPage} className='text-blue-600 font-semibold hover:underline'>
                        Login
                      </button>
                    )
                  }
                  <button onClick={() => setOpenCartSection(true)} className='flex items-center gap-3 bg-green-500 hover:bg-green-600 px-4 py-2 text-white rounded-lg shadow-md'>
                    {/**add to cart icon */}
                    <div className='animate-bounce'>
                      <FaCartShopping size={20} />
                    </div>
                    <div className='font-semibold text-sm'>
                      {
                        cartItem[0] ? (
                          <div>
                            <p>{totalQty} Items</p>
                            <p>{DisplayPriceSlRupees(totalPrice)}</p>
                          </div>
                        ) : (
                          <p>My Cart</p>
                        )
                      }
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )
        }
        <div className='container mx-auto px-5 lg:hidden'>
          <Search />
        </div>

        {
          openCartSection && (
            <DisplayCartItem close={() => setOpenCartSection(false)} />
          )
        }
      </header>
    </div>
  );
};

export default Header;
