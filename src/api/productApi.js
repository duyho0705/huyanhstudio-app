import axiosClient from "./axiosClient";

const productApi = {
    getAll: (params) => axiosClient.get("/products", { params }),
    search: (params) => {
    // Backend expects 'title' as a required @RequestParam
    const { title = "", page = 0, size = 10, ...rest } = params || {};
    return axiosClient.get("/products/search", { 
      params: { title, page, size, ...rest } 
    });
  },
    create: (data) => axiosClient.post("/products", data),
    update: (id, data) => axiosClient.put(`/products/${id}`, data),
    delete: (id) => axiosClient.delete(`/products/${id}`),
};

export default productApi;