import { getReferralCode, getUserPointsUser } from '@/controllers/pointsController';
import { VerifyToken2 } from '@/middlewares/logMiddleware';
import prisma from '@/prisma';
import express from 'express';
import { Request, Response } from "express";

const router = express.Router();

router.get('/userpoints', VerifyToken2, getUserPointsUser);  //use this

router.get('/refferal', VerifyToken2, getReferralCode)  //reff

router.get("/vouchers", VerifyToken2, async (req: Request, res: Response) => {   //voucher get
    try {
        if (!req.user) {    //Kasih Validasi agar tidak error ( validasi ini wajib ,  untuk membantu middleware)
            res.status(401).json({ message: 'User not authenticated' });
            return;
        }

        const vouchers = await prisma.voucher.findMany({
            where: { userId: req.user.id },
            select: {
                code: true,
                discount: true,
                expiresAt: true,
                isUsed: true,
            },
            orderBy: { expiresAt: "asc" },
        });

        res.json({ vouchers });
    } catch (error) {
        console.error("Error fetching vouchers:", error);
        res.status(500).json({ message: "Failed to fetch vouchers." });
    }
});

export default router;