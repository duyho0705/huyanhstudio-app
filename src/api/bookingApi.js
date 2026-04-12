import axiosClient from "./axiosClient";

const bookingApi = {
  create: (data) => axiosClient.post("/bookings", data),
  getBookingCustomer(page = 0, size = 10) {
    return axiosClient.get("/bookings/search/customer", {
      params: { page, size }
    });
  },

  admin: {
    getAll: (params) => axiosClient.post("/bookings/search", params, {
      params: { page: params.pageNumber, size: params.pageSize }
    }),
    create: (data) => axiosClient.post("/bookings", data),
    update: (id, data) => axiosClient.put(`/bookings/${id}`, data),
    delete: (ids) => axiosClient.delete(`/bookings/${ids}`),
    updateStatus: (id, status) => axiosClient.put("/bookings/status", {
      bookingIds: [id],
      status
    }),
    assignStaff: (bookingId, staffId) => axiosClient.put(`/bookings/${bookingId}/assign`, {
      staffId
    }),
  }
};

export default bookingApi;