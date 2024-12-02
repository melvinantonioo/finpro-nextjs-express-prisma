"use client";
import useAuthStore from '@/stores/auth-stores';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
    const router = useRouter();


    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

    const { user, clearAuth } = useAuthStore(); //zustand

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleAccountMenu = () => {
        setIsAccountMenuOpen(!isAccountMenuOpen);
    };

    const handleLogout = () => {
        clearAuth(); // Set state `user` menjadi null dan hapus token dari cookie
        router.push("/");
    };

    return (
        <nav className="flex items-center justify-between p-4 bg-white shadow-md">
            {/* Logo */}
            <div className="text-orange-600 font-bold text-2xl">Event</div>

            {/* Create Button */}
            <div className="hidden md:flex items-center space-x-4">
                <button className="border border-orange-600 text-orange-600 py-1 px-3 rounded-full hover:bg-orange-600 hover:text-white transition">
                    + Create
                </button>
            </div>

            {/* Hamburger Menu Button */}
            <button className="md:hidden" onClick={toggleMenu}>
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Menu Items
            <div className={`md:flex items-center space-x-4 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
                <Link href="/admin">Home</Link>
                <Link href="/admin/events">Events</Link>
                <Link href="/admin/orders">Orders</Link>
                <Link href="/admin/reporting">Reporting</Link>
                <Link href="/admin/settings">Settings</Link>
            </div> */}

            {/* Account Menu */}
            <div className="relative">
                <button
                    className="flex items-center bg-gray-200 rounded-full px-3 py-1 space-x-2 hover:bg-gray-300 transition"
                    onClick={toggleAccountMenu}
                >
                    <div className="bg-blue-600 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center">
                        {user?.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="hidden md:inline-block font-medium">{user?.name || "Guest"}</span>
                    <MdKeyboardArrowDown size={20} />
                </button>

                {/* Account Dropdown */}
                {isAccountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-10">
                        <Link href="/" className="block px-4 py-2 text-sm hover:bg-gray-100">
                            Switch to attending
                        </Link>
                        <Link href="/admin/account-settings" className="block px-4 py-2 text-sm hover:bg-gray-100">
                            Account Settings
                        </Link>
                        <div className="border-t border-gray-200"></div>
                        {/* <Link href="/logout" className="block px-4 py-2 text-sm hover:bg-gray-100">
                            Log out
                            <p className="text-xs text-gray-500">bonk43926@gmail.com</p>
                        </Link> */}
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            Log out
                            <p className="text-xs text-gray-500">{user?.email}</p>
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;