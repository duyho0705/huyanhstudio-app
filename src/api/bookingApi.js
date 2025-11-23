import axiosClient from "./axiosClient";

const bookingApi = {
  create: (data) => axiosClient.post("/bookings", data),
  getBookingCustomer(page = 0, size = 10) {
    return axiosClient.get("/bookings/search/customer", {
      params: { page, size }
    });
  },
};

export default bookingApi;