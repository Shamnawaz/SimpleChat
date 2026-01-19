import { Router } from "express";
import { protectedRoutes } from "../middleware/auth";
import { getMessages } from "../controllers/messageController";

const router = Router();

router.get('/chat/:chatId', protectedRoutes, getMessages);

export default router;