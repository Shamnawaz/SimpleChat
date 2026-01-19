import { Router } from "express";
import { protectedRoutes } from "../middleware/auth";
import { getChats, getOrCreateChat } from "../controllers/chatController";

const router = Router();

router.use(protectedRoutes);

router.get('/', getChats);
router.post('/with/:participantId', getOrCreateChat);

export default router;