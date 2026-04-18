import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Tag,
  Select,
  Tooltip,
  Dropdown,
  Menu,
  Input,
  Row,
  Col,
  Statistic,
  Descriptions,
  Card,
  Badge,
} from "antd";
import {
  Edit,
  Trash2,
  MoreHorizontal,
  MoreVertical,
  Settings,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Plus,
  Hash,
  CalendarClock,
  Home,
  Package,
  User,
  FileText,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowRight,
  CalendarDays,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Timer,
  UserX,
  AlertTriangle
} from "lucide-react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import dayjs from "dayjs";

import bookingApi from "../../../api/bookingApi";
import userApi from "../../../api/userApi";
import serviceApi from "../../../api/serviceApi";
import studioRoomApi from "../../../api/studioRoomApi";

import BookingForm from "./components/BookingForm";
import BookingFilters from "./components/BookingFilters";
import { useBookingManagement } from "./hooks/useBookingManagement";
import statsApi from "../../../api/statsApi";

const { Option } = Select;

const bookingStatuses = [
  { value: "PENDING", label: "Chờ xác nhận", color: "orange", classes: "bg-orange-500 text-white border-orange-600" },
  { value: "CONFIRMED", label: "Đã xác nhận", color: "blue", classes: "bg-blue-600 text-white border-blue-700" },
  { value: "COMPLETED", label: "Hoàn thành", color: "green", classes: "bg-emerald-600 text-white border-emerald-700" },
  { value: "CANCELLED", label: "Đã hủy", color: "red", classes: "bg-red-600 text-white border-red-700" },
];

