import { create } from "zustand";

import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  logoutUser,
} from "../services/api/authApi";

// =====================================================
// AUTH STORE
// =====================================================

const useAuthStore = create((set, get) => ({
  // ===================================================
  // STATE
  // ===================================================

  user: null,
  accessToken: null,

  isAuthenticated: false,
  isLoading: false,
  isInitializing: true,

  error: null,

  // ===================================================
  // CLEAR ERROR
  // ===================================================

  clearError: () => {
    set({
      error: null,
    });
  },

  // ===================================================
  // REGISTER
  // ===================================================

  register: async (userData) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response =
        await registerUser(userData);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Registration failed"
        );
      }

      const user =
        response?.data?.user;

      const accessToken =
        response?.data?.accessToken;

      if (!user || !accessToken) {
        throw new Error(
          "Invalid registration response from server"
        );
      }

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed. Please try again.";

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      });

      return {
        success: false,
        error: message,
      };
    }
  },

  // ===================================================
  // LOGIN
  // ===================================================

  login: async (credentials) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response =
        await loginUser(credentials);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Login failed"
        );
      }

      const user =
        response?.data?.user;

      const accessToken =
        response?.data?.accessToken;

      if (!user || !accessToken) {
        throw new Error(
          "Invalid login response from server"
        );
      }

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed. Please check your credentials.";

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      });

      return {
        success: false,
        error: message,
      };
    }
  },

  // ===================================================
  // REFRESH SESSION
  // ===================================================

  refreshSession: async () => {
    try {
      const response =
        await refreshAccessToken();

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Session refresh failed"
        );
      }

      const user =
        response?.data?.user;

      const accessToken =
        response?.data?.accessToken;

      if (!user || !accessToken) {
        throw new Error(
          "Invalid refresh response from server"
        );
      }

      set({
        user,
        accessToken,
        isAuthenticated: true,
        error: null,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });

      throw error;
    }
  },

  // ===================================================
  // INITIALIZE AUTH
  // ===================================================

  initializeAuth: async () => {
    set({
      isInitializing: true,
      error: null,
    });

    try {
      await get().refreshSession();
    } catch {
      // No refresh-token cookie/session.
      // This is normal for a logged-out user.

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        error: null,
      });
    } finally {
      set({
        isInitializing: false,
      });
    }
  },

  // ===================================================
  // GET CURRENT USER
  // ===================================================

  fetchCurrentUser: async () => {
    try {
      const response =
        await getCurrentUser();

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to fetch current user"
        );
      }

      const user =
        response?.data?.user;

      if (!user) {
        throw new Error(
          "Invalid user response from server"
        );
      }

      set({
        user,
        isAuthenticated: true,
        error: null,
      });

      return {
        success: true,
        user,
      };
    } catch (error) {
      const status =
        error?.response?.status;

      if (
        status === 401 ||
        status === 403
      ) {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          error: null,
        });
      } else {
        set({
          error:
            error?.response?.data?.message ||
            error?.message ||
            "Unable to fetch current user.",
        });
      }

      return {
        success: false,
      };
    }
  },

  // ===================================================
  // LOGOUT
  // ===================================================

  logout: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      await logoutUser();
    } catch (error) {
      console.error(
        "Logout API error:",
        error?.response?.data?.message ||
          error?.message
      );
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  // ===================================================
  // RESET AUTH
  // ===================================================

  resetAuth: () => {
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },
}));

export default useAuthStore;