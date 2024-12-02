import express from 'express';
import { loginUser, registerUserReff } from '../controllers/authController';

const router = express.Router();

router.post('/login', loginUser);
router.post('/regis', registerUserReff);


export default router;