const BookingManagement = () => {
  const {
    bookings,
    loading,
    pagination,
    filters,
    messageContext,
    messageApi,
    handleTableChange,
    handleFilterChange,
    handleDateRangeChange,
    clearFilters,
    deleteBooking,
    bulkDeleteBookings,
    updateBookingStatus,
    assignStaff,
    fetchBookings,
  } = useBookingManagement();

  const [allServices, setAllServices] = useState([]);
  const [allStudios, setAllStudios] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await statsApi.getSummary();
      const data = res.data?.data || res.data;
      setGlobalStats({
        totalBookings: data.totalBookings || 0,
        pendingBookings: data.pendingBookings || 0,
        completedBookings: data.completedBookings || 0,
        cancelledBookings: data.cancelledBookings || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [selectedDetailBooking, setSelectedDetailBooking] = useState(null);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [globalStats, setGlobalStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  });

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const isMobile = windowWidth < 640;

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsApi.getSummary();
        const data = res.data?.data || res.data;
        setGlobalStats({
          totalBookings: data.totalBookings || 0,
          pendingBookings: data.pendingBookings || 0,
          completedBookings: data.completedBookings || 0,
          cancelledBookings: data.cancelledBookings || 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []); // Initial load only

  // Fetch stats when status is updated through the table select
  const handleStatusUpdate = async (id, val) => {
    const success = await updateBookingStatus(id, val);
    if (success) {
      await fetchStats();
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Only load data needed for filters or forms later
        // Note: Services & Studios are mostly for the Form, can be lazy loaded
        const [servicesRes, staffRes, studiosRes] = await Promise.all([
          serviceApi.admin.getAll({ page: 0, size: 500 }).catch(() => ({ list: [] })),
          userApi.admin.getStaff().catch(() => ({ data: [] })),
          studioRoomApi.getAll().catch(() => ({ data: [] })),
        ]);

        const getList = (res) => {
          if (!res) return [];
          if (Array.isArray(res)) return res;
          if (res.list && Array.isArray(res.list)) return res.list;
          if (res.content && Array.isArray(res.content)) return res.content;
          if (res.data && Array.isArray(res.data)) return res.data;
          return [];
        };

        setAllServices(getList(servicesRes));
        setAllStudios(getList(studiosRes));
        const finalStaff = getList(staffRes);
        setStaffList(finalStaff.filter((v, i, a) => a.findIndex((t) => t.id === v.id) === i));
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedDetailBooking && isDetailModalOpen) {
      const updatedBooking = bookings.find(
        (b) => b.id === selectedDetailBooking.id
      );
      if (updatedBooking) {
        setSelectedDetailBooking(updatedBooking);
      }
    }
  }, [bookings, selectedDetailBooking, isDetailModalOpen]);


  const handleCreate = useCallback(() => {
    setSelectedBooking(null);
    setIsFormModalOpen(true);
  }, []);

  const handleEdit = useCallback((record) => {
    setSelectedBooking(record);
    setIsFormModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((record) => {
    setSelectedBooking(record);
    setDeleteConfirmText("");
    setIsDeleteModalOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (selectedBooking) {
      const success = await deleteBooking(selectedBooking.id);
      if (success) {
        setIsDeleteModalOpen(false);
        if (selectedRowKeys.includes(selectedBooking.id)) {
          setSelectedRowKeys((prev) =>
            prev.filter((k) => k !== selectedBooking.id)
          );
        }
        fetchStats();
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = async () => {
    const success = await bulkDeleteBookings(selectedRowKeys);
    if (success) {
      setSelectedRowKeys([]);
      setIsBulkDeleteModalOpen(false);
      fetchStats();
    }
  };

  const handleViewDetails = (record) => {
    setSelectedDetailBooking(record);
    setIsDetailModalOpen(true);
  };

  const handleFormSubmit = async (values) => {
    const isUpdate = !!selectedBooking;
    const payload = {
      customerName: values.customerName,
      phone: values.phone,
      email: values.email,
      recordDate: values.recordDate,
      studioRoomId: values.studioRoomId,
      serviceIds: values.serviceIds,
      note: values.note || "",
    };

    setIsFormModalOpen(false);
    setSelectedBooking(null);

    try {
      if (isUpdate) {
        await bookingApi.admin.update(selectedBooking.id, payload);
        setNotification({
          show: true,
          message: `Cập nhật thành công ${selectedBooking.bookingCode} - ${selectedBooking.customerName}`,
          type: "success",
        });
      } else {
        const res = await bookingApi.admin.create(payload);
        const newData = res.data || res;
        const bookingCode = newData?.bookingCode || "";
        const customerName = newData?.customerName || "";
        setNotification({
          show: true,
          message: `Tạo đặt lịch thành công ${bookingCode} ${customerName ? " - " + customerName : ""
            }`,
          type: "success",
        });
      }
      fetchBookings();
      fetchStats();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      messageApi.error(
        `${isUpdate ? "Cập nhật" : "Tạo"} thất bại: ${errorMsg}`
      );
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    columnWidth: 50,
  };

  const getStatusIcon = (statusValue) => {
    switch (statusValue) {
      case "PENDING": return <Clock size={16} />;
      case "CONFIRMED": return <CalendarCheck size={16} />;
      case "COMPLETED": return <CheckCircle2 size={16} />;
      case "CANCELLED": return <XCircle size={16} />;
      default: return null;
    }
  };

  const columns = useMemo(
    () => [
      {
        title: <span className="text-[15px] font-medium text-slate-600">Mã đơn</span>,
        dataIndex: "bookingCode",
        key: "shortCode",
        width: 120,
        render: (code, record) => (
          <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[13px] font-medium tracking-wider border border-slate-200 inline-block shadow-sm">
            {code || record.bookingCode?.slice(0, 8)}
          </div>
        ),
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Khách hàng</span>,
        dataIndex: "customerName",
        key: "customerName",
        width: 200,
        render: (name, record) => (
          <div className="flex flex-col">
            <span className="text-slate-900 font-medium text-[14px] tracking-tight leading-none mb-1">{name}</span>
            {record.needConsultation && (
              <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                <AlertCircle size={10} /> Cần tư vấn
              </span>
            )}
          </div>
        ),
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Số điện thoại</span>,
        dataIndex: "phone",
        key: "phone",
        width: 150,
        render: (phone) => (
          <span className="text-slate-600 text-[14px] font-medium">
            {phone}
          </span>
        ),
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Ngày thu</span>,
        dataIndex: "recordDate",
        key: "recordDate",
        width: 130,
        render: (date) => (
          <span className="text-slate-600 text-[14px] font-medium">
            {dayjs(date).format("DD/MM/YYYY")}
          </span>
        ),
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Ngày đặt</span>,
        dataIndex: "createdDate",
        key: "createdDate",
        width: 140,
        render: (date) => (
          <span className="text-slate-600 text-[14px] font-medium">
            {date ? dayjs(date).format("DD/MM/YYYY") : "---"}
          </span>
        ),
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Dịch vụ yêu cầu</span>,
        dataIndex: "services",
        key: "services",
        width: 240,
        render: (svcs) => {
          if (!svcs || (Array.isArray(svcs) && svcs.length === 0)) return <span className="text-slate-300 italic text-xs">N/A</span>;

          const serviceList = Array.isArray(svcs) ? svcs : [svcs];

          if (serviceList.length > 1) {
            return (
              <Tooltip
                title={
                  <div className="flex flex-col gap-1.5 p-1">
                    {serviceList.map((n, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-white text-[13px] font-medium">{typeof n === 'string' ? n : n.name}</span>
                      </div>
                    ))}
                  </div>
                }
                color="#0f172a"
                placement="topLeft"
              >
                <span className="text-blue-600 text-[14px] font-medium cursor-pointer border-b border-dashed border-blue-400 pb-0.5 hover:text-blue-700 hover:border-blue-700 transition-colors">
                  Nhiều dịch vụ
                </span>
              </Tooltip>
            );
          }

          const n = serviceList[0];
          return (
            <span className="text-slate-700 font-medium text-[14px]">
              {typeof n === 'string' ? n : n.name}
            </span>
          );
        },
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Tiến độ</span>,
        dataIndex: "status",
        key: "status",
        width: 180,
        render: (status, record) => {
          return (
            <Select
              value={status}
              onChange={(val) => handleStatusUpdate(record.id, val)}
              className="w-full select-custom-sm"
              dropdownStyle={{ borderRadius: '12px', padding: '4px', border: '1px solid #f1f5f9' }}
              popupMatchSelectWidth={false}
            >
              {bookingStatuses.map((s) => (
                <Option key={s.value} value={s.value}>
                  <div className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
                    {getStatusIcon(s.value)}
                    <span>{s.label}</span>
                  </div>
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Thao tác</span>,
        key: "actions",
        width: 140,
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              type="text"
              onClick={() => handleViewDetails(record)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all p-0"
              title="Xem chi tiết"
            >
              <Search size={16} strokeWidth={2} />
            </Button>
            <Button
              type="text"
              onClick={() => handleEdit(record)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-500 hover:bg-amber-50 transition-all p-0"
              title="Chỉnh sửa"
            >
              <Edit size={16} strokeWidth={2} />
            </Button>
            <Button
              type="text"
              onClick={() => openDeleteModal(record)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-all p-0"
              title="Gỡ bỏ"
            >
              <Trash2 size={18} strokeWidth={2.5} />
            </Button>
          </div>
        ),
      },
    ],
    [allServices, staffList, updateBookingStatus, assignStaff, handleEdit, openDeleteModal]
  );

  return (
    <>
      <div className="space-y-8 animate-in transition-all duration-500">
        {messageContext}

      {/* Stats Section */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
        {[
          {
            icon: <ShoppingBag className="w-5 h-5 text-indigo-600" strokeWidth={2} />,
            label: "Tổng đơn",
            value: globalStats.totalBookings,
            config: "bg-indigo-50 border border-indigo-100"
          },
          {
            icon: <Timer className="w-5 h-5 text-amber-600" strokeWidth={2} />,
            label: "Sắp tới",
            value: (globalStats.pendingBookings || 0) + (globalStats.confirmedBookings || 0),
            config: "bg-amber-50 border border-amber-100"
          },
          {
            icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" strokeWidth={2} />,
            label: "Xong",
            value: globalStats.completedBookings,
            config: "bg-emerald-50 border border-emerald-100"
          },
          {
            icon: <XCircle className="w-5 h-5 text-rose-500" strokeWidth={2} />,
            label: "Đã hủy",
            value: globalStats.cancelledBookings,
            config: "bg-rose-50 border border-rose-100"
          }
        ].map((item, i) => (
          <div key={i} className="bg-white p-3 sm:p-5 rounded-2xl sm:rounded-[28px] border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4 transition-all hover:shadow-md group">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${item.config} flex items-center justify-center shrink-0`}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <h4 className="text-[12px] sm:text-[13px] font-medium text-slate-500 truncate">{item.label}</h4>
              <p className="text-[18px] sm:text-[22px] font-bold text-slate-900 leading-none mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[28px] sm:rounded-[32px] border-none sm:border border-slate-200 shadow-none sm:shadow-sm space-y-4 sm:space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-50 pb-2">
          <h2 className="text-[17px] sm:text-[20px] font-bold text-slate-800 whitespace-nowrap flex items-center gap-2.5">
            <div className="w-1 h-5 sm:h-8 bg-blue-600 rounded-full"></div>
            Lịch thu âm
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
              <BookingFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onDateRangeChange={handleDateRangeChange}
                onClear={clearFilters}
                bookingStatuses={bookingStatuses}
                selectedRowKeys={selectedRowKeys}
                onBulkDelete={handleBulkDelete}
                showSearch={true}
              >
                <Button
                  onClick={handleCreate}
                  className="h-9 w-9 sm:w-auto sm:px-4 bg-slate-900 border-none font-medium text-[13px] flex items-center justify-center gap-2 !text-white hover:!bg-slate-800 rounded-xl transition-all p-0 shadow-lg shadow-slate-200"
                >
                  <Plus size={16} strokeWidth={3} className="text-white" />
                  <span className="hidden sm:inline text-white">Thêm lịch</span>
                </Button>
              </BookingFilters>
            </div>
          </div>
        </div>


        <div className="sm:rounded-[28px] sm:border-2 sm:border-slate-200 overflow-hidden bg-white sm:shadow-inner">
          {/* Table View (shown from md/768px) */}
          <div className="hidden md:block">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={Array.isArray(bookings) ? bookings : []}
              rowKey="id"
              loading={loading}
              pagination={false}
              onChange={handleTableChange}
              size={window.innerWidth < 1200 ? "small" : "default"}
              className="custom-admin-table ant-table-custom ant-table-booking"
              locale={{
                emptyText: (
                  <div className="py-20 flex flex-col items-center opacity-30">
                    <SlidersHorizontal size={48} className="mb-4" />
                    <span className="text-[15px] text-slate-600 font-medium ">Chưa có lịch thu âm nào</span>
                  </div>
                )
              }}
            />
          </div>

          {/* Mobile Card View (hidden from md/768px) */}
          <div className="md:hidden">
            {loading ? (
              <div className="grid grid-cols-2 gap-2.5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-44 bg-slate-50 rounded-2xl animate-pulse border border-slate-100"></div>
                ))}
              </div>
            ) : (Array.isArray(bookings) && bookings.length > 0) ? (
              <div className="grid grid-cols-2 gap-2.5">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-3 rounded-[20px] border border-slate-100 shadow-sm flex flex-col h-full hover:border-blue-200 transition-all">
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-bold text-slate-900 truncate tracking-tight">{booking.customerName}</h4>
                        <p className="text-[10px] font-medium text-slate-500 mt-0.5">{booking.phone}</p>
                      </div>
                      <div className="px-1 py-0.5 bg-slate-50 text-slate-400 rounded text-[9px] font-medium shrink-0">
                         #{booking.bookingCode?.slice(-4)}
                      </div>
                    </div>

                    <div className="py-1.5 border-y border-slate-50 space-y-1 mb-2.5">
                      <div className="flex items-center gap-1 text-slate-500">
                        <CalendarDays size={11} className="shrink-0" />
                        <span className="text-[10.5px] font-medium">{dayjs(booking.recordDate).format("DD/MM/YY")}</span>
                      </div>
                      {booking.needConsultation && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[9px] font-bold uppercase w-fit">
                          <span>Cần tư vấn</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto space-y-2.5">
                      <Select
                        value={booking.status}
                        onChange={(val) => handleStatusUpdate(booking.id, val)}
                        className="w-full select-custom-xs status-select-mobile"
                        size="small"
                        bordered={false}
                        dropdownStyle={{ borderRadius: '12px' }}
                        popupMatchSelectWidth={false}
                      >
                        {bookingStatuses.map((s) => (
                          <Option key={s.value} value={s.value}>
                            <div className="flex items-center gap-1.5 text-[10.5px] font-medium">
                              {getStatusIcon(s.value)}
                              <span>{s.label}</span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-slate-50">
                        <button
                          onClick={() => handleViewDetails(booking)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors p-0 bg-transparent border-none cursor-pointer"
                        >
                          <Search size={13} />
                        </button>
                        <button
                          onClick={() => handleEdit(booking)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-amber-500 transition-colors p-0 bg-transparent border-none cursor-pointer"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => openDeleteModal(booking)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors p-0 bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center opacity-30">
                <SlidersHorizontal size={28} className="mb-2" />
                <span className="text-[11px] text-slate-500 font-medium">Danh sách trống</span>
              </div>
            )}
          </div>
        </div>

          {pagination.total > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50/20 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[12px] sm:text-[13px] font-medium text-slate-500">
                Hiển thị <span className="text-slate-900">{pagination.current} / {Math.ceil(pagination.total / (pagination.pageSize || 10))}</span> trang
              </div>

              <div className="flex items-center gap-2">
                <Button
                  className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg bg-white border-slate-200 text-slate-500 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all p-0"
                  disabled={pagination.current === 1}
                  onClick={() => handleTableChange({ current: pagination.current - 1, pageSize: pagination.pageSize })}
                  icon={<ChevronLeft size={16} />}
                />

                <Button
                  className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg bg-white border-slate-200 text-slate-500 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all p-0"
                  disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                  onClick={() => handleTableChange({ current: pagination.current + 1, pageSize: pagination.pageSize })}
                  icon={<ChevronRight size={16} />}
                />
              </div>
            </div>
          )}
        </div>
      {/*** MODALS ***/}
      <BookingForm
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedBooking}
        services={allServices}
        studios={allStudios}
      />

      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        centered
        width={isMobile ? "92%" : 480}
        closable={false}
        className="premium-delete-modal"
      >
        <div className={isMobile ? "space-y-4" : "space-y-6"}>
          <div className="space-y-1">
            <h3 className={`${isMobile ? "text-[18px]" : "text-[24px]"} font-bold text-slate-900 leading-tight`}>Xóa lịch thu âm</h3>
            <p className={`${isMobile ? "text-[13px]" : "text-[15px]"} text-slate-500 leading-relaxed font-medium`}>
              Thao tác này sẽ xóa vĩnh viễn đơn đặt. Hành động này không thể hoàn tác.
            </p>
          </div>

          <div className={isMobile ? "space-y-3" : "space-y-4"}>
            <div className="space-y-2">
              <label className={`${isMobile ? "text-[13px]" : "text-[15px]"} font-medium text-slate-700`}>
                Mã xác nhận: <span className="text-red-500">"{selectedBooking?.bookingCode}"</span>
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Nhập mã đơn..."
                className={`${isMobile ? "h-9 text-[13px]" : "h-11 text-[14px]"} rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-100 font-medium`}
              />
            </div>

            <div className={`flex items-start gap-3 ${isMobile ? "p-3" : "p-4"} bg-red-50 rounded-xl border border-red-100`}>
              <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={12} strokeWidth={2.5} />
              </div>
              <p className={`${isMobile ? "text-[12px]" : "text-[15px]"} font-medium text-red-800 leading-relaxed`}>
                Cảnh báo: Việc xóa sẽ loại bỏ lịch trình và doanh thu.
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className={`flex-1 ${isMobile ? "h-10 text-[13px]" : "h-12 text-[15px]"} rounded-xl border border-slate-200 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors`}
            >
              Hủy
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteConfirmText !== selectedBooking?.bookingCode}
              className={`flex-[1.5] ${isMobile ? "h-10 text-[13px]" : "h-12 text-[15px]"} rounded-xl font-medium shadow-lg shadow-red-100 transition-all ${deleteConfirmText === selectedBooking?.bookingCode
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border-none shadow-none"
                }`}
            >
              Xác nhận xóa
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        title={null}
        open={isBulkDeleteModalOpen}
        onOk={confirmBulkDelete}
        onCancel={() => setIsBulkDeleteModalOpen(false)}
        footer={null}
        centered
        width={450}
      >
        <div className="p-4 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-none flex items-center justify-center mx-auto mb-6">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-2">Xóa hàng loạt?</h3>
          <p className="text-slate-500 text-sm font-medium mb-6">Bạn đang chuẩn bị xóa <strong>{selectedRowKeys.length}</strong> đơn hàng đã chọn.</p>

          <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar mb-8 space-y-2">
            {selectedRowKeys.map((key) => {
              const booking = bookings.find((b) => b.id === key);
              return booking ? (
                <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-none border border-slate-100">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black text-blue-600">{booking.bookingCode}</span>
                    <span className="text-xs font-bold text-slate-700">{booking.customerName}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{booking.phone}</span>
                </div>
              ) : null;
            })}
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setIsBulkDeleteModalOpen(false)} className="flex-1 h-12 rounded-none font-bold text-[10px]">Hủy bỏ</Button>
            <Button onClick={confirmBulkDelete} danger type="primary" className="flex-1 h-12 rounded-none bg-red-600 border-none font-bold text-[10px]">Xóa {selectedRowKeys.length} đơn</Button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal Redesign */}
      <Modal
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={900}
        centered
        closable={false}
        className="premium-detail-modal !max-w-[95vw]"
        styles={{ content: { padding: 0, borderRadius: '24px', overflow: 'hidden' } }}
      >
        {selectedDetailBooking && (
          <div className="flex flex-col bg-white">
            {/* Modal Header - Light Theme */}
            <div className="bg-slate-50 px-4 py-5 sm:px-8 sm:py-10 text-slate-900 relative overflow-hidden border-b border-slate-200">
              {/* Subtle Decorative Element */}
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-80 sm:h-80 bg-blue-500/5 rounded-full blur-3xl -mr-20 sm:-mr-32 -mt-20 sm:-mt-32"></div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 relative z-10">
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 text-slate-500 rounded-md text-[11px] sm:text-[12px] font-medium shadow-sm">
                      Chi tiết đặt lịch
                    </span>
                    <span className="text-slate-300 font-bold">/</span>
                    <span className="text-slate-400 font-bold text-[10px] sm:text-[11px] truncate max-w-[120px] sm:max-w-none">
                      #{selectedDetailBooking.bookingCode}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-3xl font-bold text-slate-900 mb-0">
                    {selectedDetailBooking.customerName}
                  </h2>
                </div>

                <div className="flex items-start sm:items-end">
                  <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl flex items-center gap-1.5 sm:gap-2 border shadow-md ${bookingStatuses.find(s => s.value === selectedDetailBooking.status)?.classes}`}>
                    {getStatusIcon(selectedDetailBooking.status)}
                    <span className="font-medium text-[12px] sm:text-[13px]">
                      {bookingStatuses.find(s => s.value === selectedDetailBooking.status)?.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-3 py-4 sm:px-8 sm:py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-10">

                {/* Left Column: Customer & Timeline */}
                <div className="md:col-span-1 space-y-5 sm:space-y-8">
                  <section>
                    <h4 className="text-[13px] sm:text-[14px] font-medium text-slate-500 mb-2.5 sm:mb-3 flex items-center gap-2">
                      <User size={16} className="sm:w-[18px] sm:h-[18px] text-blue-500" /> Liên hệ
                    </h4>
                    <div className="space-y-2.5 sm:space-y-3">
                      <div>
                        <p className="text-[13px] sm:text-[14px] font-medium text-slate-900 mb-0.5">{selectedDetailBooking.phone}</p>
                        <p className="text-[11px] sm:text-[12px] font-medium text-slate-500">Số điện thoại</p>
                      </div>
                      <div>
                        <p className="text-[13px] sm:text-[14px] font-medium text-slate-900 mb-0.5">{selectedDetailBooking.email || "Chưa cập nhật"}</p>
                        <p className="text-[11px] sm:text-[12px] font-medium text-slate-500">Email liên lạc</p>
                      </div>
                    </div>
                  </section>

                  <div className="h-px bg-slate-100"></div>

                  <section>
                    <h4 className="text-[13px] sm:text-[14px] font-medium text-slate-500 mb-2.5 sm:mb-3 flex items-center gap-2">
                      <Clock size={16} className="sm:w-[18px] sm:h-[18px] text-amber-500" /> Thời gian
                    </h4>
                    <div className="bg-slate-50 p-3 sm:p-3.5 rounded-lg sm:rounded-xl border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-[12px] sm:text-[13px] font-bold text-slate-700 m-0">
                          {selectedDetailBooking.createdDate ? dayjs(selectedDetailBooking.createdDate).format("DD/MM/YYYY") : "---"}
                        </p>
                      </div>
                      <p className="text-[12px] sm:text-[13px] font-medium text-slate-600 m-0 pl-3.5">
                        Đặt lịch lúc: <span className="text-slate-600 ml-1">
                          {selectedDetailBooking.createdDate ? dayjs(selectedDetailBooking.createdDate).format("HH:mm:ss") : "---"}
                        </span>
                      </p>
                    </div>
                  </section>
                </div>

                {/* Right Column: Services & Studio */}
                <div className="md:col-span-2 space-y-5 sm:space-y-10">
                  {/* Booking Info Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-8">
                    <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                      <p className="text-[12px] sm:text-[14px] font-medium text-slate-500 mb-1 sm:mb-1.5 flex items-center gap-1.5 sm:gap-2">
                        <CalendarDays size={13} className="sm:w-4 sm:h-4 text-blue-500" /> Ngày thu
                      </p>
                      <p className="text-[15px] sm:text-[17px] font-medium text-slate-700">
                        {dayjs(selectedDetailBooking.recordDate).format("DD/MM/YYYY")}
                      </p>
                      {dayjs(selectedDetailBooking.recordDate).isBefore(dayjs(), 'day') ? (
                        <span className="text-[11px] sm:text-[12px] font-bold text-red-500">Đã quá hạn</span>
                      ) : (
                        <span className="text-[11px] sm:text-[12px] font-bold text-emerald-500">Sắp đến</span>
                      )}
                    </div>

                    <div className="bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                      <p className="text-[12px] sm:text-[14px] font-medium text-slate-500 mb-1 sm:mb-1.5 flex items-center gap-1.5 sm:gap-2">
                        <Home size={13} className="sm:w-4 sm:h-4 text-orange-500" /> Phòng thu
                      </p>
                      <p className="text-[15px] sm:text-[17px] font-medium text-slate-700">
                        {typeof selectedDetailBooking.studioRoom === "object" ? selectedDetailBooking.studioRoom?.studioName : selectedDetailBooking.studioRoom}
                      </p>
                    </div>
                  </div>

                  {/* Services List */}
                  <section>
                    <h4 className="text-[13px] sm:text-[15px] font-medium text-slate-600 mb-3 sm:mb-4 flex items-center gap-2">
                      <Package size={18} className="sm:w-5 sm:h-5 text-indigo-500" /> Dịch vụ
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {Array.isArray(selectedDetailBooking.services)
                        ? selectedDetailBooking.services.map((s, i) => (
                          <div key={i} className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium rounded-lg text-[12px] sm:text-[13px] flex items-center gap-1.5 sm:gap-2">
                            <CheckCircle size={13} strokeWidth={3} className="sm:w-4 sm:h-4" />
                            {s.name || s}
                          </div>
                        ))
                        : (
                          <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded-lg sm:rounded-xl text-[11px] sm:text-[12px] flex items-center gap-1.5 sm:gap-2">
                            <CheckCircle size={16} strokeWidth={3} className="sm:w-[18px] sm:h-[18px]" />
                            {selectedDetailBooking.services?.name || selectedDetailBooking.services}
                          </div>
                        )
                      }
                    </div>
                  </section>

                  {/* Notes */}
                  <section>
                    <h4 className="text-[13px] sm:text-[15px] font-medium text-slate-600 mb-3 sm:mb-4 flex items-center gap-2">
                      <FileText size={18} className="sm:w-5 sm:h-5 text-slate-500" /> Ghi chú
                    </h4>
                    <div className="p-4 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-[20px] border-l-4 border-slate-900 text-[13px] sm:text-[15px] font-medium text-slate-600 leading-relaxed italic shadow-inner">
                      {selectedDetailBooking.note || "Không có ghi chú"}
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-3 py-3 sm:px-8 sm:py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
                <Button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="flex-1 md:flex-none h-10 sm:h-12 px-6 sm:px-10 rounded-xl bg-white border border-slate-300 font-bold text-[12px] sm:text-[13px] text-slate-700 shadow-sm hover:!bg-white hover:!text-slate-700 hover:!border-slate-300 transition-none"
                >
                  Đóng
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEdit(selectedDetailBooking);
                  }}
                  className="flex-1 md:flex-none h-10 sm:h-12 px-5 sm:px-8 rounded-xl bg-slate-900 border-none font-medium text-[12px] sm:text-[14px] text-white shadow-lg shadow-slate-200 hover:!bg-slate-900 hover:!text-white transition-none active:scale-95"
                >
                  Chỉnh sửa lịch
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
      </div>
    </>
  );
};

export default BookingManagement;
