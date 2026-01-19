import express from "express";
import { clerkMiddleware } from "@clerk/express";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json()) // Parses incoming JSON request bodies and makes them available as req.body in your route handlers.

app.use(clerkMiddleware());

app.get('/health', (req, res) => {
    res.json({ status: "OK", message: "Server is running" })
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);


export default app;
