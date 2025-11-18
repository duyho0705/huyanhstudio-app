import axiosClient from "./axiosClient";

const userApi = {
  getProfile() {
    return axiosClient.get("/user/me");
  },

  updateProfile(data) {
    return axiosClient.put("/user/me", data);
  },
  
};

export default userApi;
