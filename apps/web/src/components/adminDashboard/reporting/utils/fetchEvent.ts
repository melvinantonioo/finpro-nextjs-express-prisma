import axios from "@/lib/axiosInstance";

export const fetchEventStats = async () => {
    const response = await axios.get(`/api/dashboard/get-stats`);
    return response.data;
}; 