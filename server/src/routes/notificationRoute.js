import express from "express";
import { getNotification, markAllNotification, readNotification } from "../controllers/notificationController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/",authMiddleware, getNotification);
router.patch("/:notificationId/read",authMiddleware,readNotification );
router.patch("/read-all", authMiddleware, markAllNotification)

export default router;