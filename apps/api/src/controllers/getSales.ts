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
            default:
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
        }

        const salesData = await prisma.order.groupBy({
            by: ["createdAt"], 
            _sum: {
                totalPrice: true, 
            },
            where: {
                event: {
                    organizerId, 
                },
                createdAt: {
                    gte: startDate, 
                },
                status: "COMPLETED", 
            },
            orderBy: {
                createdAt: "asc", 
            },
        });

        // Format data untuk dikembalikan ke frontend
        const formattedData = salesData.map((item) => ({
            date: item.createdAt.toISOString().split("T")[0], 
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