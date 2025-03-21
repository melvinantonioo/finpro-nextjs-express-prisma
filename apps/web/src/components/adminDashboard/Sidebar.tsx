"use client"
import Link from 'next/link';
import { FaHome, FaCalendarAlt, FaFileInvoiceDollar, FaChartBar, FaCog } from 'react-icons/fa';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 h-screen bg-gray-50 shadow-md fixed top-0 left-0 hidden md:block">
            <div className="p-4 text-orange-600 font-bold text-2xl">Dashboard</div>
            <nav className="mt-8">
                <Link href="/admin" className="flex items-center p-4 hover:bg-gray-200 transition">
                    <FaHome className="mr-2" /> Home
                </Link>
                <Link href="/admin/events" className="flex items-center p-4 hover:bg-gray-200 transition">
                    <FaCalendarAlt className="mr-2" /> Events
                </Link>
                <Link href="/admin/orders" className="flex items-center p-4 hover:bg-gray-200 transition">
                    <FaFileInvoiceDollar className="mr-2" /> Orders
                </Link>
                <Link href="/admin/reporting" className="flex items-center p-4 hover:bg-gray-200 transition">
                    <FaChartBar className="mr-2" /> Reporting
                </Link>
                <Link href="/admin/settings" className="flex items-center p-4 hover:bg-gray-200 transition">
                    <FaCog className="mr-2" /> Settings
                </Link>
            </nav>
        </aside>
    );
};

export default Sidebar;