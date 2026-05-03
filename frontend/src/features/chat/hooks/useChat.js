import { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { 
  getMessages, 
  sendMessage as sendMessageApi, 
  getAiSuggestions,
  getCustomerHistory,
  sendCustomerMessage
} from "../service/chat.api";
import { useSelector } from "react-redux";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/**
 * Hook for both Internal (Team) and External (Customer) chat.
 * @param {string} id - Ticket ID (internal) or Conversation ID (external)
 * @param {string} mode - 'internal' or 'external'
 * @param {string} ticketId - Required for 'external' mode to join socket room
 */
export const useChat = (id, mode = "internal", ticketId = null) => {
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
    if (!id || !token) return;

    // 1. Fetch message history
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        let data;
        if (mode === "internal") {
          data = await getMessages(id);
        } else {
          data = await getCustomerHistory(id);
        }
        // Normalize message field names if necessary (content vs text)
        const normalizedMessages = (data.messages || []).map(m => ({
           ...m,
           text: m.text || m.content // Internal uses .text, External uses .content
        }));
        setMessages(normalizedMessages);
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

    // 3. Join the correct room
    if (mode === "internal") {
      socket.emit("join_room", id);
    } else {
      // For external, we join the ticket room to communicate with the customer
      socket.emit("join_ticket", ticketId);
    }

    // 4. Listen for incoming messages
    socket.on("receive_message", (incoming) => {
      // Filter by correct room/context
      const isInternalMatch = mode === "internal" && incoming.ticketId === id;
      const isExternalMatch = mode === "external" && (incoming.ticketId === ticketId || incoming.conversationId === id);

      if (isInternalMatch || isExternalMatch) {
        setMessages((prev) => {
          const isDuplicate = prev.some((m) => m._id === incoming._id);
          if (isDuplicate) return prev;
          
          return [...prev, {
            ...incoming,
            text: incoming.text || incoming.message || incoming.content
          }];
        });

        // AI suggestions for agent
        const incomingSenderId = incoming.senderId?._id || incoming.senderId;
        if (incomingSenderId !== user?.id) {
          fetchSuggestions(incoming.text || incoming.message || incoming.content);
        }
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [id, mode, ticketId, token, user?.id, fetchSuggestions]);

  // Send a message
  const sendMessage = async (text) => {
    if (!text.trim() || sending) return;
    setSending(true);
    setSuggestions([]);

    try {
      let newMessage;
      if (mode === "internal") {
        const response = await sendMessageApi(id, text);
        newMessage = response.message;
        newMessage.text = newMessage.text || newMessage.content;
      } else {
        const response = await sendCustomerMessage(id, text);
        newMessage = response.message;
        newMessage.text = newMessage.text || newMessage.content;
      }

      setMessages((prev) => [...prev, newMessage]);

      // Broadcast via socket
      if (socketRef.current?.connected) {
        if (mode === "internal") {
          socketRef.current.emit("send_internal_message", {
            ticketId: id,
            message: newMessage,
          });
        } else {
          socketRef.current.emit("send_message", {
            ticketId: ticketId,
            conversationId: id,
            message: text,
          });
        }
      }
    } catch (err) {
      setError("Failed to send message.");
      console.error(err);
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
