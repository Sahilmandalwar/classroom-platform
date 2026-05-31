import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getClassroomMessage, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/:classroomId",authMiddleware, sendMessage );
router.get("/:classroomId", authMiddleware, getClassroomMessage);

export default router;