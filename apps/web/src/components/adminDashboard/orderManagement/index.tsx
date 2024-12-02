"use client";
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import OrderList from "./components/OrderList";

const OrderSectionManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterDate, setFilterDate] = useState(""); 
    const [orders, setOrders] = useState([]); 

    const handleSearch = (query: string) => {
        setSearchQuery(query); 
    };

    const handleFilterDate = (date: string) => {
        setFilterDate(date); 
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Order Management</h1>
            <SearchBar onSearch={handleSearch} onFilterDate={handleFilterDate} />
            <OrderList searchQuery={searchQuery} filterDate={filterDate} />
        </div>
    );
};

export default OrderSectionManagement;

//munculin , nama dan email pembelinya , dan order numbernya
//Optimize , Debounce Pencaharian , Input Bar , dan Time Range 