import axiosClient from "./axiosClient";

const userApi = {
  getProfile() {
    return axiosClient.get("/user/me");
  },

  updateProfile(data) {
    return axiosClient.patch("/user/me", data);
  },

  admin: {
    getAll: (params) => {
      const { page = 0, size = 10, ...filters } = params || {};
      return axiosClient.post(`/user/search?page=${page}&size=${size}`, filters);
    },
    create: (data) => axiosClient.post("/user", data),
    update: (id, data) => axiosClient.put(`/user/${id}`, data),
    delete: (id) => axiosClient.delete(`/user/${id}`),
    getStaff: () => {
      return axiosClient.get("/staffs");
    }
  }
};

export default userApi;

