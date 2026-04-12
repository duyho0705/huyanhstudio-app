import axiosClient from "./axiosClient";

const demoApi = {
  getAll: (params) => {
    return axiosClient.get("/demos", { params });
  },
  
  getById: (id) => {
    return axiosClient.get(`/demos/${id}`);
  },

  create: (data) => {
    return axiosClient.post("/demos", data);
  },

  update: (id, data) => {
    return axiosClient.put(`/demos/${id}`, data);
  },

  delete: (id) => {
    return axiosClient.delete(`/demos/${id}`);
  },

  search: (params) => {
    return axiosClient.get("/demos/search", { params });
  }
};

export default demoApi;
