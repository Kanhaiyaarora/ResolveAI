import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import Customer from "../models/customer.model.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*", // Allows any origin; configure for production as needed
            methods: ["GET", "POST"]
        }
    });

    // Middleware to authenticate socket connections
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        
        // 1. Check if the connection is from a widget customer (no token)
        if (!token) {
            const sessionId = socket.handshake.query.sessionId;
            const companyId = socket.handshake.query.companyId;
            
            if (sessionId && companyId) {
                socket.user = { role: "customer", sessionId, companyId };
                return next();
            }
            return next(new Error("Authentication error: Missing token or session details"));
        }

        // 2. Verify agent/admin JWT
        try {
            const decoded = jwt.verify(token, CONFIG.JWT_SECRET);
            socket.user = decoded; // Contains id, role, companyId
            next();
        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`[Socket] New connection: ${socket.id}, Role: ${socket.user.role}`);

        const companyId = socket.user.companyId;
        
        // Join tenant-specific company room (e.g., for global tenant notifications)
        socket.join(`company_${companyId}`);

        // Event: User/Agent joining a specific ticket's conversation room
        socket.on("join_ticket", (ticketId) => {
            socket.join(`ticket_${ticketId}`);
            console.log(`[Socket] ${socket.user.role} joined ticket_${ticketId}`);
        });

        // Event: Sending a message within a ticket
        socket.on("send_message", async (data) => {
            const { ticketId, conversationId, message } = data;
            
            try {
                let actualSenderId = socket.user.id; // Will be set for agents/admins

                if (socket.user.role === "customer") {
                    const customer = await Customer.findOne({ 
                        sessionId: socket.user.sessionId, 
                        companyId: socket.user.companyId 
                    });
                    
                    if (!customer) throw new Error("Customer record not found.");
                    actualSenderId = customer._id;
                }

                // 1. Save message to DB
                await Message.create({
                    conversationId,
                    companyId: socket.user.companyId,
                    senderType: socket.user.role === "customer" ? "customer" : "agent",
                    senderId: actualSenderId,
                    senderModel: socket.user.role === "customer" ? "Customer" : "User",
                    content: message
                });

                // 2. Update conversation last message
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: message,
                    lastMessageAt: new Date()
                });

                // 3. Broadcast to the ticket room (excludes sender)
                socket.to(`ticket_${ticketId}`).emit("receive_message", {
                    ticketId,
                    conversationId,
                    message,
                    senderRole: socket.user.role,
                    senderId: socket.user.id || socket.user.sessionId,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error("Socket error saving message:", error);
            }
        });

        // Event: Typing Indicator
        socket.on("typing", (ticketId) => {
            socket.to(`ticket_${ticketId}`).emit("user_typing", {
                ticketId,
                role: socket.user.role
            });
        });

        // Event: User/Agent joining a specific ticket's internal discussion room
        socket.on("join_room", (ticketId) => {
            socket.join(`internal_${ticketId}`);
            console.log(`[Socket] ${socket.user.role} joined internal_room for ticket_${ticketId}`);
        });

        // Event: Sending an internal message
        socket.on("send_internal_message", (data) => {
            const { ticketId, message } = data;
            
            // Broadcast to the internal room
            socket.to(`internal_${ticketId}`).emit("receive_message", {
                ticketId,
                text: message.text,
                senderId: message.senderId,
                createdAt: message.createdAt || new Date().toISOString()
            });
        });

        socket.on("disconnect", () => {
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
};
