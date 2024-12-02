import express from "express";
import { updateRoleToOrganizer } from "../controllers/updateRole";
import { VerifyToken2 } from "@/middlewares/logMiddleware";

const router = express.Router();

// Endpoint untuk memperbarui role
router.post("/update-role", VerifyToken2, updateRoleToOrganizer);

export default router;