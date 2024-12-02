import express from "express";
import { Request, Response } from "express";
import {
    getOrganizerEvents,
    getEventAttendees,
    getEventTransactions,
    getEventStatistics,
} from "../controllers/dashboardController";
import { AdminGuard, VerifyToken2 } from "../middlewares/logMiddleware";
import prisma from "../prisma";
import { getOrganizerStats, getSalesData } from "@/controllers/getSales";
import {
    getEvents,
    createEvent,
    deleteEvent,
    getEventById,
    updateEvent
} from "../controllers/management";
import { createOrUpdateOrganizer, getOrganizers } from "../controllers/profilesEO";

const router = express.Router();
//create 
router.post(
    '/create',
    VerifyToken2,
    AdminGuard,
    createEvent
);

router.get("/events", VerifyToken2, AdminGuard, getOrganizerEvents);
router.get("/events/:eventId/attendees", VerifyToken2, AdminGuard, getEventAttendees);
router.get("/transactions", VerifyToken2, AdminGuard, getEventTransactions);
router.get("/events/:eventId/statistics", VerifyToken2, AdminGuard, getEventStatistics);
//get data sales dengan range time 
router.get("/sales-graph", VerifyToken2, AdminGuard, getSalesData);
//get Events , dan todal attendee
router.get("/get-stats", VerifyToken2, AdminGuard, getOrganizerStats);

//
router.get("/query", VerifyToken2, AdminGuard, getEvents);  //filters Event Management 
router.get("/:id", VerifyToken2, AdminGuard, getEventById);
router.post("/", VerifyToken2, AdminGuard, createEvent);
router.put("/:id", VerifyToken2, AdminGuard, updateEvent);
router.delete("/:id", VerifyToken2, AdminGuard, deleteEvent);

//Eo Profiles
router.post("/profiles", VerifyToken2, AdminGuard, createOrUpdateOrganizer);
router.get("/get-profiles", VerifyToken2, AdminGuard, getOrganizers);

// Order Status
router.patch("/transactions/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        await prisma.transaction.update({
            where: { id: parseInt(id) },
            data: { status },
        });
        res.status(200).json({ message: "Transaction updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update transaction" });
    }
});

//pagination
router.get("/orders", async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    try {
        const orders = await prisma.order.findMany({
            skip: (parseInt(page as string) - 1) * parseInt(limit as string),
            take: parseInt(limit as string),
            include: {
                user: { select: { name: true, email: true } }, // Ambil nama dan email user
                Transaction: { select: { proofImage: true } },
            },
        });

        const totalOrders = await prisma.order.count();

        res.status(200).json({
            orders,
            totalPages: Math.ceil(totalOrders / parseInt(limit as string)),
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

export default router;