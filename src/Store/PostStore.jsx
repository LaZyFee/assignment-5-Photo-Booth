import { create } from "zustand";
import { axiosInstance } from "../Utils/axiosInstance";

export const usePostStore = create((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  hasMore: true,
  currentPage: 1,

  fetchPosts: async (page = 1, limit = 10) => {
    if (get().isLoading || !get().hasMore) return;

    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/posts?page=${page}&limit=${limit}`);

      const newPosts = res.data;
      set((state) => ({
        posts: [...state.posts, ...newPosts],
        currentPage: page,
        hasMore: newPosts.length === limit,
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch posts",
        isLoading: false,
      });
    }
  },

  resetPosts: () => set({ posts: [], currentPage: 1, hasMore: true }),

  // Fetch a single post by ID
  fetchPostById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get(`/posts/${id}`);
      set({ selectedPost: res.data, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch post",
        isLoading: false,
      });
    }
  },

  // Create a post
  createPost: async ({ caption, image }) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      if (image) formData.append("image", image);

      const res = await axiosInstance.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({ posts: [res.data, ...state.posts], isLoading: false }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create post",
        isLoading: false,
      });
    }
  },

  // Update a post
  updatePost: async (id, { caption, image }) => {
    set({ isLoading: true, error: null });
    try {
      const formData = new FormData();
      if (caption !== undefined) formData.append("caption", caption);
      if (image) formData.append("image", image);

      const res = await axiosInstance.patch(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set((state) => ({
        posts: state.posts.map((post) => (post._id === id ? res.data : post)),
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to update post",
        isLoading: false,
      });
    }
  },

  // Delete a post
  deletePost: async (id) => {
    try {
      await axiosInstance.delete(`/posts/${id}`);
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== id),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to delete post" });
    }
  },

  // Like or Unlike a post
  toggleLike: async (id) => {
    try {
      const res = await axiosInstance.post(`/posts/${id}/like`);
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === id
            ? {
                ...post,
                likesCount: res.data.liked
                  ? post.likesCount + 1
                  : post.likesCount - 1,
              }
            : post
        ),
      }));
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to like/unlike post",
      });
    }
  },

  // Add comment to a post
  addComment: async (id, text) => {
    try {
      const res = await axiosInstance.post(`/posts/${id}/comment`, { text });
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === id
            ? {
                ...post,
                comments: [...post.comments, res.data.comment],
                commentsCount: post.commentsCount + 1,
              }
            : post
        ),
      }));
      return res.data.comment;
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to add comment" });
    }
  },

  // Update comment
  updateComment: async (commentId, text) => {
    try {
      const res = await axiosInstance.patch(`/posts/comment/${commentId}`, {
        text,
      });
      // Optional: update in local state if needed
      return res.data.comment;
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to update comment" });
    }
  },

  // Delete comment
  deleteComment: async (commentId) => {
    try {
      await axiosInstance.delete(`/posts/comment/${commentId}`);
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to delete comment" });
    }
  },

  // Get posts by specific user
  fetchUserPosts: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const url = userId ? `/posts/user/${userId}` : `/posts/user/me`;
      const res = await axiosInstance.get(url);

      // Sort posts by createdAt (latest first)
      const sortedPosts = res.data.posts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      set({ userPosts: sortedPosts, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch user posts",
        isLoading: false,
      });
    }
  },
}));
