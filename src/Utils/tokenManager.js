export const TokenManager = {
    getAccessToken: () => localStorage.getItem("accessToken"),
    getRefreshToken: () => localStorage.getItem("refreshToken"),
    getUser: () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    setTokens: (accessToken, refreshToken, user) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
    },

    clearTokens: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    },

    isTokenExpiringSoon: (token, minutesThreshold = 5) => {
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            const timeUntilExpiry = payload.exp - currentTime;
            const thresholdSeconds = minutesThreshold * 60;

            return timeUntilExpiry < thresholdSeconds;
        } catch (error) {
            console.error('Error parsing token:', error);
            return true;
        }
    },

    isTokenExpired: (token) => {
        if (!token) return true;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp < currentTime;
        } catch (error) {
            console.error('Error parsing token:', error);
            return true;
        }
    },

    getTokenExpiryTime: (token) => {
        if (!token) return 0;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp;
        } catch (error) {
            console.error('Error parsing token:', error);
            return 0;
        }
    }
};