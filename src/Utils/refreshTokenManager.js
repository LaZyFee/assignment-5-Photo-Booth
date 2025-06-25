import axios from "axios";
import Swal from "sweetalert2";
import { TokenManager } from "./tokenManager";

let navigationCallback = null;

export const setNavigationCallback = (callback) => {
    navigationCallback = callback;
};

export class RefreshTokenManager {
    constructor() {
        this.isRefreshing = false;
        this.refreshPromise = null;
        this.setupVisibilityListener();
        this.scheduleNextRefresh();
    }

    scheduleNextRefresh() {
        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken) return;

        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }

        const expiryTime = TokenManager.getTokenExpiryTime(refreshToken);
        const currentTime = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = expiryTime - currentTime;
        const scheduleTime = Math.max(timeUntilExpiry * 0.75, 60);

        console.log(`Next refresh token renewal scheduled in ${Math.floor(scheduleTime / 60)} minutes`);

        this.refreshTimeout = setTimeout(() => {
            this.proactiveRefresh();
        }, scheduleTime * 1000);
    }

    async proactiveRefresh() {
        const refreshToken = TokenManager.getRefreshToken();
        if (!refreshToken || TokenManager.isTokenExpired(refreshToken)) {
            console.log('Refresh token expired, redirecting to login');
            this.handleLogout();
            return;
        }

        if (TokenManager.isTokenExpiringSoon(refreshToken, 5)) {
            console.log('Refresh token expiring soon, performing proactive refresh');
            try {
                await this.refreshTokens();
                this.scheduleNextRefresh();
            } catch (error) {
                console.error('Proactive refresh failed:', error);
                this.handleLogout();
            }
        }
    }

    setupVisibilityListener() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkTokensOnFocus();
            }
        });

        window.addEventListener('focus', () => {
            this.checkTokensOnFocus();
        });
    }

    async checkTokensOnFocus() {
        const refreshToken = TokenManager.getRefreshToken();
        const accessToken = TokenManager.getAccessToken();

        if (!refreshToken || TokenManager.isTokenExpired(refreshToken)) {
            console.log('Refresh token expired while away, logging out');
            this.handleLogout();
            return;
        }

        if (!accessToken || TokenManager.isTokenExpired(accessToken) ||
            TokenManager.isTokenExpiringSoon(accessToken, 2)) {
            console.log('Refreshing tokens on focus');
            try {
                await this.refreshTokens();
            } catch (error) {
                console.error('Focus refresh failed:', error);
            }
        }
    }

    async refreshTokens() {
        if (this.isRefreshing && this.refreshPromise) {
            return this.refreshPromise;
        }

        this.isRefreshing = true;
        this.refreshPromise = this.performRefresh();

        try {
            const result = await this.refreshPromise;
            return result;
        } finally {
            this.isRefreshing = false;
            this.refreshPromise = null;
        }
    }

    async performRefresh() {
        const refreshToken = TokenManager.getRefreshToken();

        if (!refreshToken || TokenManager.isTokenExpired(refreshToken)) {
            throw new Error('No refresh token available or expired');
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/auth/refresh-token",
                { refreshToken },
                { timeout: 10000 }
            );

            const { accessToken, refreshToken: newRefreshToken, user } = response.data;
            const tokenToStore = newRefreshToken || refreshToken;

            TokenManager.setTokens(accessToken, tokenToStore, user);
            console.log('Tokens refreshed successfully');

            return { accessToken, refreshToken: tokenToStore };
        } catch (error) {
            console.error('Failed to refresh tokens:', error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                this.handleLogout();
            }
            throw error;
        }
    }

    handleLogout() {
        TokenManager.clearTokens();

        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }

        Swal.fire({
            title: 'Session Expired',
            text: 'Your session has expired. Please log in again.',
            icon: 'error',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            if (navigationCallback) {
                navigationCallback('/login');
            } else {
                window.location.replace('/login');
            }
        });
    }

    destroy() {
        if (this.refreshTimeout) {
            clearTimeout(this.refreshTimeout);
        }
        this.isRefreshing = false;
        this.refreshPromise = null;
    }
}