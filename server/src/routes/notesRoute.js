import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js"
import { upload } from "../middlewares/uploadMiddleware.js";
import { deleteNotes, getClassroomNotes, uploadNotes } from "../controllers/notesController.js";


const router = express.Router();
router.post("/upload/:classroomId", authMiddleware,upload.single('file'), uploadNotes);
router.get("/:classroomId", authMiddleware, getClassroomNotes);
router.delete('/:noteId', authMiddleware, deleteNotes);

export default router;