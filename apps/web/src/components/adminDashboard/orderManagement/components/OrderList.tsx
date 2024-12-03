import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import OrderCard from "./Cards";
import { motion } from "framer-motion";

interface Order {
    id: number;
    amount: number;
    paymentMethod: string;
    status: string;
    createdAt: string;
    proofImage?: string;
    user: {
        name: string;
        email: string;
    };
    event: {
        name: string;
    };
}

interface OrderListProps {
    searchQuery: string;
    filterDate: string;
}

const OrderList: React.FC<OrderListProps> = ({ searchQuery, filterDate }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(1); // Tambahkan state untuk page
    const [totalPages, setTotalPages] = useState(1); // Total halaman dari API
    const [loading, setLoading] = useState(false); // State loading

   
    const fetchOrders = async (currentPage: number) => {
        setLoading(true); 
        try {
            const response = await axiosInstance.get("/api/dashboard/transactions", {
                params: {
                    search: searchQuery,
                    dateRange: filterDate,
                    page: currentPage, 
                    limit: 10, 
                },
            });
            setOrders(response.data.transactions);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false); 
        }
    };

   
    useEffect(() => {
        fetchOrders(page);
    }, [searchQuery, filterDate, page]);

    return (
        <div>
            {/* Daftar Orders */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="text-gray-500">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-gray-500">No orders to show</div>
                ) : (
                    orders.map((order) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <OrderCard order={order} />
                        </motion.div>
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className={`px-4 py-2 rounded ${page === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                    Previous
                </button>
                <span>
                    Page {page} of {totalPages}
                </span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className={`px-4 py-2 rounded ${page === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default OrderList;
