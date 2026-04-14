import axiosClient from "./axiosClient";
import { refreshClient } from "./axiosClient";

const authApi = {
  login: (credentials) => axiosClient.post("/auth/login", credentials), // trả về response.data (theo axiosClient)
  refresh: () =>
    refreshClient.post("/auth/refresh"), // dùng refreshClient để ko trigger interceptor
  getProfile: () => axiosClient.get("/user/me"),
  logout: () => axiosClient.post("/auth/logout"), // sửa tên đúng
  loginWithFirebase: (idToken) => axiosClient.post("/auth/firebase", { idToken }),
  register: (data) => axiosClient.post("/auth/register", data),
  changePassword: (data) => axiosClient.post("/auth/change-password", data),
};

export default authApi;
