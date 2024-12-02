import { Request, Response } from "express";
import prisma from "../prisma";
import { User } from '../custom';
import { sub } from "date-fns"; 


export const getOrganizerEvents = async (req: Request, res: Response) => {
    const { id: organizerId } = req.user as User; // Authenticated organizer ID

    try {
        const events = await prisma.event.findMany({
            where: { organizerId },
            select: {
                id: true,
                name: true,
                date: true,
                location: true,
                capacity: true,
                availableSeats: true,
                price: true,
                orders: {
                    select: {
                        id: true,
                        ticketQty: true,
                        totalPrice: true,
                    },
                },
            },
        });

        res.status(200).json({ events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Failed to fetch events" });
    }
};


export const getEventAttendees = async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const { search, dateRange } = req.query;

    try { //fetch dari order
        const attendees = await prisma.order.findMany({
            where: { eventId: Number(eventId) },
            select: {
                id: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                ticketQty: true,
                totalPrice: true,
                createdAt: true,
            },
        });

        res.status(200).json({ attendees });
    } catch (error) {
        console.error("Error fetching attendees:", error);
        res.status(500).json({ message: "Failed to fetch attendees" });
    }
};


export const getEventTransactions = async (req: Request, res: Response) => {
    const { id: organizerId } = req.user as User;
    const { page = 1, limit = 10 } = req.query; // Ambil parameter page dan limit
    const { search = "", dateRange = "" } = req.query;

    try {
        // Pastikan search memiliki tipe string atau undefined
        const searchQuery: string | undefined = typeof search === "string" ? search : undefined;

        let dateFilter = {};
        if (dateRange === "6months") {
            dateFilter = { createdAt: { gte: sub(new Date(), { months: 6 }) } };
        } else if (dateRange === "1year") {
            dateFilter = { createdAt: { gte: sub(new Date(), { years: 1 }) } };
        } else {
            // Default: Past 3 months
            dateFilter = { createdAt: { gte: sub(new Date(), { months: 3 }) } };
        }

        const offset = (Number(page) - 1) * Number(limit);
        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where: {
                    AND: [
                        dateFilter,
                        {
                            OR: [
                                { user: { name: { contains: searchQuery?.toLowerCase() } } },
                                { user: { email: { contains: searchQuery?.toLowerCase() } } },
                                { event: { name: { contains: searchQuery?.toLowerCase() } } },
                            ],
                        },
                        { event: { organizerId } },
                    ],
                    event: {
                        organizerId,
                    },
                },
                select: {
                    id: true,
                    amount: true,
                    paymentMethod: true,
                    status: true,
                    createdAt: true,
                    proofImage: true,
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    event: {
                        select: {
                            name: true,
                        },
                    },
                },
                skip: offset,
                take: Number(limit),
                orderBy: {
                    createdAt: "desc",
                },
            }),
            prisma.transaction.count({
                where: {
                    event: {
                        organizerId,
                    },
                },
            }),
        ]);

        res.status(200).json({
            transactions,
            totalPages: Math.ceil(total / Number(limit)), // Hitung total halaman
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
};



export const getEventStatistics = async (req: Request, res: Response) => {
    const { eventId } = req.params;

    try {
        const statistics = await prisma.event.findUnique({
            where: { id: Number(eventId) },
            select: {
                id: true,
                name: true,
                orders: {
                    select: {
                        ticketQty: true,
                        totalPrice: true,
                    },
                },
            },
        });

        if (!statistics) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        const totalAttendees = statistics.orders.reduce(
            (sum, order) => sum + order.ticketQty,
            0
        );
        const totalRevenue = statistics.orders.reduce(
            (sum, order) => sum + order.totalPrice,
            0
        );

        res.status(200).json({
            eventName: statistics.name,
            totalAttendees,
            totalRevenue,
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ message: "Failed to fetch statistics" });
    }
};