import { Request, Response } from "express";
import prisma from "../prisma"; // Sesuaikan dengan prisma instance Anda

export const createOrUpdateOrganizer = async (req: Request, res: Response) => {
    const { name, userId } = req.body;
    const file = req.file; 

    if (!userId || !name) {
        res.status(400).json({ error: "User ID and name are required" });
        return;
    }

    try {
        // Simpan URL logo (jika diupload)
        const logoUrl = file ? `/uploads/${file.filename}` : undefined;

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(userId) },
            data: {
                name,
                photo: logoUrl || undefined, // Update logo hanya jika ada file baru
                role: "ORGANIZER", // Pastikan role diset ke ORGANIZER
            },
        });

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating organizer:", error);
        res.status(500).json({ error: "Failed to update organizer" });
    }
};

export const getOrganizers = async (req: Request, res: Response) => {
    try {
        const organizers = await prisma.user.findMany({
            where: { role: "ORGANIZER" },
            select: {
                id: true,
                name: true,
                photo: true,
            },
        });

        res.json({ success: true, organizers });
    } catch (error) {
        console.error("Error fetching organizers:", error);
        res.status(500).json({ error: "Failed to fetch organizers" });
    }
};