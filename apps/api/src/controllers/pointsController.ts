import { Request, Response } from 'express';
import prisma from '../prisma';


export const getUserPointsUser = async (req: Request, res: Response) => {
    try {
        // Validasi apakah pengguna sudah diautentikasi
        if (!req.user) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        }

        // Fetch data user berdasarkan ID user yang ada di token
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                points: true, // Mengambil hanya poin user
                pointTransactions: {
                    select: {
                        points: true,
                        reason: true,
                        createdAt: true,
                        expiresAt: true,
                    },
                },
            },
        });

        // Validasi jika user tidak ditemukan
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Struktur respons dengan poin terkini dan histori transaksi poin
        res.status(200).json({
            points: user.points,
            transactions: user.pointTransactions.map((transaction) => ({
                points: transaction.points,
                reason: transaction.reason,
                createdAt: transaction.createdAt,
                expiresAt: transaction.expiresAt,
            })),
        });
    } catch (error) {
        console.error("Get points error:", error);
        res.status(500).json({
            message: "Failed to fetch points",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const getReferralCode = async (req: Request, res: Response) => {
    try {
        
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        // Ambil referral code dari database berdasarkan ID pengguna
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { referralCode: true },
        });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json({
            message: "Referral code retrieved successfully",
            referralCode: user.referralCode,
        });
    } catch (error) {
        console.error("Error retrieving referral code:", error);
        res.status(500).json({
            message: "Failed to retrieve referral code",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

