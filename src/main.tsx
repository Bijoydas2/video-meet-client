import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./Router/Router";
import AOS from "aos";
import "aos/dist/aos.css";
import AuthProvider from "./Context/AuthProvider";
import { ToastContainer } from "react-toastify";



function Main() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
        <ToastContainer position="top-center" />
    </AuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Main />
  </StrictMode>
);
