import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-5 flex justify-between items-center">
        {/* Logo or Title */}
        <div className="text-lg font-bold">
          <a href="#" className="hover:text-blue-300 text-yellow-200">Event Calendar</a>
        </div>

        {/* Links */}
        {/* <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-blue-300 transition  text-white">Home</a>
          <a href="#" className="hover:text-blue-300 transition  text-white">About</a>
          <a href="#" className="hover:text-blue-300 transition  text-white">Features</a>
          <a href="#" className="hover:text-blue-300 transition  text-white">Contact</a>
        </div> */}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-white focus:outline-none hover:text-blue-300 transition"
            onClick={() => toggleMobileMenu()}
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {/* <div id="mobileMenu" className="md:hidden hidden">
        <div className="bg-blue-700 px-4 py-2 space-y-2">
          <a href="#" className="block text-white hover:text-blue-300 transition">Home</a>
          <a href="#" className="block text-white hover:text-blue-300 transition">About</a>
          <a href="#" className="block text-white hover:text-blue-300 transition">Features</a>
          <a href="#" className="block text-white hover:text-blue-300 transition">Contact</a>
        </div>
      </div> */}
    </nav>
  );

  // Helper function to toggle mobile menu visibility
  function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
  }
};

export default Navbar;
