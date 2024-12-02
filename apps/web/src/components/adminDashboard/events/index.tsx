"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaList, FaCalendarAlt, FaPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Style untuk Datepicker
import axiosInstance from "@/lib/axiosInstance";
import Link from "next/link";
import EventForm from "../events/components/editForm";

import debounce from "lodash/debounce";
import { format } from "date-fns";

interface Event {
    id: string;
    name: string;
    description: string;
    date: string;
    location: string;
    availableSeats: number;
    image?: string; 
}

//fixing params axiosinstance

const EventsFilter: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [filterType, setFilterType] = useState<"all" | "past" | "upcoming">("all");
    const [isListView, setIsListView] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const fetchEvents = async () => {
        const response = await axiosInstance.get("/api/dashboard/events");
        setEvents(response.data.events);
    };

    const handleDelete = async (id: string) => {
        try {
            await axiosInstance.delete(`/api/dashboard/${id}`);

            fetchEvents(); 

            // window.location.reload(); 
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };


    const handleSearch = debounce((value: string) => {
        setDebouncedSearchTerm(value);
    }, 500);

    useEffect(() => {

        handleSearch(searchTerm);


        return () => {
            handleSearch.cancel(); 
        };
    }, [searchTerm]); 

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.get(`/api/dashboard/query`, {
                    params: {
                        search: debouncedSearchTerm?.trim() || undefined,
                        filterType: filterType !== "all" ? filterType : undefined,
                        selectedDate: selectedDate
                            ? format(selectedDate, "yyyy-MM-dd")
                            : undefined,
                    },
                });
                setEvents(response.data.events);
            } catch (err) {
                setError("Terjadi kesalahan.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [debouncedSearchTerm, filterType, selectedDate]);

    return (
        <div className="p-4">
            <h2 className="text-3xl font-bold mb-4">Events</h2>

            {/* Kontrol Pencarian dan Filter */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Pencarian */}
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Cari event"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute top-2.5 right-3 text-gray-500" />
                </div>

                {/* Tombol Toggle View */}
                <button
                    onClick={() => setIsListView(!isListView)}
                    className="flex items-center border border-blue-600 text-blue-600 py-1 px-3 rounded-full hover:bg-blue-600 hover:text-white transition"
                >
                    <FaList className="mr-2" /> {isListView ? "Grid" : "List"}
                </button>

                {/* Datepicker */}
                <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-gray-600" />
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date)}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none"
                        placeholderText="Pilih tanggal"
                    />
                </div>

                {/* Dropdown Filter */}
                <select
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as "all" | "past" | "upcoming")}
                >
                    <option value="all">Semua Event</option>
                    <option value="past">Event Lama</option>
                    <option value="upcoming">Event Mendatang</option>
                </select>
            </div>

            {/* Render Event */}
            <div className={isListView ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}>
                {loading ? (
                    <div className="text-center col-span-3">
                        <p className="text-gray-600">Memuat event...</p>
                    </div>
                ) : error ? (
                    <div className="text-center col-span-3">
                        <p className="text-red-600">{error}</p>
                    </div>
                ) : events.length > 0 ? (
                    events.map((event) => (
                        <motion.div
                            key={event.id}
                            // whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)" }}  terdapat bug disini , tampilan glitch 
                            className="p-4 border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-white transition-all duration-300"
                        >
                            {event.image && (
                                <div className="h-40 overflow-hidden">
                                    <img src={event.image} alt={event.name} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(event.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-gray-500">Lokasi: {event.location}</p>
                                <p className="text-sm text-gray-500">Sisa Kursi: {event.availableSeats}</p>
                            </div>

                            <button onClick={() => { setShowForm(true); setSelectedEvent(null); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-4">
                                Tambah Event
                            </button>

                            <div className="flex justify-end gap-2">
                                <button onClick={() => { setShowForm(true); setSelectedEvent(event); }} className="px-4 py-2 bg-yellow-500 text-white rounded-lg">Edit</button>
                                <button onClick={() => handleDelete(event.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg">Hapus</button>
                            </div>

                            <div className="flex items-center justify-end">
                                <Link href='/#' className="flex items-center text-orange-600 hover:text-orange-800">
                                    <FaPlus className="mr-1" /> View Collection
                                </Link>
                            </div>

                            {showForm && selectedEvent && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <div className="bg-white p-6 rounded-lg">
                                        <EventForm
                                            initialData={selectedEvent}
                                            onClose={() => setShowForm(false)}
                                            onSave={fetchEvents}
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center col-span-3">
                        <p className="text-gray-600">Tidak ada event yang ditemukan.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventsFilter;
