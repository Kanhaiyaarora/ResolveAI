import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { getMessages, sendMessage as sendMessageApi, getAiSuggestions } from "../service/chat.api";
import { useSelector } from "react-redux";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useChat = (ticketId) => {
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const { user, token } = useSelector((state) => state.auth);

  const fetchSuggestions = useCallback(async (lastMessage) => {
    if (user?.role !== "agent") return;
    try {
      const data = await getAiSuggestions(lastMessage);
      setSuggestions(data.suggestions);
    } catch (err) {
      console.error("AI Error:", err);
    }
  }, [user?.role]);

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
        // Trigger AI suggestions if it's from someone else
        if (message.senderId !== user.id) {
          fetchSuggestions(message.text);
        }
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [ticketId, token, user.id, fetchSuggestions]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    setSuggestions([]); // Clear suggestions on send
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
    suggestions,
    loading,
    error,
    sendMessage,
    currentUser: user,
  };
};
