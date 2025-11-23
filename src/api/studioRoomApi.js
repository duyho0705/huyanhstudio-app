import axiosClient from "./axiosClient";

const studioRoomApi = {
  getAll: () => axiosClient.get("/studios"),
};

export default studioRoomApi;