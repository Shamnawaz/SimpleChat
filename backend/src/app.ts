import express from "express";
import path from "path";
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
    res.json({ status: "OK", message: "Server is running" });
});

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../web/dist')));
    app.get('/{*any}', (req, res) => {
        res.sendFile(path.join(__dirname, '../../web/dist/index.html'));
    });
}


export default app;
