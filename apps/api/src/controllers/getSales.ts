import { Request, Response } from "express";
import prisma from "../prisma";
import { User } from "@prisma/client";


export const getSalesData = async (req: Request, res: Response) => {
    const organizerId = req.user!.id;
    const { timeRange = "monthly" } = req.query;

    try {
        let startDate: Date;
        const today = new Date();

        // Tentukan tanggal mulai berdasarkan waktu yang dipilih
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

        // Query untuk mendapatkan data penjualan berdasarkan rentang waktu yang dipilih
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

        // Query untuk mendapatkan total penjualan tanpa filter waktu
        const totalSales = await prisma.order.aggregate({
            _sum: {
                totalPrice: true,
            },
            where: {
                event: {
                    organizerId,
                },
                status: "COMPLETED",
            },
        });

        // Format data untuk response
        const formattedData = salesData.map((item) => ({
            date: item.createdAt.toISOString().split("T")[0], // Format hanya tanggal (tanpa waktu)
            totalSales: item._sum.totalPrice || 0, // Penjualan untuk setiap tanggal
        }));


        res.status(200).json({
            success: true,
            data: formattedData, 
            totalSales: totalSales._sum.totalPrice || 0, 
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