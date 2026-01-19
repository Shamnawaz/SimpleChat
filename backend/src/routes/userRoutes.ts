import { Router } from "express";
import { protectedRoutes } from "../middleware/auth";
import { getUsers } from "../controllers/userController";

const router = Router();

router.get('/', protectedRoutes, getUsers);

export default router;