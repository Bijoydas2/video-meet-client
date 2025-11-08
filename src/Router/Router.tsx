import { createBrowserRouter } from "react-router";
import Layout from "../MainLayout/Layout";
import Home from "../Page/Home";

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
]);