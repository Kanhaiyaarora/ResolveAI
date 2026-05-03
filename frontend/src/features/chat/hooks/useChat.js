import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { getMessages, sendMessage as sendMessageApi, getAiSuggestions } from "../service/chat.api";
import { useSelector } from "react-redux";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useChat = (ticketId) => {
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const { user, token } = useSelector((state) => state.auth);

  // AI suggestions for agents only
  const fetchSuggestions = useCallback(async (lastMessage) => {
    if (user?.role !== "agent") return;
    try {
      const data = await getAiSuggestions(lastMessage);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error("AI suggestions error:", err);
    }
  }, [user?.role]);

  // Socket + message history
  useEffect(() => {
    if (!ticketId || !token) return;

    // 1. Fetch message history
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMessages(ticketId);
        setMessages(data.messages || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();

    // 2. Initialize Socket connection
    const socket = io(SOCKET_URL, {
      auth: { token },
    });
    socketRef.current = socket;

    // 3. Join the ticket's room
    socket.emit("join_room", ticketId);

    // 4. Listen for incoming messages from other users
    socket.on("receive_message", (incoming) => {
      if (incoming.ticketId === ticketId) {
        // Prevent duplicates — check if we already have this message
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (m) => m._id === incoming._id || 
            (m.text === incoming.text && m.createdAt === incoming.createdAt && 
             (m.senderId?._id || m.senderId) === (incoming.senderId?._id || incoming.senderId))
          );
          if (isDuplicate) return prev;
          return [...prev, incoming];
        });

        // Trigger AI suggestions for the agent when someone else sends a message
        const incomingSenderId = incoming.senderId?._id || incoming.senderId;
        if (incomingSenderId !== user?.id) {
          fetchSuggestions(incoming.text);
        }
      }
    });

    // 5. Cleanup on unmount or ticketId change
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [ticketId, token, user?.id, fetchSuggestions]);

  // Send a message
  const sendMessage = async (text) => {
    if (!text.trim() || sending) return;
    setSending(true);
    setSuggestions([]); // Clear AI suggestions on send

    try {
      // 1. Save to DB via API
      const response = await sendMessageApi(ticketId, text);
      const newMessage = response.message;

      // 2. Add to local state immediately
      setMessages((prev) => [...prev, newMessage]);

      // 3. Broadcast to other users in the room via socket
      if (socketRef.current?.connected) {
        socketRef.current.emit("send_internal_message", {
          ticketId,
          message: newMessage,
        });
      }
    } catch (err) {
      setError("Failed to send message. Please try again.");
      console.error("Send message error:", err);
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    suggestions,
    loading,
    sending,
    error,
    sendMessage,
    currentUser: user,
  };
};
