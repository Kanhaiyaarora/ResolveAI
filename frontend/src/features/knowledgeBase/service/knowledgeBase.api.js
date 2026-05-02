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

/**
 * Uploads a document file to the knowledge base.
 * Sends as multipart/form-data — no Content-Type header set manually
 * so the browser can include the correct boundary automatically.
 */
export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/knowledge-base/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

/**
 * Fetches all knowledge base documents for this company.
 */
export async function getKnowledgeBaseDocs() {
  const response = await api.get("/api/knowledge-base");
  return response.data;
}
