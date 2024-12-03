import express from 'express';
import { loginUser, registerUserReff } from '../controllers/authController';
import { LoginValidation, RegisterValidation } from '@/middlewares/validation/auh.validation';
import { VerifyToken2 } from '@/middlewares/logMiddleware';
import prisma from '@/prisma';

const router = express.Router();

router.post('/login', LoginValidation, loginUser);
router.post('/regis', RegisterValidation, registerUserReff);

router.get("/user", VerifyToken2, async (req, res) => {
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    res.status(200).json(user);
});


export default router;