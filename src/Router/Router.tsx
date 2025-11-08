import { createBrowserRouter } from "react-router";
import Layout from "../MainLayout/Layout";
import Home from "../Page/Home";
import AuthLayout from "../MainLayout/AuthLayout";
import Login from "../Page/Login/Login";
import Register from "../Page/Register/Resgister";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children:[
            {
                path:'/',
                element:<Home/>
            }
        ]
    },
    {
        path:"/",
        element:<AuthLayout/>,
        children:[
            {
                path:"login",
                element:<Login/>
            },
            {
                path:"register",
                element:<Register/>
            }
        ]
    }
]);