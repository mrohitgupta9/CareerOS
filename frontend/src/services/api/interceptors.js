import api from "./axios";
import useAuthStore from "../../stores/authStore";

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

api.interceptors.request.use(
  (config) => {
    const accessToken =
      useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

let isRefreshing = false;
let refreshPromise = null;

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    const status = error?.response?.status;

    // ---------------------------------------------------
    // Don't refresh for auth endpoints
    // ---------------------------------------------------

    const isAuthRequest =
      originalRequest?.url?.includes(
        "/api/auth/login"
      ) ||
      originalRequest?.url?.includes(
        "/api/auth/register"
      ) ||
      originalRequest?.url?.includes(
        "/api/auth/refresh"
      ) ||
      originalRequest?.url?.includes(
        "/api/auth/logout"
      );

    // ---------------------------------------------------
    // Only handle 401
    // ---------------------------------------------------

    if (
      status !== 401 ||
      originalRequest?._retry ||
      isAuthRequest
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // -------------------------------------------------
      // Prevent multiple refresh requests
      // -------------------------------------------------

      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise =
          useAuthStore
            .getState()
            .refreshSession()
            .finally(() => {
              isRefreshing = false;
              refreshPromise = null;
            });
      }

      // Wait for existing refresh request
      await refreshPromise;

      // -------------------------------------------------
      // Get newly generated access token
      // -------------------------------------------------

      const newAccessToken =
        useAuthStore.getState().accessToken;

      if (!newAccessToken) {
        throw new Error(
          "Unable to refresh access token"
        );
      }

      // -------------------------------------------------
      // Retry original request
      // -------------------------------------------------

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization:
          `Bearer ${newAccessToken}`,
      };

      return api(originalRequest);
    } catch (refreshError) {
      // -------------------------------------------------
      // Refresh failed → logout locally
      // -------------------------------------------------

      useAuthStore.setState({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });

      return Promise.reject(refreshError);
    }
  }
);

export default api;