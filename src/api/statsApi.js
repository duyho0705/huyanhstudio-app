import axiosClient from "./axiosClient";

const statsApi = {
    getSummary() {
        return axiosClient.get("/statistics/summary");
    },
    getBookingTrend(params) {
        return axiosClient.get("/statistics/booking-trend", { params });
    }
};

export default statsApi;
