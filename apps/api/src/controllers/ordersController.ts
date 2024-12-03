import { Request, Response } from 'express';
import prisma from "../prisma";

export const createOrderWithPoint = async (req: Request, res: Response) => {
    const { eventId, ticketQty, usePoints } = req.body; // Ambil event, jumlah tiket, dan poin yang digunakan dari body
    const userId = req.user?.id; // Ambil user ID dari JWT

    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        // 1. Ambil informasi event
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        // 2. Validasi kapasitas event
        if (event.availableSeats < ticketQty) {
            res.status(400).json({ message: 'Not enough seats available' });
            return;
        }

        // 3. Hitung total harga tiket
        const ticketPrice = event.price;
        const totalPrice = ticketPrice * ticketQty;

        // 4. Ambil saldo poin pengguna
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { pointTransactions: true }, // Ambil transaksi poin untuk validasi
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Hitung poin yang dapat digunakan
        const availablePoints = user.points;

        if (usePoints > availablePoints) {
            res.status(400).json({ message: 'Not enough points' });
            return;
        }

        // 5. Kalkulasi diskon dan harga akhir
        const discount = Math.min(usePoints, totalPrice); // Diskon tidak boleh lebih dari harga tiket
        const finalPrice = totalPrice - discount;

        // 6. Buat transaksi di dalam database
        const order = await prisma.$transaction(async (tx) => {
            // Buat order baru
            const newOrder = await tx.order.create({
                data: {
                    userId: userId,
                    eventId: eventId,
                    ticketQty: ticketQty,
                    totalPrice: finalPrice,
                    status: 'COMPLETED',
                },
            });

            // Kurangi kapasitas event
            await tx.event.update({
                where: { id: eventId },
                data: { availableSeats: { decrement: ticketQty } },
            });

            // Kurangi poin pengguna jika digunakan
            if (usePoints > 0) {
                await tx.user.update({
                    where: { id: userId },
                    data: { points: { decrement: discount } },
                });

                // Catat penggunaan poin
                await tx.pointTransaction.create({
                    data: {
                        userId: userId,
                        points: -discount, // Negatif karena digunakan
                        reason: 'Used points for ticket discount',
                        expiresAt: new Date(),
                    },
                });
            }

            return newOrder;
        });

        // 7. Response sukses
        res.status(201).json({
            message: 'Order created successfully',
            order,
            discount,
            finalPrice,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const createOrderWithVoucher = async (req: Request, res: Response) => {
    const { eventId, ticketQty, voucherCode } = req.body; // Ambil event, jumlah tiket, dan voucher dari body
    const userId = req.user?.id; // Ambil user ID dari JWT

    if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    try {
        // 1. Ambil informasi event
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        // 2. Validasi kapasitas event
        if (event.availableSeats < ticketQty) {
            res.status(400).json({ message: 'Not enough seats available' });
            return;
        }

        // 3. Hitung total harga tiket
        const ticketPrice = event.price;
        const totalPrice = ticketPrice * ticketQty;

        // 4. Validasi voucher
        let discount = 0; // Default diskon 0
        if (voucherCode) {
            const voucher = await prisma.voucher.findUnique({
                where: { code: voucherCode },
            });

            if (!voucher) {
                res.status(404).json({ message: 'Voucher not found' });
                return;
            }

            if (voucher.isUsed) {
                res.status(400).json({ message: 'Voucher has already been used' });
                return;
            }

            if (new Date(voucher.expiresAt) < new Date()) {
                res.status(400).json({ message: 'Voucher has expired' });
                return;
            }

            // Hitung diskon berdasarkan nilai voucher
            discount = (voucher.discount / 100) * totalPrice;
        }

        // 5. Kalkulasi harga akhir setelah diskon
        const finalPrice = totalPrice - discount;

        // 6. Buat transaksi di dalam database
        const order = await prisma.$transaction(async (tx) => {
            // Buat order baru
            const newOrder = await tx.order.create({
                data: {
                    userId: userId,
                    eventId: eventId,
                    ticketQty: ticketQty,
                    totalPrice: finalPrice,
                    status: 'COMPLETED',
                },
            });

            // Kurangi kapasitas event
            await tx.event.update({
                where: { id: eventId },
                data: { availableSeats: { decrement: ticketQty } },
            });

            // Tandai voucher sebagai digunakan jika ada
            if (voucherCode) {
                await tx.voucher.update({
                    where: { code: voucherCode },
                    data: { isUsed: true },
                });
            }

            return newOrder;
        });

        // 7. Response sukses
        res.status(201).json({
            message: 'Order created successfully',
            order,
            discount,
            finalPrice,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};