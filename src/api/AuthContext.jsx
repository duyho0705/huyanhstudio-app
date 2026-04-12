import React, { createContext, useState, useEffect, useCallback } from "react";
import authApi from "./authApi";
import userApi from "./userApi"; // QUAN TRỌNG
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [modalMode, setModalMode] = useState("login");
  const navigate = useNavigate();

  // Lấy profile từ server
  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await userApi.getProfile();
      setUser(res.data);
    } catch (err) {
      console.log("Load profile failed:", err);
      localStorage.removeItem("accessToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // chạy khi mở web
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Login
  const login = async ({ accessToken }) => {
    localStorage.setItem("accessToken", accessToken);

    // Lấy profile sau khi login
    try {
      const res = await userApi.getProfile();
      setUser(res.data);
      return res.data;
    } catch (err) {
      console.error("Login profile fetch failed:", err);
      setUser(null);
      localStorage.removeItem("accessToken");
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authApi.logout();
    } catch (_) {}

    localStorage.removeItem("accessToken");
    setUser(null);

    navigate("/");

    // Sau khi render lại home → mở modal login
    setTimeout(() => {
      setShowLoginModal(true);
    }, 100);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        loadProfile,
        showLoginModal,
        setShowLoginModal: (val, mode = "login") => {
          setShowLoginModal(val);
          if (val) setModalMode(mode);
        },
        modalMode,
        setModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
