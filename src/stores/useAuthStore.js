import { create } from 'zustand';
import userApi from '../api/userApi';
import authApi from '../api/authApi';

const useAuthStore = create((set) => ({
    user: null,
    loading: true,

    // Actions
    loadProfile: async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            set({ loading: false, user: null });
            return;
        }

        try {
            const res = await userApi.getProfile();
            set({ user: res.data, loading: false });
        } catch (err) {
            console.log("Load profile failed:", err);
            localStorage.removeItem("accessToken");
            set({ user: null, loading: false });
        }
    },

    login: async ({ accessToken }) => {
        localStorage.setItem("accessToken", accessToken);
        try {
            const res = await userApi.getProfile();
            set({ user: res.data });
            return res.data;
        } catch (err) {
            console.error("Login profile fetch failed:", err);
            set({ user: null });
            localStorage.removeItem("accessToken");
            throw err;
        }
    },

    logout: async () => {
        try {
            await authApi.logout();
        } catch (_) {}
        
        localStorage.removeItem("accessToken");
        set({ user: null });
        
        // Navigation should be handled by the component, or we can return true
        return true; 
    }
}));

export default useAuthStore;
