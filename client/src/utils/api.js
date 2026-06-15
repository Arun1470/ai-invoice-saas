import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach Clerk token to every request
api.interceptors.request.use(async (config) => {
  try {
    const token = await window.Clerk?.session?.getToken();

    console.log("TOKEN =", token); // DEBUG

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("AUTH HEADER ADDED");
    } else {
      console.log("NO TOKEN FOUND");
    }
  } catch (error) {
    console.error("TOKEN ERROR:", error);
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API ERROR:", err.response?.data);
    const message = err.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ── Invoice API ──────────────────────────────────────
export const invoiceAPI = {
  getAll: (params) => api.get("/invoices", { params }),
  getOne: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post("/invoices", data),
  aiGenerate: (prompt) => api.post("/invoices/ai-generate", { prompt }),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  delete: (id) => api.delete(`/invoices/${id}`),
  getStats: () => api.get("/invoices/stats/summary"),
};

// ── Client API ───────────────────────────────────────
export const clientAPI = {
  getAll: () => api.get("/clients"),
  getOne: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post("/clients", data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
};

export default api;