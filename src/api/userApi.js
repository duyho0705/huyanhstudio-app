import axiosClient from "./axiosClient";

const userApi = {
  getProfile() {
    return axiosClient.get("/user/me");
  },

  updateProfile(data) {
    return axiosClient.patch("/user/me", data);
  },
  
};

export default userApi;
