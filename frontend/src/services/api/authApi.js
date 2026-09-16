import api from "./axios";

// =====================================================
// REGISTER
// POST /api/auth/register
// =====================================================

export const registerUser = async ({
  name,
  email,
  password,
}) => {
  const response = await api.post(
    "/api/auth/register",
    {
      name: name?.trim(),
      email: email?.trim().toLowerCase(),
      password,
    }
  );

  return response.data;
};

// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

export const loginUser = async ({
  email,
  password,
}) => {
  const response = await api.post(
    "/api/auth/login",
    {
      email: email?.trim().toLowerCase(),
      password,
    }
  );

  return response.data;
};

// =====================================================
// REFRESH ACCESS TOKEN
// POST /api/auth/refresh
//
// Refresh token httpOnly cookie me hota hai.
// Axios `withCredentials: true` ki wajah se
// browser cookie automatically send karta hai.
//
// IMPORTANT:
// 401 ko yahan console.error nahi karna.
// Fresh session me refresh cookie na hona normal hai.
// =====================================================

export const refreshAccessToken = async () => {
  const response = await api.post(
    "/api/auth/refresh"
  );

  return response.data;
};

// =====================================================
// GET CURRENT USER
// GET /api/auth/me
// =====================================================

export const getCurrentUser = async () => {
  const response = await api.get(
    "/api/auth/me"
  );

  return response.data;
};

// =====================================================
// LOGOUT
// POST /api/auth/logout
// =====================================================

export const logoutUser = async () => {
  const response = await api.post(
    "/api/auth/logout"
  );

  return response.data;
};