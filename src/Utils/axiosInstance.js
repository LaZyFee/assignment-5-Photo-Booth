import axios from "axios";
import { TokenManager } from "./tokenManager";
import { RefreshTokenManager, setNavigationCallback } from "./refreshTokenManager";
import { createRequestInterceptor, createResponseInterceptor } from "./axiosInterceptors";

// Create axios instance
export const axiosInstance = axios.create({
    baseURL: "http://localhost:3000/api/",
    withCredentials: true,
});

// Initialize refresh manager
const refreshManager = new RefreshTokenManager();

// Setup interceptors
axiosInstance.interceptors.request.use(
    createRequestInterceptor(refreshManager),
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    createResponseInterceptor(axiosInstance, refreshManager)
);

// Export utilities
export { TokenManager, refreshManager, setNavigationCallback };