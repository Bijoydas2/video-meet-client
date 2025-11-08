import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="navbar bg-base-100 shadow-md px-4 md:px-10 fixed top-0 left-0 right-0 z-50"
      data-aos="fade-down"
    >
      {/* Left Section */}
      <div className="flex-1">
        <a className="text-2xl font-bold text-primary cursor-pointer">
          Video Meet
        </a>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6 text-base">
        <a href="#features" className="hover:text-primary transition">
          Features
        </a>
        <a href="#pricing" className="hover:text-primary transition">
          Pricing
        </a>
        <a href="#about" className="hover:text-primary transition">
          About
        </a>
      </div>

      {/* Right Buttons (Desktop) */}
      <div className="hidden md:flex items-center gap-3">
        <a href="/login" className="btn btn-ghost">Sign In</a>
        <a href="/register" className="btn btn-primary">Get Started</a>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          className="btn btn-ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div
          className="absolute top-16 left-0 w-full bg-base-100 shadow-lg md:hidden border-t border-gray-700"
          data-aos="fade-down"
        >
          <ul className="menu p-4 space-y-3 text-center">
            <li><a href="#features" className="hover:text-primary">Features</a></li>
            <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
            <li><a href="#about" className="hover:text-primary">About</a></li>
            <li><a href="/login" className="btn btn-ghost w-full">Sign In</a></li>
            <li><a href="/register" className="btn btn-primary w-full">Get Started</a></li>
          </ul>
        </div>
      )}
    </div>
  );
}
