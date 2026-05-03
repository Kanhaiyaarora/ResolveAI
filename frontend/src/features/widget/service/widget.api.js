import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function getWidgetSettings(companyId) {
  const response = await api.get(`/api/company/widget-settings?cid=${companyId}`);
  return response.data;
}

export async function updateWidgetSettings(data) {
  const response = await api.patch("/api/company/widget-settings", data);
  return response.data;
}
