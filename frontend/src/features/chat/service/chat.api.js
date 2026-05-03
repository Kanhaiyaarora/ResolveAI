import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getMessages(ticketId) {
  const response = await api.get(`/api/messages/${ticketId}`);
  return response.data;
}

export async function sendMessage(ticketId, text) {
  const response = await api.post("/api/messages", { ticketId, text });
  return response.data;
}

// 🌐 CUSTOMER (EXTERNAL) CHAT
export async function getCustomerHistory(conversationId) {
  const response = await api.get(`/api/chat/${conversationId}/history`);
  return response.data;
}

export async function sendCustomerMessage(conversationId, content) {
  const response = await api.post(`/api/chat/${conversationId}/message`, { content });
  return response.data;
}

export async function getAiSuggestions(message) {
  const response = await api.post("/api/ai/suggest-reply", { message });
  return response.data;
}
