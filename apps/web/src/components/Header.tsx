"use client";
import { useState } from "react";
import { FaSearch, FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import { HiLocationMarker } from "react-icons/hi";
import Link from "next/link";
import useAuthStore from "@/stores/auth-stores"; 
import { useRouter } from "next/navigation";

const NavbarHome: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Untuk hamburger menu
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false); // Untuk account menu
  const { user, clearAuth } = useAuthStore(); // Ambil data user dari Zustand
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAccountMenu = () => {
    setIsAccountMenuOpen(!isAccountMenuOpen); // Toggle untuk account menu
  };

  return (
    <nav className="flex items-center justify-between py-3 px-6 bg-white shadow-md">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link href="/" className="text-orange-600 font-bold text-2xl">event</Link>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex items-center border rounded-full overflow-hidden">
        <FaSearch className="text-gray-500 mx-2" />
        <input
          type="text"
          placeholder="Search events"
          className="p-2 focus:outline-none"
        />
        <div className="flex items-center px-2 border-l border-gray-300">
          <HiLocationMarker className="text-gray-500" />
          <span className="ml-1 text-sm text-gray-600">Jakarta Pusat</span>
        </div>
        <button className="bg-orange-600 text-white p-2 rounded-full">
          <FaSearch />
        </button>
      </div>

      {/* Hamburger Icon */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-gray-600">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Menu Items */}
      <div
        className={`md:flex items-center space-x-4 text-sm ${isMenuOpen
          ? "block"
          : "hidden md:block"
          } absolute md:relative top-16 md:top-0 left-0 md:left-auto w-full md:w-auto bg-white md:bg-transparent md:shadow-none shadow-md md:flex-row flex-col md:space-x-4`}
      >
        <Link href="#" className="block py-2 px-4 hover:text-orange-600">
          Find Events
        </Link>
        <Link href="#" className="block py-2 px-4 hover:text-orange-600">
          Create Events
        </Link>

        {/* Conditional Rendering */}
        {!user ? (
          <>
            <Link href="/login" className="block py-2 px-4 hover:text-orange-600">
              Log In
            </Link>
            <Link href="/register" className="block py-2 px-4 hover:text-orange-600">
              Sign Up
            </Link>
          </>
        ) : (
          <div className="relative">
            {/* Button untuk membuka Account Menu */}
            <button
              className="flex items-center py-2 px-4 space-x-1 hover:text-orange-600"
              onClick={toggleAccountMenu}
            >
              <span className="font-bold">{user.email}</span> {/* Nama User */}
              <FaChevronDown />
            </button>

            {/* Account Menu */}
            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded-md z-50">
                <Link
                  href="/profiles"
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  <span className="mr-2">🔄</span> Profiles
                </Link>
                <Link
                  href="/admin"
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  <span className="mr-2">🔄</span> Manage Event
                </Link>
                <Link
                  href="/account-settings"
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  <span className="mr-2">⚙️</span> Account Settings
                </Link>
                <button
                  className="flex items-center px-4 py-2 text-left w-full hover:bg-gray-100 text-red-600"
                  onClick={() => {
                    clearAuth(); // Reset Zustand state
                    router.push("/"); // Redirect ke halaman utama
                  }}
                >
                  <span className="mr-2">🚪</span> Log out ({user.email})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarHome;