import { Request, Response } from "express";
import prisma from "../prisma";
import { User } from "@prisma/client";

/**
 * Controller untuk mendapatkan data penjualan
 */
export const getSalesData = async (req: Request, res: Response) => {
    const organizerId = req.user!.id; 
    const { timeRange = "monthly" } = req.query; 



    try {
        let startDate: Date;
        const today = new Date();

        switch (timeRange) {
            case "daily":
                startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                break;
            case "weekly":
                startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                break;
            case "monthly":
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case "yearly":
                startDate = new Date(today.getFullYear(), 0, 1);
                break;
            default:
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
        }

        // Query untuk mendapatkan data penjualan
        const salesData = await prisma.order.groupBy({
            by: ["createdAt"], // Group berdasarkan tanggal
            _sum: {
                totalPrice: true, // Hitung total penjualan
            },
            where: {
                event: {
                    organizerId, // Hanya event yang dibuat oleh organizer ini
                },
                createdAt: {
                    gte: startDate, // Tanggal mulai dari rentang waktu
                },
                status: "COMPLETED", // Hanya order dengan status "COMPLETED"
            },
            orderBy: {
                createdAt: "asc", // Urutkan berdasarkan tanggal
            },
        });

        // Format data untuk dikembalikan ke frontend
        const formattedData = salesData.map((item) => ({
            date: item.createdAt.toISOString().split("T")[0], // Format tanggal
            totalSales: item._sum.totalPrice || 0,
        }));

        console.log("Time range:", timeRange);
        console.log("Organizer ID:", organizerId);
        console.log("Query result:", salesData);

        res.status(200).json({
            success: true,
            data: formattedData,
        });
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch sales data",
        });
    }
};

export const getOrganizerStats = async (req: Request, res: Response) => {
    const { id: organizerId } = req.user as User;

    try {
        const totalAttendees = await prisma.order.aggregate({
            where: {
                event: {
                    organizerId,
                },
                status: "COMPLETED",
            },
            _sum: {
                ticketQty: true,
            },
        });

        const totalEvents = await prisma.event.count({
            where: {
                organizerId,
            },
        });

        res.status(200).json({
            totalAttendees: totalAttendees._sum.ticketQty || 0,
            totalEvents,
        });
    } catch (error) {
        console.error("Error fetching organizer stats:", error);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};