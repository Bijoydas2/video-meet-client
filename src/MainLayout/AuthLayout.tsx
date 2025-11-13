import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router';
import logo from "../assets/video.png";

const AuthLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <footer className="bg-white text-gray-700 py-4 px-6 text-center shadow-inner">
        <div className="flex justify-between px-6">
          <div className="flex items-center justify-center mb-2">
            <img src={logo} alt="Video Meet Logo" className="w-6 h-6" />
            <span className="text-primary font-bold ml-2">Video Meet</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()}{" "}
            <span className="text-primary font-medium">Video Meet</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
