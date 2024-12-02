import React from 'react'

export interface IReff {
    refferal: string;
}

const Refferal: React.FC<IReff> = ({ refferal }) => {
    return (
        <div>
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-xl font-bold">Points</h2>
                <p className="text-gray-600 mt-2">
                    Refferal Code: <span className="font-bold">{refferal}</span>
                </p>
                <button
                    onClick={() => navigator.clipboard.writeText(refferal)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                    Copy Code
                </button>
            </div>
        </div>
    )
}

export default Refferal;