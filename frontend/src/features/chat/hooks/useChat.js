import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { getMessages, sendMessage as sendMessageApi } from "../service/chat.api";
import { useSelector } from "react-redux";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useChat = (ticketId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!ticketId || !token) return;

    // 1. Fetch history
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const data = await getMessages(ticketId);
        setMessages(data.messages);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();

    // 2. Initialize Socket
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
    });

    socketRef.current.emit("join_room", ticketId);

    socketRef.current.on("receive_message", (message) => {
      if (message.ticketId === ticketId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [ticketId, token]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    try {
      const response = await sendMessageApi(ticketId, text);
      const newMessage = response.message;
      
      // Emit to others
      socketRef.current.emit("send_internal_message", {
        ticketId,
        message: newMessage,
      });

      // Update local state
      setMessages((prev) => [...prev, newMessage]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    currentUser: user,
  };
};
