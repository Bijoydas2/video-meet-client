import React from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { Outlet } from 'react-router';


const Layout = () => {
    return (
        <div>
            <Navbar />
            <div className='min-h-screen'>
                 <Outlet/>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;