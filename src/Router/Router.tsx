import { createBrowserRouter } from "react-router";
import Layout from "../MainLayout/Layout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />
    },
]);