import axios from "axios";

// =====================================================
// API CONFIG
// =====================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

// =====================================================
// AXIOS INSTANCE
// =====================================================

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,

  // Required for httpOnly refresh-token cookie
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;