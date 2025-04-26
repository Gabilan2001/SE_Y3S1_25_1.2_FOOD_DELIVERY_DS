import React, { useState } from 'react'
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/Summary';
import AxiosToastError from '../utils/AxiosToastError';
import { Await, Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    // Validation to ensure all fields are filled
    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.Login,
                data: data
            })

            console.log(response.data); 

            if (response.data.error) {
                toast.error(response.data.message || "Error occurred during login");
            } else if (response.data.success) {
                toast.success(response.data.message || "Login successful");
                localStorage.setItem('accesstoken',response.data.data.accesstoken)
                localStorage.setItem('refreshToken',response.data.data.refreshToken)

                const userDetails =await fetchUserDetails()
                dispatch(setUserDetails(userDetails.data))
                setData({
                    email: "",
                    password: "",
                });
                navigate("/");
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="w-full container mx-auto px-2 mt-40">
            <div className="bg-white my-4 w-full max-w-lg mx-auto rounded p-4">
                <p>Login</p>
                <form className="grid gap-2" onSubmit={handleSubmit}>

                    {/* Email Field */}
                    <div className="grid">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            className="bg-blue-50 p-2 border rounded outline-none focus:border-primary-200"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Field */}
                    <div className="grid">
                        <label htmlFor="password">Password:</label>
                        <div className="bg-blue-50 p-2 border rounded flex items-center focus-within:border-primary-200">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                className="w-full outline-none"
                                name="password"
                                value={data.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />
                            <div
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="cursor-pointer"
                            >
                              {
                                showPassword ? (
                                  <FaRegEye />

                                 ) : (<FaRegEyeSlash />

                                 )

                              }
                                
                            </div>
                           
                        </div>
                        <Link to={"/forgot-password"} className='block ml-auto hover:text-primary-200'>Forgot password ?</Link>
                    </div>

                    {/* Login Button */}
                    <button
                        disabled={!valideValue}
                        className={`${valideValue ? "bg-green-500" : "bg-gradient-to-r from-gray-700 to-gray-500"}
                           text-white py-2 px-4 rounded font-semibold tracking-wide transition-all 
                           duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2
                            focus:ring-blue-500 focus:ring-offset-2`}>
                        Login
                    </button>

                </form>

                <p>
                    Don’t have an account? 
                    <Link to={"/register"} className='font-semibold text-green-700 hover:text-green-800'>
                        Register
                    </Link>
                </p>
            </div>
        </section>
    );
};

export default Login;
