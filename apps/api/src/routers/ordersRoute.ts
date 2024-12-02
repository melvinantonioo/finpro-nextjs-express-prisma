import express from 'express';
import { VerifyToken2 } from '../middlewares/logMiddleware';
import { createOrderWithPoint, createOrderWithVoucher } from '@/controllers/ordersController';


const router = express.Router();

// Endpoint POST /orders
router.post('/orders', VerifyToken2, createOrderWithPoint);
router.post('/order-voucher', VerifyToken2, createOrderWithVoucher);

export default router;