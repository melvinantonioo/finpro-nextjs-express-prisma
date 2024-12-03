import request from 'supertest';
import app from '../app'; // pastikan untuk mengimpor aplikasi express Anda
import prisma from '@/prisma'; // impor Prisma untuk mengakses database
import { transporter } from '../lib/mail'; // untuk mock mail
// import { generateReferralCode } from '../controllers/userController'; // untuk helper function
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('@/prisma'); // Mock prisma untuk unit testing
jest.mock('../lib/mail'); // Mock transporter mail agar tidak mengirim email nyata

describe('User Registration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if email already exists', async () => {
        const existingUser = { email: 'test@example.com' };
        prisma.user.findUnique = jest.fn().mockResolvedValue(existingUser);

        const response = await request(app)
            .post('/register')
            .send({ email: 'test@example.com', password: 'password123', name: 'Test User', role: 'user', referralCode: null });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Email sudah terdaftar');
    });

    it('should create a new user and send a registration email', async () => {
        prisma.user.findUnique = jest.fn().mockResolvedValue(null); // No user found
        prisma.user.create = jest.fn().mockResolvedValue({
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: 'user',
            referralCode: 'TEST1234',
        });

        prisma.$transaction = jest.fn().mockResolvedValue({
            newUser: { id: 1, name: 'Test User', email: 'test@example.com', role: 'user', referralCode: 'TEST1234' },
            discountVoucher: null,
        });

        transporter.sendMail = jest.fn(); // Mock the email sending

        const response = await request(app)
            .post('/register')
            .send({ email: 'test@example.com', password: 'password123', name: 'Test User', role: 'user', referralCode: null });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Registrasi berhasil');
        expect(transporter.sendMail).toHaveBeenCalled();
        expect(prisma.user.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                name: 'Test User',
                email: 'test@example.com',
                role: 'ORGANIZER',
                referralCode: expect.any(String), // Referral code is generated dynamically
            }),
        });
    });

    it('should return 400 if referral code is invalid', async () => {
        prisma.user.findUnique = jest.fn().mockResolvedValueOnce(null); // User not found
        prisma.user.findUnique = jest.fn().mockResolvedValueOnce({ id: 2, referralCode: 'REFERRAL123' }); // Simulate valid referrer
        prisma.user.create = jest.fn().mockResolvedValue({
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
            role: 'ORGANIZER',
            referralCode: 'TEST1234',
        });

        prisma.$transaction = jest.fn().mockRejectedValue(new Error('Invalid referral code'));

        const response = await request(app)
            .post('/register')
            .send({ email: 'test@example.com', password: 'password123', name: 'Test User', role: 'user', referralCode: 'INVALIDCODE' });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Kode referral tidak valid');
    });
});



// import request from 'supertest';
// import app from '../app';  // Pastikan untuk mengimpor aplikasi yang benar

// describe('Auth API', () => {
//     let token: string;

//     it('should register a user with referral code', async () => {
//         const response = await request(app)
//             .post('/auth/regis')
//             .send({
//                 name: 'Bob',
//                 email: 'bob@example.com',
//                 password: 'password123',
//                 role: 'ORGANIZER',
//                 referralCode: 'BOB456',
//             });
//         expect(response.status).toBe(201);
//         expect(response.body.message).toBe('Registrasi berhasil');
//         token = response.body.token; // Ambil token untuk pengujian selanjutnya
//     });

//     it('should login successfully and return token', async () => {
//         const response = await request(app)
//             .post('/auth/login')
//             .send({
//                 email: 'bob@example.com',
//                 password: 'password123',
//             });
//         expect(response.status).toBe(200);
//         expect(response.body.message).toBe('Login successful');
//         expect(response.body.token).toBeDefined();
//     });

//     it('should fetch user data with valid token', async () => {
//         const response = await request(app)
//             .get('/auth/user')
//             .set('Authorization', `Bearer ${token}`); // Kirim token
//         expect(response.status).toBe(200);
//         expect(response.body).toHaveProperty('id');
//         expect(response.body).toHaveProperty('name');
//     });
// });
