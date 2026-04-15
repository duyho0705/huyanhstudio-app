import axiosClient from "./axiosClient";

const statsApi = {
    getSummary() {
        return axiosClient.get("/statistics/summary");
    }
};

export default statsApi;
