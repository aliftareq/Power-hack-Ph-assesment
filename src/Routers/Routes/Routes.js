import Main from "../../Layout/Main";
import Home from "../../Pages/Homepage/Home";
import ErrorPage from "../../Pages/Shared/ErrorPage";

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

        ]

    },

])