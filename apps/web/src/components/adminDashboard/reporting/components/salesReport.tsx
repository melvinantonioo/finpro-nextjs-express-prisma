"use client"
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance"; // Pastikan path-nya benar
import SalesGraph from "./salesGraph";

const DashboardGraph: React.FC = () => {
    const [salesData, setSalesData] = useState<{ date: string; totalSales: number }[]>([]);
    const [loading, setLoading] = useState(true);

    const [timeRange, setTimeRange] = useState("monthly"); // Default timeRange 

    // Fetch sales data on mount
    useEffect(() => {
        const fetchSalesData = async (range: string) => {
            try {
                const response = await axiosInstance.get("/api/dashboard/sales-graph", {
                    params: { timeRange: range }, // Adjust time range (daily, weekly, monthly)
                });
                if (response.data.success) {
                    setSalesData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch sales data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData(timeRange);
    }, [timeRange]);

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