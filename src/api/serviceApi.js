import axiosClient from "./axiosClient";

const serviceApi = {
  getAll: () => axiosClient.get("/services"),
  admin: {
    getAll: (params) => axiosClient.get("/services", { params }),
    create: (data) => axiosClient.post("/services", data),
    update: (id, data) => axiosClient.put(`/services/${id}`, data),
    updateStatus: (id, active) => axiosClient.put(`/services/${id}/active`, null, {
      params: { active }
    }),
    delete: (id) => axiosClient.delete(`/services/${id}`),
  }
};

export default serviceApi;
