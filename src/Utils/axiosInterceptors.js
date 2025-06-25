import { TokenManager } from "./tokenManager";

let failedQueue = [];
let isRetrying = false;

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const isAuthEndpoint = (url) => {
    return url.includes('auth/refresh-token') ||
        url.includes('auth/login') ||
        url.includes('auth/signup');
};

export const createRequestInterceptor = (refreshManager) => {
    return async (config) => {
        if (isAuthEndpoint(config.url)) {
            return config;
        }

        let token = TokenManager.getAccessToken();

        if (!token || TokenManager.isTokenExpired(token) ||
            TokenManager.isTokenExpiringSoon(token, 1)) {
            try {
                const result = await refreshManager.refreshTokens();
                token = result.accessToken;
            } catch (error) {
                console.error('Failed to refresh token in request interceptor:', error);
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    };
};

export const createResponseInterceptor = (axiosInstance, refreshManager) => {
    return async (error) => {
        const originalRequest = error.config;

        if (isAuthEndpoint(originalRequest.url)) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRetrying) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            isRetrying = true;

            try {
                const result = await refreshManager.refreshTokens();
                processQueue(null, result.accessToken);

                originalRequest.headers["Authorization"] = `Bearer ${result.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                processQueue(err, null);
                return Promise.reject(err);
            } finally {
                isRetrying = false;
            }
        }

        return Promise.reject(error);
    };
};