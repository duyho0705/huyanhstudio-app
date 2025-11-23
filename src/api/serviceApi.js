import axiosClient from "./axiosClient";

const serviceApi = {
  getAll: () => axiosClient.get("/services"),
};

export default serviceApi;