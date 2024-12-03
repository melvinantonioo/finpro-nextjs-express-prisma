// seed.ts

import { PrismaClient, Role, EventType, OrderStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Hash passwords
    const passwordAlice = await bcrypt.hash('password123', 10);
    const passwordBob = await bcrypt.hash('password123', 10);
    const passwordCharlie = await bcrypt.hash('password123', 10);


    // //create sample
    // const sample = await prisma.sample.create({
    //     data: {
    //         name: 'john',
    //         code: 'uyigy'
    //     }
    // })

    // // Create Users
    // const alice = await prisma.user.create({
    //     data: {
    //         name: 'Alice',
    //         email: 'alice@example.com',
    //         password: passwordAlice,
    //         role: Role.ORGANIZER,
    //         referralCode: 'ALICE123',
    //         points: 0,
    //     },
    // });

    // const bob = await prisma.user.create({
    //     data: {
    //         name: 'Bob',
    //         email: 'bob@example.com',
    //         password: passwordBob,
    //         role: Role.ATTENDEE,
    //         referralCode: 'BOB456',
    //         points: 10000,
    //     },
    // });

    // const charlie = await prisma.user.create({
    //     data: {
    //         name: 'Charlie',
    //         email: 'charlie@example.com',
    //         password: passwordCharlie,
    //         role: Role.ATTENDEE,
    //         referralCode: 'CHARLIE789',
    //         points: 10000,
    //     },
    // });

    // // Create Referrals
    // const referral1 = await prisma.referral.create({
    //     data: {
    //         referrerId: alice.id,
    //         referredUserId: bob.id,
    //         pointsEarned: 10000,
    //         expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    //     },
    // });

    // const referral2 = await prisma.referral.create({
    //     data: {
    //         referrerId: bob.id,
    //         referredUserId: charlie.id,
    //         pointsEarned: 10000,
    //         expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    //     },
    // });

    // // Create PointTransactions
    // await prisma.pointTransaction.createMany({
    //     data: [
    //         {
    //             userId: alice.id,
    //             points: 10000,
    //             expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    //             reason: 'Referral bonus from Bob',
    //         },
    //         {
    //             userId: bob.id,
    //             points: 10000,
    //             expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    //             reason: 'Referral bonus from Charlie',
    //         },
    //     ],
    // });

    // // Create Categories
    // const categoryTech = await prisma.category.create({
    //     data: {
    //         name: 'Technology',
    //     },
    // });

    // const categoryMusic = await prisma.category.create({
    //     data: {
    //         name: 'Music',
    //     },
    // });

    // Create Events
    // const event1 = await prisma.event.create({
    //     data: {
    //         name: 'Stock Market',
    //         description: 'Mastering The Market.',
    //         price: 100000,
    //         date: new Date('2024-06-10'),
    //         time: new Date('2024-06-10T09:00:00'),
    //         location: 'Jakarta',
    //         capacity: 100,
    //         availableSeats: 98,
    //         type: EventType.PAID,
    //         organizerId: 17,
    //         categories: {
    //             create: [
    //                 {
    //                     categoryId: 9,
    //                 },
    //             ],
    //         },
    //     },
    //     include: {
    //         categories: true,
    //     },
    // });

    // const event2 = await prisma.event.create({
    //     data: {
    //         name: 'Trade Conference',
    //         description: 'A Conference of the Financial Market environtment.',
    //         price: 200000,
    //         date: new Date('2024-07-15'),
    //         time: new Date('2024-07-15T17:00:00'),
    //         location: 'Bandung',
    //         capacity: 500,
    //         availableSeats: 500,
    //         type: EventType.PAID,
    //         organizerId: 17,
    //         categories: {
    //             create: [
    //                 {
    //                     categoryId: 9,
    //                 },
    //             ],
    //         },
    //     },
    //     include: {
    //         categories: true,
    //     },
    // });
    // const event3 = await prisma.event.create({
    //     data: {
    //         name: 'Marketing',
    //         description: 'A Conference of Searching Talent.',
    //         price: 150000,
    //         date: new Date('2024-08-16'),
    //         time: new Date('2024-08-16T17:00:00'),
    //         location: 'Bandung',
    //         capacity: 500,
    //         availableSeats: 500,
    //         type: EventType.PAID,
    //         organizerId: 17,
    //         categories: {
    //             create: [
    //                 {
    //                     categoryId: 8,
    //                 },
    //             ],
    //         },
    //     },
    //     include: {
    //         categories: true,
    //     },
    // });
    // const event4 = await prisma.event.create({
    //     data: {
    //         name: 'Futures Market Mastering',
    //         description: 'A Various Of Futures Contract.',
    //         price: 50000,
    //         date: new Date('2024-09-17'),
    //         time: new Date('2024-09-17T17:00:00'),
    //         location: 'Bandung',
    //         capacity: 500,
    //         availableSeats: 500,
    //         type: EventType.PAID,
    //         organizerId: 17,
    //         categories: {
    //             create: [
    //                 {
    //                     categoryId: 9,
    //                 },
    //             ],
    //         },
    //     },
    //     include: {
    //         categories: true,
    //     },
    // });
    // const event5 = await prisma.event.create({
    //     data: {
    //         name: 'Value Investing 101',
    //         description: 'Learn How to do a Value Investing.',
    //         price: 50000,
    //         date: new Date('2024-10-17'),
    //         time: new Date('2024-10-17T17:00:00'),
    //         location: 'Jakarta',
    //         capacity: 500,
    //         availableSeats: 500,
    //         type: EventType.PAID,
    //         organizerId: 17,
    //         categories: {
    //             create: [
    //                 {
    //                     categoryId: 9,
    //                 },
    //             ],
    //         },
    //     },
    //     include: {
    //         categories: true,
    //     },
    // });
    const event6 = await prisma.event.create({
        data: {
            name: 'Western Food',
            description: 'A Various Food And Beverage From Western.',
            price: 50000,
            date: new Date('2024-12-17'),
            time: new Date('2024-12-17T17:00:00'),
            location: 'Jakarta',
            capacity: 500,
            availableSeats: 500,
            type: EventType.PAID,
            organizerId: 17,
            categories: {
                create: [
                    {
                        categoryId: 3,
                    },
                ],
            },
        },
        include: {
            categories: true,
        },
    });

    // // Create Tickets
    // const ticket1 = await prisma.ticket.create({
    //     data: {
    //         eventId: event1.id,
    //         type: 'General Admission',
    //         price: 500000,
    //         quantity: 100,
    //     },
    // });

    // const ticket2 = await prisma.ticket.create({
    //     data: {
    //         eventId: event2.id,
    //         type: 'Free Pass',
    //         price: 0,
    //         quantity: 500,
    //     },
    // });

    // // Create Orders and OrderItems
    // // Order 1 - Bob membeli tiket untuk event1
    // // Order 1 - Bob membeli tiket untuk event1
    // const order1 = await prisma.order.create({
    //     data: {
    //         user: {
    //             connect: { id: bob.id },
    //         },
    //         event: {
    //             connect: { id: event1.id },
    //         },
    //         ticketQty: 1, // Menggunakan field ticketQty
    //         totalPrice: 500000,
    //         status: OrderStatus.COMPLETED,
    //         createdAt: new Date(),
    //         OrderItem: {
    //             create: [
    //                 {
    //                     ticket: {
    //                         connect: { id: ticket1.id },
    //                     },
    //                     quantity: 1,
    //                     price: 500000,
    //                 },
    //             ],
    //         },
    //     },
    //     include: {
    //         OrderItem: true,
    //     },
    // });

    // // Order 2 - Charlie membeli tiket untuk event1
    // const order2 = await prisma.order.create({
    //     data: {
    //         user: {
    //             connect: { id: charlie.id },
    //         },
    //         event: {
    //             connect: { id: event1.id },
    //         },
    //         ticketQty: 1,
    //         totalPrice: 500000,
    //         status: OrderStatus.COMPLETED,
    //         createdAt: new Date(),
    //         OrderItem: {
    //             create: [
    //                 {
    //                     ticket: {
    //                         connect: { id: ticket1.id },
    //                     },
    //                     quantity: 1,
    //                     price: 500000,
    //                 },
    //             ],
    //         },
    //     },
    //     include: {
    //         OrderItem: true,
    //     },
    // });

    // // Update availableSeats and ticket quantity
    // await prisma.event.update({
    //     where: { id: event1.id },
    //     data: {
    //         availableSeats: { decrement: 2 },
    //     },
    // });

    // await prisma.ticket.update({
    //     where: { id: ticket1.id },
    //     data: {
    //         quantity: { decrement: 2 },
    //     },
    // });

    // // Create Transactions
    // await prisma.transaction.createMany({
    //     data: [
    //         {
    //             userId: bob.id,
    //             eventId: event1.id,
    //             orderId: order1.id,
    //             amount: 500000,
    //             paymentMethod: 'CreditCard',
    //             status: PaymentStatus.COMPLETED,
    //             createdAt: new Date(),
    //         },
    //         {
    //             userId: charlie.id,
    //             eventId: event1.id,
    //             orderId: order2.id,
    //             amount: 500000,
    //             paymentMethod: 'CreditCard',
    //             status: PaymentStatus.COMPLETED,
    //             createdAt: new Date(),
    //         },
    //     ],
    // });

    // // Create Promotion
    // await prisma.promotion.create({
    //     data: {
    //         eventId: event1.id,
    //         code: 'EARLYBIRD',
    //         discountRate: 10.0,
    //         validUntil: new Date('2023-12-31'),
    //         maxUses: 50,
    //         currentUses: 2,
    //     },
    // });

    // // Create Reviews
    // await prisma.review.createMany({
    //     data: [
    //         {
    //             userId: bob.id,
    //             eventId: event1.id,
    //             rating: 5,
    //             comment: 'Great event!',
    //             createdAt: new Date(),
    //         },
    //         {
    //             userId: charlie.id,
    //             eventId: event1.id,
    //             rating: 4,
    //             comment: 'Very informative.',
    //             createdAt: new Date(),
    //         },
    //     ],
    // });
    // console.log("Seeding data...");

    // // Buat Event Organizer
    // const organizer = await prisma.user.create({
    //     data: {
    //         name: "Event Organizer",
    //         email: `organizer${Date.now()}@example.com`,
    //         password: "hashed_password", // Pastikan di-hash sesuai dengan implementasi Anda
    //         role: "ORGANIZER",
    //         referralCode: `ORG${Date.now()}`,
    //     },
    // });

    // console.log("Organizer created:", organizer);

    // // Buat Event
    // const event = await prisma.event.create({
    //     data: {
    //         name: "Tech Conference",
    //         description: "A conference about the latest in tech.",
    //         price: 100.0,
    //         date: new Date("2024-01-15"),
    //         time: new Date("2024-01-15T10:00:00"),
    //         location: "San Francisco",
    //         capacity: 200,
    //         availableSeats: 200,
    //         type: "PAID",
    //         organizerId: organizer.id,
    //     },
    // });

    // console.log("Event created:", event);

    // // // Buat Attendees
    // const attendees = await Promise.all(
    //     Array.from({ length: 10 }).map(async (_, i) => {
    //         const attendee = await prisma.user.create({
    //             data: {
    //                 name: `Attendee ${i + 1}`,
    //                 email: `attendee${i + 1}@example.com`,
    //                 password: "hashed_password", // Pastikan di-hash
    //                 role: "ATTENDEE",
    //                 referralCode: `REF${i + 1}`,
    //             },
    //         });

    //         console.log("Attendee created:", attendee);

    //         // Buat Order untuk Attendee
    //         const ticketQty = Math.ceil(Math.random() * 5); // Random tiket 1-5
    //         const order = await prisma.order.create({
    //             data: {
    //                 userId: attendee.id,
    //                 eventId: event.id,
    //                 ticketQty,
    //                 totalPrice: ticketQty * event.price,
    //                 status: "COMPLETED",
    //             },
    //         });

    //         console.log(`Order created for ${attendee.name}:`, order);

    //         return attendee;
    //     })
    // );

    // Buat order dummy
    const orders = await prisma.order.createMany({
        data: [
            {
                userId: 2, // Attendee 1
                eventId: 15, // Music Festival
                ticketQty: 2,
                totalPrice: 100000,
                status: 'COMPLETED',
            },
            {
                userId: 3, // Attendee 2
                eventId: 14, // Music Festival
                ticketQty: 1,
                totalPrice: 150000,
                status: 'COMPLETED',
            },
            {
                userId: 4, // Attendee 3
                eventId: 13, // Tech Conference
                ticketQty: 3,
                totalPrice: 450000,
                status: 'COMPLETED',
            },
            {
                userId: 5, // Attendee 1
                eventId: 12, // Music Festival
                ticketQty: 2,
                totalPrice: 400000,
                status: 'COMPLETED',
            },
            {
                userId: 6, // Attendee 2
                eventId: 11, // Music Festival
                ticketQty: 1,
                totalPrice: 100000,
                status: 'COMPLETED',
            },
            {
                userId: 7, // Attendee 3
                eventId: 10, // Tech Conference
                ticketQty: 3,
                totalPrice: 50000,
                status: 'COMPLETED',
            },
        ],
    });

    // Buat transaksi dummy
    const transactions = await prisma.transaction.createMany({
        data: [
            {
                userId: 2, // Attendee 1
                eventId: 15, // Music Festival
                orderId: 7,
                amount: 100000,
                paymentMethod: 'Transfer',
                status: 'COMPLETED',
            },
            {
                userId: 3, // Attendee 2
                eventId: 14, // Music Festival
                orderId: 8,
                amount: 150000,
                paymentMethod: 'Transfer',
                status: 'COMPLETED',
            },
            {
                userId: 4, // Attendee 3
                eventId: 13, // Tech Conference
                orderId: 9,
                amount: 450000,
                paymentMethod: 'Transfer',
                status: 'COMPLETED',
            },
            {
                userId: 5, // Attendee 1
                eventId: 12, // Music Festival
                orderId: 10,
                amount: 400000,
                paymentMethod: 'Transfer',
                status: 'COMPLETED',
            },
            {
                userId: 6, // Attendee 2
                eventId: 11, // Music Festival
                orderId: 11,
                amount: 100000,
                paymentMethod: 'Transfer',
                status: 'COMPLETED',
            },
            {
                userId: 7, // Attendee 3
                eventId: 10, // Tech Conference
                orderId: 12,
                amount: 50000,
                paymentMethod: 'Transfer',
                status: 'COMPLETED',
            },
        ],
    });

    console.log("All attendees created:");

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });