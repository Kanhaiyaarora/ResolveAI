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

export async function register({ name, email, password, role, companyName, inviteCode }) {
  const response = await api.post("/api/auth/register", {
    name,
    email,
    password,
    role,
    companyName,
    inviteCode,
  });
  return response.data;
}

export async function login({ email, password, role }) {
  const response = await api.post("/api/auth/login", {
    email,
    password,
    role,
  });
  return response.data;
}

export async function getMe() {
  const response = await api.get("/api/auth/me");
  return response.data;
}

export async function logout() {
  const response = await api.post("/api/auth/logout");
  return response.data;
}
