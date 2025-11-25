import axiosClient from "./axiosClient";

const productApi = {
    getAll: () => axiosClient.get("/products"),
};

export default productApi;