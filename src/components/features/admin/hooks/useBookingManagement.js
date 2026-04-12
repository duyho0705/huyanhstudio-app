import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import bookingApi from "../../../../api/bookingApi";

export const useBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    status: null,
    studioId: null,
    fromDate: null,
    toDate: null,
    search: "",
  });

  const [messageApi, contextHolder] = message.useMessage();

  /*** Data Fetching ***/
  useEffect(() => {
    fetchBookings();
  }, [pagination.current, pagination.pageSize, filters]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { search, fromDate, toDate, status, studioId } = filters;
      
      // Build search query - pagination for URL params
      const paginationParams = {
        pageNumber: pagination.current - 1, // Backend expects 0-indexed
        pageSize: pagination.pageSize,
      };
      
      // Build filter object - only include non-null values
      const filterBody = {};
      if (search?.trim()) filterBody.keyword = search.trim();
      if (status) filterBody.status = status;
      if (studioId) filterBody.studioId = studioId;
      if (fromDate) filterBody.fromDate = fromDate;
      if (toDate) filterBody.toDate = toDate;
      
      // Combine for API call
      const searchQuery = { ...paginationParams, ...filterBody };

      console.log("👉 Fetching page:", pagination.current, "| Query:", searchQuery);

      // Call API
      const response = await bookingApi.admin.getAll(searchQuery);

      console.log("📦 API Response:", response);

      // Parse response
      const responseData = response.data || response;
      const bookingsList = responseData.list || responseData.content || [];
      const totalElements = responseData.totalElements || responseData.totalItems || 0;

      console.log("✅ Got", bookingsList.length, "bookings, total:", totalElements);

      // Remove duplicates and update state
      const uniqueBookings = Array.isArray(bookingsList)
        ? bookingsList.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
        : [];

      setBookings(uniqueBookings);
      
      // Only update total - do NOT sync current/pageSize from response
      setPagination((prev) => ({
        ...prev,
        total: totalElements,
      }));
      
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      messageApi.error(`Không thể tải danh sách đặt lịch! ${error.message}`);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current, pagination.pageSize, messageApi]);

  /*** Handlers ***/
  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handleDateRangeChange = (dates) => {
    const fromDate = dates ? dates[0].format("YYYY-MM-DD") : null;
    const toDate = dates ? dates[1].format("YYYY-MM-DD") : null;
    
    console.log("Date range changed:", { fromDate, toDate });
    
    setFilters((prev) => ({
      ...prev,
      fromDate,
      toDate,
    }));
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      status: null,
      studioId: null,
      fromDate: null,
      toDate: null,
      search: "",
    });
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const deleteBooking = useCallback(async (id) => {
    try {
      await bookingApi.admin.delete(id);
      messageApi.success("Xóa đặt lịch thành công!");
      fetchBookings();
      return true;
    } catch (error) {
      console.error("Error deleting booking:", error);
      messageApi.error("Không thể xóa đặt lịch!");
      return false;
    }
  }, [messageApi, fetchBookings]);

  const bulkDeleteBookings = useCallback(async (ids) => {
    try {
      const idsParam = ids.join(",");
      await bookingApi.admin.delete(idsParam);
      messageApi.success(`Đã xóa ${ids.length} đặt lịch thành công!`);
      fetchBookings();
      return true;
    } catch (error) {
      console.error("Bulk delete error:", error);
      messageApi.error("Không thể xóa các đặt lịch đã chọn!");
      return false;
    }
  }, [messageApi, fetchBookings]);

  const updateBookingStatus = useCallback(async (id, status) => {
    try {
      await bookingApi.admin.updateStatus(id, status);
      messageApi.success("Cập nhật trạng thái thành công!");
      fetchBookings();
      return true;
    } catch {
      messageApi.error("Không thể cập nhật trạng thái!");
      return false;
    }
  }, [messageApi, fetchBookings]);

  const assignStaff = useCallback(async (bookingId, staffId) => {
    try {
      await bookingApi.admin.assignStaff(bookingId, staffId);
      messageApi.success("Gán nhân viên thành công!");
      fetchBookings();
      return true;
    } catch {
      messageApi.error("Không thể gán nhân viên!");
      return false;
    }
  }, [messageApi, fetchBookings]);

  return {
    bookings,
    loading,
    pagination,
    filters,
    messageContext: contextHolder,
    messageApi,
    fetchBookings,
    handleTableChange,
    handleFilterChange,
    handleDateRangeChange,
    clearFilters,
    deleteBooking,
    bulkDeleteBookings,
    updateBookingStatus,
    assignStaff,
    setBookings,
  };
};
