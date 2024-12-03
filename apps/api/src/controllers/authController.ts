import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client";
import bcrypt, { genSalt } from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/prisma';

import { transporter } from '../lib/mail';
import path from 'path'
import Handlebars from 'handlebars';
import fs from 'fs'; //filesystem



const generateReferralCode = (name: string): string => {
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4 digit angka acak
    return `${name.toUpperCase()}${randomNumber}`;
};

export const registerUserReff = async (req: Request, res: Response) => {

    const templatePath = path.join(
        __dirname,
        "../templates/",
        "register.hbs"
    )
    const templateSource = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = Handlebars.compile(templateSource);


    const { name, email, password, role, referralCode } = req.body;

    try {
        
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email sudah terdaftar' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const generatedReferralCode = generateReferralCode(name);

        const html = compiledTemplate({ name, emailUser: email });


        // Mulai transaksi
        const result = await prisma.$transaction(async (tx) => {
            // Buat user baru
            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                    referralCode: generatedReferralCode,
                },
            });

            //proses sendmail, bisa langsung coba
            await transporter.sendMail({
                to: email,
                subject: "Registration",
                html
                //langsung pasang sesuai variable kita 
            })

            let discountVoucher = null; 

           
            if (referralCode) {
                // Validasi referral code
                const referrer = await tx.user.findUnique({
                    where: { referralCode },
                });

                if (!referrer) {
                    throw new Error('Invalid referral code');
                }

                // Tambahkan poin dan buat voucher untuk referrer
                await tx.user.update({
                    where: { id: referrer.id },
                    data: { points: { increment: 10000 } },
                });

                await tx.voucher.create({
                    data: {
                        code: `REF-${referrer.id}-${Date.now()}`,
                        discount: 10.0,
                        userId: referrer.id,
                        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
                    },
                });

                // Tambahkan entry ke tabel referral
                await tx.referral.create({
                    data: {
                        referrerId: referrer.id,
                        referredUserId: newUser.id,
                        pointsEarned: 10000,
                        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                    },
                });

                // Buat voucher untuk user baru (hanya jika referral code digunakan)
                discountVoucher = await tx.voucher.create({
                    data: {
                        code: `NEW10-${newUser.id}`,
                        discount: 10.0,
                        userId: newUser.id,
                        expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
                    },
                });
            }

            return {
                newUser,
                discountVoucher,
            };
        });

        // Kembalikan respons sukses
        res.status(201).json({
            message: 'Registrasi berhasil',
            user: {
                id: result.newUser.id,
                name: result.newUser.name,
                email: result.newUser.email,
                role: result.newUser.role,
                referralCode: result.newUser.referralCode,
            },
            discountVoucher: result.discountVoucher,
        });
    } catch (error: any) {
        if (error.message === 'Invalid referral code') {
            res.status(400).json({ message: 'Kode referral tidak valid' });
            return;
        }
        console.error('Error:', error);
        res.status(500).json({ message: 'Registrasi gagal', error: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                role: true,
                referralCode: true
            }
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        // Generate JWT - only include essential, non-sensitive data
        const token = jwt.sign(
            {
                id: user.id,         
                role: user.role,
                email: user.email,
                name: user.name    
            },    
            process.env.SECRET_KEY as string,
            { expiresIn: '1h' }
        );

        // httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',a
        //         sameSite: 'strict',

        res.status(200) 
            .cookie("access_token", token, {

                maxAge: 3600000 // 1 hourd
            })
            .json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    referralCode: user.referralCode
                }
            });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Login failed',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}; 