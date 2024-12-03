"use client";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";

const UpdateRolePage: React.FC = () => {
    let router: ReturnType<typeof useRouter> | undefined;

    try {
        router = useRouter(); // Pastikan router diinisialisasi
    } catch (err) {
        console.warn("Router is not mounted, using fallback navigation.");
    }

    const handleUpdateRole = async (): Promise<void> => {
        try {
            const response = await axiosInstance.post<{ message: string }>("/role/update-role");
            alert(response.data.message);

            // Gunakan router jika tersedia, atau fallback ke window.location.href
            if (router) {
                router.push("/login");
            } else {
                window.location.href = "/admin";
            }
        } catch (error: any) {
            console.error("Error updating role:", error);
            alert(error.response?.data?.message || "Gagal memperbarui role. Silakan coba lagi.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Upgrade ke ORGANIZER</h1>
                <p className="mb-6 text-center text-gray-600">
                    Untuk membuat event dan mengelola peserta, Anda perlu menjadi ORGANIZER.
                    Klik tombol di bawah untuk memperbarui role Anda.
                </p>
                <div className="flex justify-center">
                    <button
                        onClick={handleUpdateRole}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Upgrade ke ORGANIZER
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateRolePage;
