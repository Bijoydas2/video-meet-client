import { useContext, useState } from "react";
import logo from "../assets/video.png";
import { Link } from "react-router";
import { AuthContext } from "../Context/AuthProvider";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logOut } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logOut();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar bg-base-100 shadow-md px-4 md:px-10 fixed top-0 left-0 right-0 z-50" data-aos="fade-down">
      {/* Left Section */}
      <div className="flex-1">
        <Link to="/">
          <div className="flex items-center">
            <img src={logo} alt="Video Meet Logo" className="w-10 h-10" />
            <h4 className="text-2xl text-primary font-bold ml-2">Video Meet</h4>
          </div>
        </Link>
      </div>

      {/* Right Section (Desktop) */}
      <div className="hidden md:flex items-center gap-3">
        {/* Always visible Join Meeting button */}
        <Link to="/join-meeting" className="btn btn-secondary">Join Meeting</Link>

        {!user ? (
          <>
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </>
        ) : (
          <div className="relative">
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="btn btn-ghost rounded-full p-1">
              <img
                src={user.photoURL || "https://i.ibb.co/0Jmshvb/default-avatar.png"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </button>
            {isDropdownOpen && (
              <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="btn btn-ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-base-100 shadow-lg md:hidden border-t border-gray-200" data-aos="fade-down">
          <ul className="menu p-4 space-y-3 text-center">
           
            <li><Link to="/join-meeting" className="btn btn-secondary">Join Meeting</Link></li>

            {!user ? (
              <>
                <li><Link to="/login" className="btn btn-active w-full">Sign In</Link></li>
                <li><Link to="/register" className="btn btn-primary w-full">Get Started</Link></li>
              </>
            ) : (
              <>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link to="/profile">Profile</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                  Logout
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
