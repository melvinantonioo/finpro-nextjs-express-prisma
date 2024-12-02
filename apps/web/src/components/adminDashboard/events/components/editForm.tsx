import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";

interface EventFormProps {
    initialData?: any; 
    onClose: () => void; 
    onSave: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ initialData, onClose, onSave }) => {
   
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        date: "",
        location: "",
        availableSeats: 0,
    });

    useEffect(() => {
        if (initialData) {
            
            const eventDate = initialData.date
                ? initialData.date.split("T")[0] 
                : "";
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                date: eventDate,
                location: initialData.location || "",
                availableSeats: initialData.availableSeats || 0,
            });
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { date, ...rest } = formData;


            const eventData = {
                ...rest,
                date, 
            };

            if (initialData) {
                // Edit event
                await axiosInstance.put(`/api/dashboard/${initialData.id}`, eventData);
            } else {
                // Create event
                await axiosInstance.post("/api/dashboard/events", eventData);
            }

            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving event:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Nama Event"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
            />
            <textarea
                placeholder="Deskripsi"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
            />
            {/* <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
            /> */}
            <input
                type="text"
                placeholder="Lokasi"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
            />
            <input
                type="number"
                placeholder="Jumlah Kursi Tersedia"
                value={formData.availableSeats}
                onChange={(e) => setFormData({ ...formData, availableSeats: +e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                required
            />
            <div className="flex justify-end gap-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Simpan</button>
            </div>
        </form>
    );
};

export default EventForm;
