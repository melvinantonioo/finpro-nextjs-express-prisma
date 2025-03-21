import { Request, Response } from "express";
import prisma from "../prisma";
import { startOfDay, endOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { add } from "date-fns";
import { User } from "../custom";
import { Prisma } from "@prisma/client";
import { parseISO } from 'date-fns';


export const getEvents = async (req: Request, res: Response) => {
    const { search, filterType, selectedDate, organizerId } = req.query;  // Pastikan ada parameter organizerId

    try {
        const query: any = {};

        // Filter berdasarkan pencarian nama event
        if (search && typeof search === "string") {
            query.name = { contains: search, mode: "insensitive" };
        }

        // Filter berdasarkan organizerId
        if (organizerId && typeof organizerId === "string") {
            query.organizerId = parseInt(organizerId, 10);  // Mengonversi organizerId menjadi integer
        }

        // Filter berdasarkan jenis event (upcoming, past)
        if (filterType === "past") {
            query.date = { lt: new Date() };
        } else if (filterType === "upcoming") {
            query.date = { gte: new Date() };
        }

        // Filter berdasarkan tanggal yang dipilih
        if (selectedDate && typeof selectedDate === "string") {
            const localDate = toZonedTime(new Date(selectedDate), "Asia/Jakarta");
            const localStartOfDay = startOfDay(localDate);
            const localEndOfDay = endOfDay(localDate);

            query.date = {
                gte: add(localStartOfDay, { hours: -7 }),  // Sesuaikan timezone jika perlu
                lte: add(localEndOfDay, { hours: -7 }),
            };
        }

        // Query ke Prisma dengan filter yang telah diterapkan
        const events = await prisma.event.findMany({
            where: query,
            include: { organizer: true },
        });

        // Kembalikan hasil events
        res.json({ success: true, events });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ success: false, message: "Failed to fetch events" });
    }
};


export const getEventById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) },
            include: { organizer: true },
        });

        if (!event) res.status(404).json({ success: false, message: "Event not found" });
        return;

        res.json({ success: true, data: event });
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ success: false, message: "Failed to fetch event" });
    }
};


export const createEvent = async (req: Request, res: Response) => {
    const { name, description, price, date, time, location, capacity, organizerId, type } = req.body;

    try {
        const newEvent = await prisma.event.create({
            data: {
                name,
                description,
                price,
                date: new Date(date),
                time: new Date(time),
                location,
                capacity,
                availableSeats: capacity,
                organizerId,
                type,
            },
        });

        res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ success: false, message: "Failed to create event" });
    }
};


export const updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { id: organizerId } = req.user as User;
    const { date, ...rest } = req.body;

    try {

        let parsedDate: Date | undefined;
        if (date) {
            parsedDate = parseISO(date);
            if (isNaN(parsedDate.getTime())) {
                res.status(400).json({ success: false, message: "Invalid date format" });
                return
            }
        }


        const updatedEvent = await prisma.event.update({
            where: {
                id: parseInt(id),
                organizerId: organizerId,
            },
            data: {
                ...rest,
                ...(parsedDate ? { date: parsedDate } : {}),
            },
        });

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: updatedEvent,
        });
    } catch (error) {
        console.error("Error updating event:", error);

        // Error handling untuk kasus spesifik
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                res.status(404).json({ success: false, message: "Event not found" });
                return;
            }
        }

        res.status(500).json({ success: false, message: "Failed to update event" });
    }
};


export const deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(`id event : ${id}`)

    if (isNaN(Number(id))) {
        res.status(400).json({ success: false, message: "Invalid event ID" });
        return;
    }

    const organizerId = req.user?.id;
    console.log(`EO Id: ${organizerId}`)

    try {
        const eventToDelete = await prisma.event.findFirst({
            where: { id: parseInt(id), organizerId },
        });
        console.log(`Function Delete: ${eventToDelete}`);

        if (!eventToDelete) {
            res.status(404).json({ success: false, message: "Event not found or not authorized" });
            return
        }

        const deletedEvent = await prisma.event.delete({ where: { id: parseInt(id) } });

        res.json({ success: true, data: deletedEvent });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ success: false, message: "Failed to delete event" });
    }
};