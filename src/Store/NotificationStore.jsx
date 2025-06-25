import { create } from "zustand";
import { axiosInstance } from "../Utils/axiosInstance";

export const useNotificationStore = create((set) => ({
  notifications: [],
  isLoading: false,
  error: null,

  // Fetch all notifications
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/notifications");
      set({ notifications: res.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load notifications",
        isLoading: false,
      });
    }
  },

  // Mark a notification as read
  markAsRead: async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to mark as read",
      });
    }
  },

  // Mark a notification as unread
  markAsUnread: async (id) => {
    try {
      await axiosInstance.patch(`/notifications/${id}/unread`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, read: false } : n
        ),
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to mark as unread",
      });
    }
  },

  // Clear errors manually
  clearError: () => set({ error: null }),
}));
