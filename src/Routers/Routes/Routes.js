import Main from "../../Layout/Main";
import AboutUs from "../../Pages/AboutUs/AboutUs";
import Login from "../../Pages/AuthenticationPages/LoginPage/Login";
import Register from "../../Pages/AuthenticationPages/RegisterPage/Register";
import BillingPage from "../../Pages/BillingPage/BillingPage";
import Home from "../../Pages/Homepage/Home";
import ErrorPage from "../../Pages/Shared/ErrorPage";
import PrivateRoutes from "../PrivateRoutes/PrivateRoutes";

const { createBrowserRouter } = require("react-router-dom");

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Main></Main>,
        errorElement: <ErrorPage></ErrorPage>,
        children: [
            {
                path: '/',
                element: <Home></Home>
            },
            {
                path: '/about',
                element: <AboutUs></AboutUs>
            },
            {
                path: '/billing',
                element: <PrivateRoutes><BillingPage></BillingPage></PrivateRoutes>
            },
            {
                path: '/login',
                element: <Login></Login>
            },
            {
                path: '/register',
                element: <Register></Register>
            }
        ]

    },

])