import axiosClient from "./axiosClient";

const productApi = {
    getAll: (params) => axiosClient.get("/products", { params }),
};

export default productApi;