import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
//import Search from "../components/Search";
//import Searchpage from "../pages/Searchpage";
//import Login from "../pages/Login";
//import Register from "../pages/Register";
//import ForgotPassword from "../pages/ForgotPassword";
//import OtpVerification from "../pages/OtpVerification";
//import ResetPassword from "../pages/ResetPassword";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import UserManagement from "../pages/UserManagement/UserManagement";
import RestaurantManagement from "../pages/RestaurantManagement/RestaurantManagement";
import FinancialTransactions from "../pages/FinancialTransactions/FinancialTransactions";


const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
         children : [
             {
                 path : "",
                 element : <Home/>
            },

            {
                path: "admin",
                element: <AdminDashboard />,
                children: [
                    {
                        path: "user-management",
                        element: <UserManagement />
                    },
                    {
                        path: "restaurant-management",
                        element: <RestaurantManagement />
                    },
                    {
                        path: "financial-transactions",
                        element: <FinancialTransactions />
                    }
                ]
            }
        //     {
        //         path : "search",
        //         element : <Searchpage/>
        //     },
        //     {
        //         path : "login",
        //         element : <Login/>
        //     },
        //     {
        //         path : "register",
        //         element : <Register/>
        //     },
        //     {
        //         path : "forgot-password",
        //         element : <ForgotPassword/>
        //     },
        //     {
        //         path : "verification-otp",
        //         element : <OtpVerification/>
        //     },
        //     {
        //         path : "reset-password",
        //         element : <ResetPassword/>
         //    },
         
            
           
         ]
    }
])

export default router