import { Socket, Server as SocketServer } from "socket.io";
import { Server as HttpServer } from 'http';
import { verifyToken } from "@clerk/express";
import { Message } from "../models/Message";
import { Chat } from "../models/Chat";
import { User } from "../models/User";

// Store online users in memory : userId -> socketId
export const onlineUsers: Map<string, Set<string>> = new Map();

export const initializeSocket = (httpServer: HttpServer) => {

    const allowedOrigin = [
        'http://localhost:5173',
        'http://localhost:8081',
        process.env.FRONTEND_URL as string
    ];

    const io = new SocketServer(httpServer, { cors: { origin: allowedOrigin } });

    // Verify socket connection - if the user is authenticated; we'll store the user id in the socket

    io.use( async (socket, next) => {
        const token = socket.handshake.auth.token;
        if(!token) return next(new Error('Authentication Error'));

        try {
            const session = await verifyToken(token, { secretKey: process.env.CLERK_SECRET_KEY });
            const clerkId = session.sub;
            const user = await User.findOne({ clerkId });
            if(!user) return next(new Error('User not found'));

            socket.data.userId = user._id.toString();

            next();
        } catch (error: any) {
            next(new Error(error));
        }
    });

    // this 'connection' event name is special and should be written like this
    // it's the event that is triggered when a new client connect to the server
    io.on('connection', (socket) => {
        const userId = socket.data.userId;

        // send list of currently online users to the newly connected client
        socket.emit('online-users', { userIds: Array.from(onlineUsers.keys()) });

        // Store user in the onlineUsers Map
        // onlineUsers.set(userId, socket.id);
        const socketIds = onlineUsers.get(userId) ?? new Set<string>();
        socketIds.add(socket.id);
        onlineUsers.set(userId, socketIds);

        // notify others that this current user is online
        socket.broadcast.emit('user-online', { userId });

        socket.join(`user: ${userId}`);

        socket.on('join-chat', async (chatId: string) => {
            try {
                const allowedUser = await Chat.exists({ _id: chatId, participants: userId });
                if(!allowedUser) {
                    socket.emit('socket-error', { message: 'Unauthorized Chat Access' });
                    return;
                }
                socket.join(`chat:${chatId}`);
            } catch (error) {
                socket.emit('socket-error', { message: 'Failed to join chat' });
            }
        });

        socket.on('leave-chat', (chatId: string) => {
            socket.leave(`chat:${chatId}`);
        });

        // handle sending messages
        socket.on('send-message', async (data: {chatId: string, text:string }) => {
            try {
                const {chatId, text} = data;
                const chat = await Chat.findOne({
                    _id: chatId,
                    participants: userId
                });

                if(!chat) {
                    socket.emit('socket-error', { message: 'Chat not found' });
                    return;
                }

                const message = await Message.create({
                    chat: chatId,
                    sender: userId,
                    text,
                });

                chat.lastMessage = message._id;
                chat.lastMessageAt = new Date();
                await chat.save();

                await message.populate('sender', 'name avatar');

                // emit to chat room / user inside the chat
                io.to(`chat:${chatId}`).emit('new-message', message);

                // emit to participants personal room for chat list view
                for(const participantId of chat.participants) {
                    io.to(`user:${participantId}`).emit('new-message', message);
                }
            } catch (error) {
                socket.emit('socket-error', { message: 'Failed to send message' });
            }
        });

        // TODO - LATER
        socket.on('typing', async (data) => {});

        socket.on('disconnect', () => {
            // onlineUsers.delete(userId);
            const socketIds = onlineUsers.get(userId);
            if(!socketIds) return;

            socketIds.delete(socket.id);
            if(socketIds.size === 0) {
                onlineUsers.delete(userId);
                // notify others
                socket.broadcast.emit('user-offline', { userId });
            }
        });
    });

    return io;
}