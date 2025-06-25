import { create } from "zustand";
import { axiosInstance } from "../Utils/axiosInstance";

export const useAuth = create((set, get) => ({
  user: (() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  })(),
  error: null,
  isLoading: false,
  isAuthenticated: false,

  updateUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },
  // Signup function
  signup: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("auth/signup", formData);
      const { user, accessToken, refreshToken } = response.data;

      if (user && accessToken && refreshToken) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error(
          "User, accessToken, or refreshToken not provided in response"
        );
      }
    } catch (error) {
      console.error("❌ Signup error:", error);
      set({
        error: error.response?.data?.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  // Login function
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("auth/login", {
        email,
        password,
      });
      const { user, accessToken, refreshToken } = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("❌ Login error:", error);
      set({
        error: error.response?.data?.message || "Error logging in",
        isLoading: false,
      });
      throw error;
    }
  },

  // Logout function
  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const accessToken = localStorage.getItem("accessToken");

      if (!refreshToken || !accessToken) {
        console.warn("⚠️ No tokens found for logout");
        // Still clear everything locally
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      await axiosInstance.post(
        "auth/logout",
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Even if logout fails on server, clear local data
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.response?.data?.message || "Error logging out",
      });
      throw error;
    }
  },

  // Forgot Password
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("auth/forgot-password", {
        email,
      });
      set({ isLoading: false });

      return response.data.message;
    } catch (error) {
      console.error("❌ Forgot password error:", error);
      set({
        error: error.response?.data?.message || "Error sending reset email",
        isLoading: false,
      });
      throw error;
    }
  },

  // Reset Password
  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("auth/reset-password", {
        token,
        newPassword,
      });
      set({ isLoading: false });

      return response.data.message;
    } catch (error) {
      console.error("❌ Reset password error:", error);
      set({
        error: error.response?.data?.message || "Error resetting password",
        isLoading: false,
      });
      throw error;
    }
  },

  // Refresh tokens
  refreshTokens: async () => {
    set({ isLoading: true, error: null });

    try {
      const oldRefreshToken = localStorage.getItem("refreshToken");
      if (!oldRefreshToken) throw new Error("No refresh token found");

      const response = await axiosInstance.post("auth/refresh-token", {
        refreshToken: oldRefreshToken,
      });

      const {
        accessToken,
        refreshToken: newRefreshToken,
        user,
      } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      set({
        error: error.response?.data?.message || "Error refreshing tokens",
        isLoading: false,
      });
      throw error;
    }
  },

  // Initialize auth - with better error handling
  initializeAuth: () => {
    const currentState = get();

    // Prevent multiple initializations
    if (currentState.isLoading) {
      return;
    }

    try {
      const storedUser = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (storedUser && accessToken && refreshToken) {
        const user = JSON.parse(storedUser);

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("❌ Error initializing auth:", error);
      // Clear potentially corrupted data
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Error initializing authentication",
      });
    }
  },
}));
