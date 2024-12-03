import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface SalesGraphProps {
    salesData: { date: string; totalSales: number }[];
}

const SalesGraph: React.FC<SalesGraphProps> = ({ salesData }) => {
    // Transform the sales data into Chart.js-compatible format
    const labels = salesData.map((item) => item.date); // Dates
    const dataValues = salesData.map((item) => item.totalSales); // Sales amounts

    const data = {
        labels,
        datasets: [
            {
                label: "Total Sales",
                data: dataValues,
                borderColor: "rgb(75, 192, 192)", // Line color
                backgroundColor: "rgba(75, 192, 192, 0.2)", // Area fill color
                tension: 0.3, // Smooth curve
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Sales Over Time",
            },
        },
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-md">
            <Line data={data} options={options} />
        </div>
    );
};

export default SalesGraph;