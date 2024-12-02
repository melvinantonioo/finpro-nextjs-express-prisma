import axiosInstance from "@/lib/axiosInstance";

export interface OrderCardProps {
    order: {
        id: number;
        event: { name: string };
        user: { name: string; email: string };
        amount: number;
        status: string;
        createdAt: string;
        proofImage?: string;
    };
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
    const handleAccept = async () => {
        try {
            await axiosInstance.patch(`/api/dashboard/transactions/${order.id}`, { status: "COMPLETED" });
            alert("Order Accepted");
        } catch (error) {
            console.error("Failed to accept order:", error);
        }
    };

    const handleReject = async () => {
        try {
            await axiosInstance.patch(`/api/dashboard/transactions/${order.id}`, { status: "CANCELLED" });
            alert("Order Rejected");
        } catch (error) {
            console.error("Failed to reject order:", error);
        }
    };

    return (
        <div className="p-4 border rounded-md shadow-sm hover:shadow-lg">
            <h2 className="text-lg font-bold">{order.event.name}</h2>
            <p className="text-sm text-gray-700">
                <span className="font-semibold">Buyer:</span> {order.user.name} ({order.user.email})
            </p>
            <p>Amount: ${order.amount}</p>
            <p>Status: {order.status}</p>
            <p>Date: {new Date(order.createdAt).toLocaleString()}</p>

            {order.proofImage && (
                <div className="mt-4">
                    <p className="text-sm font-semibold">Proof of Transfer:</p>
                    <img src={order.proofImage} alt="Proof of transfer" className="w-full h-auto rounded-md" />
                </div>
            )}

            {order.status === "PENDING" && (
                <div className="flex gap-2 mt-4">
                    <button onClick={handleAccept} className="bg-green-500 text-white px-4 py-2 rounded">
                        Accept
                    </button>
                    <button onClick={handleReject} className="bg-red-500 text-white px-4 py-2 rounded">
                        Reject
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderCard;
