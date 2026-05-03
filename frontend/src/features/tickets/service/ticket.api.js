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

export async function getAllTickets(filters = {}) {
  const response = await api.get("/api/tickets", { params: filters });
  return response.data;
}

export async function getMyTickets() {
  const response = await api.get("/api/tickets/my");
  return response.data;
}

export async function getTicketById(id) {
  const response = await api.get(`/api/tickets/${id}`);
  return response.data;
}

export async function assignTicket(id, agentIds) {
  const response = await api.patch(`/api/tickets/${id}/assign`, { agentIds });
  return response.data;
}

export async function updateTicketStatus(id, status) {
  const response = await api.patch(`/api/tickets/${id}/status`, { status });
  return response.data;
}

export async function getAgents() {
  const response = await api.get("/api/auth/agents");
  return response.data;
}

export async function getTicketStats() {
  const response = await api.get("/api/tickets/stats");
  return response.data;
}

export async function getRecentActivity() {
  const response = await api.get("/api/tickets/activity/recent");
  return response.data;
}

export async function createTicket(ticketData) {
  const response = await api.post("/api/tickets", ticketData);
  return response.data;
}
