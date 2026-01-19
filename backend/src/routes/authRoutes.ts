import { Router } from "express";
import { protectedRoutes } from "../middleware/auth";
import { authCallback, getMe } from "../controllers/authController";

const router = Router();

router.get('/me', protectedRoutes, getMe);
router.post('/callback', authCallback);

export default router;