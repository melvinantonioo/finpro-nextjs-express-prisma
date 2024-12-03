"use client"
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance"; // Pastikan path-nya benar
import SalesGraph from "./salesGraph";

const DashboardGraph: React.FC = () => {
    const [salesData, setSalesData] = useState<{ date: string; totalSales: number }[]>([]);
    const [loading, setLoading] = useState(true);

    const [timeRange, setTimeRange] = useState("monthly"); // Default timeRange 
    const [totalSales, setTotalSales] = useState<number>(0);

    // Fetch sales data on mount
    useEffect(() => {
        const fetchSalesData = async (range: string) => {
            try {
                const response = await axiosInstance.get("/api/dashboard/sales-graph", {
                    params: { timeRange: range }, // Adjust time range (daily, weekly, monthly)
                });
                if (response.data.success) {
                    setSalesData(response.data.data);
                    setTotalSales(response.data.totalSales); // Update total sales
                }
            } catch (error) {
                console.error("Failed to fetch sales data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData(timeRange);
    }, [timeRange]);

    // Menghitung total penjualan berdasarkan rentang waktu yang dipilih
    const totalSalesByTimeRange = salesData.reduce((acc, item) => acc + item.totalSales, 0);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Organizer Dashboard</h1>

            {/* Dropdown untuk Time Range */}
            <div className="mb-4">
                <label className="block text-gray-600 mb-2" htmlFor="time-range">
                    Pilih Rentang Waktu:
                </label>
                <select
                    id="time-range"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 w-64 text-gray-700"
                >
                    <option value="daily">Harian</option>
                    <option value="weekly">Mingguan</option>
                    <option value="monthly">Bulanan</option>
                    <option value="yearly">Tahunan</option> 
                </select>
            </div>

            {/* Label Total Penjualan */}
            <div className="flex justify-between mb-6">
                <div className="p-4 bg-white shadow rounded-md w-1/3">
                    <h2 className="font-semibold text-gray-700">Total Penjualan Keseluruhan</h2>
                    <p className="text-xl">{totalSales ? totalSales.toLocaleString() : "Loading..."}</p>
                </div>

                {/* Label Penjualan Berdasarkan Rentang Waktu */}

                <div className="p-4 bg-white shadow rounded-md w-1/3">
                    <h2 className="font-semibold text-gray-700">Penjualan Berdasarkan {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}</h2>
                    <ul className="text-xl">
                        {salesData.length > 0 ? (
                            salesData.map((item, index) => (
                                <li key={index}>
                                    <strong>{item.date}</strong>: {item.totalSales.toLocaleString()}
                                </li>
                            ))
                        ) : (
                            <p>Data tidak tersedia</p>
                        )}
                    </ul>
                </div>


            </div>
            {/* Label Total Penjualan Berdasarkan Rentang Waktu */}
            <div className="p-4 bg-white shadow rounded-md w-1/3 mb-2">
                <h2 className="font-semibold text-gray-700">
                    Total Penjualan {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}
                </h2>
                <p className="text-xl">{totalSalesByTimeRange ? totalSalesByTimeRange.toLocaleString() : "Loading..."}</p>
            </div>

            {/* Show Graph or Loading */}
            {loading ? (
                <div className="text-center text-gray-500">Loading sales data...</div>
            ) : (
                <SalesGraph salesData={salesData} />
            )}
        </div>
    );
};

export default DashboardGraph;