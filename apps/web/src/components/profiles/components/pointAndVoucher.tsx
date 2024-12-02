import React from "react";

interface PointsAndVouchersProps {
    points: number;
    vouchers: {
        code: string;
        discount: number;
        expiresAt: string;
        isUsed: boolean;
    }[];
}

const PointsAndVouchers: React.FC<PointsAndVouchersProps> = ({
    points,
    vouchers,
}) => {
    return (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Points Section */}
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold">Points</h2>
                <p className="text-gray-600 mt-2">
                    Total Points: <span className="font-bold">{points}</span>
                </p>
            </div>

            {/* Vouchers Section */}
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold">Vouchers</h2>
                {vouchers.length === 0 ? (
                    <p className="text-gray-600 mt-2">No vouchers available.</p>
                ) : (
                    <div className="mt-4 grid gap-4">
                        {vouchers.map((voucher) => (
                            <div
                                key={voucher.code}
                                className="bg-gray-100 p-4 rounded shadow-sm flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-bold text-lg">{voucher.code}</p>
                                    <p className="text-sm text-gray-500">
                                        Discount: {voucher.discount}% | Expires:{" "}
                                        {new Date(voucher.expiresAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigator.clipboard.writeText(voucher.code)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Copy Code
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PointsAndVouchers;