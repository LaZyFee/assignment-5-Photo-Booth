import { create } from "zustand";
import { axiosInstance } from "../Utils/axiosInstance";

export const useProfile = create((set) => ({
  user: null,
  error: null,
  isLoading: false,

  // Fetch current logged-in user
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/users/me");
      set({ user: res.data, isLoading: false });
      return res.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch user";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Update user profile (name, bio, website, gender)
  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.patch("/users/me", data);
      const updatedUser = res.data;

      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  // Update avatar
  updateAvatar: async (file) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axiosInstance.patch("/users/me/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle different response structures
      const updatedUser = res.data.user || res.data;
      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update avatar";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.patch("/users/me/password", {
        currentPassword,
        newPassword,
      });
      set({ isLoading: false });
      return true;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to change password";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  // Get user by ID
  getUserById: async (id) => {
    try {
      const res = await axiosInstance.get(`/users/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "User not found");
    }
  },

  // Poke a user by ID
  pokeUser: async (id) => {
    try {
      await axiosInstance.post(`/users/${id}/poke`);
      return { success: true, message: "User poked successfully" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to poke user",
      };
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Logout method
  logout: () => {
    set({ user: null, error: null });
  },
}));
