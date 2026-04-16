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
  UserX
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
      case "PENDING": return <Clock size={24} />;
      case "CONFIRMED": return <CalendarCheck size={24} />;
      case "COMPLETED": return <CheckCircle2 size={24} />;
      case "CANCELLED": return <XCircle size={24} />;
      default: return null;
    }
  };

  const columns = useMemo(
    () => [
      {
        title: <span className="text-[15px] font-semibold text-slate-600">Mã đơn</span>,
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
        title: <span className="text-[15px] font-semibold text-slate-600">Khách hàng</span>,
        dataIndex: "customerName",
        key: "customerName",
        width: 200,
        render: (name, record) => (
          <div className="flex flex-col">
            <span className="text-slate-900 font-medium text-[14px] tracking-tight leading-none mb-1">{name}</span>
            {record.needConsultation && (
              <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 uppercase tracking-wider">
                <AlertCircle size={10} /> Cần tư vấn
              </span>
            )}
          </div>
        ),
      },
      {
        title: <span className="text-[15px] font-semibold text-slate-600">Số điện thoại</span>,
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
        title: <span className="text-[15px] font-semibold text-slate-600">Ngày thu</span>,
        dataIndex: "recordDate",
        key: "recordDate",
        width: 130,
        render: (date) => (
          <span className="text-slate-600 text-[14px] font-semibold">
            {dayjs(date).format("DD/MM/YYYY")}
          </span>
        ),
      },
      {
        title: <span className="text-[15px] font-semibold text-slate-600">Ngày đặt</span>,
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
        title: <span className="text-[15px] font-semibold text-slate-600">Dịch vụ yêu cầu</span>,
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
                <span className="text-blue-600 text-[14px] font-semibold cursor-pointer border-b border-dashed border-blue-400 pb-0.5 hover:text-blue-700 hover:border-blue-700 transition-colors">
                  Nhiều dịch vụ
                </span>
              </Tooltip>
            );
          }

          const n = serviceList[0];
          return (
            <span className="text-slate-700 font-semibold text-[14px]">
              {typeof n === 'string' ? n : n.name}
            </span>
          );
        },
      },
      {
        title: <span className="text-[15px] font-semibold text-slate-600">Tiến độ</span>,
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
            >
              {bookingStatuses.map((s) => (
                <Option key={s.value} value={s.value}>
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-700">
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
        title: <span className="text-[15px] font-semibold text-slate-600">Thao tác</span>,
        key: "actions",
        width: 140,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              type="text"
              onClick={() => handleViewDetails(record)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all p-0"
              title="Xem chi tiết"
            >
              <Search size={18} strokeWidth={2.5} />
            </Button>
            <Button
              type="text"
              onClick={() => handleEdit(record)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-500 hover:bg-amber-50 transition-all p-0"
              title="Chỉnh sửa"
            >
              <Edit size={18} strokeWidth={2.5} />
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
    <div className="space-y-8 animate-in transition-all duration-500">
      {messageContext}

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          {
            icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" strokeWidth={1.5} />,
            label: "Tổng đơn",
            value: globalStats.totalBookings,
            config: "bg-indigo-100 border border-indigo-200/60"
          },
          {
            icon: <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" strokeWidth={1.5} />,
            label: "Xử lý",
            value: (globalStats.pendingBookings || 0) + (globalStats.confirmedBookings || 0),
            config: "bg-amber-100 border border-amber-200/60"
          },
          {
            icon: <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" strokeWidth={1.5} />,
            label: "Hoàn tất",
            value: globalStats.completedBookings,
            config: "bg-emerald-100 border border-emerald-200/60"
          },
          {
            icon: <UserX className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" strokeWidth={1.5} />,
            label: "Đã hủy",
            value: globalStats.cancelledBookings,
            config: "bg-rose-100 border border-rose-200/60"
          }
        ].map((item, i) => (
          <div key={i} className={`bg-white p-3 sm:p-7 rounded-2xl sm:rounded-[24px] border border-slate-300 shadow-sm flex flex-col sm:flex-row items-center gap-2 sm:gap-5 transition-all hover:shadow-xl hover:shadow-slate-200/50 group text-center sm:text-left flex`}>
            <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${item.config} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              {item.icon}
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-slate-500 sm:text-slate-600 whitespace-nowrap">{item.label}</h4>
              <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mt-1">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 pb-6 border-b border-slate-50">
          <h2 className="text-[16px] sm:text-[20px] font-bold text-slate-800 whitespace-nowrap mr-auto flex items-center gap-3">
            <div className="w-1.5 h-5 sm:h-8 bg-blue-600 rounded-full"></div>
            Danh sách lịch thu âm
          </h2>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
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
                className="h-10 px-4 sm:px-6 bg-slate-900 border-none font-semibold sm:font-bold text-[13px] sm:text-[14px] flex items-center justify-center gap-1.5 sm:gap-2 !text-white hover:!bg-slate-800 rounded-xl transition-all flex-1 sm:flex-none"
              >
                <Plus size={16} strokeWidth={3} />
                Tạo mới
              </Button>
            </BookingFilters>
          </div>
        </div>


        <div className="rounded-[28px] border-2 border-slate-200 overflow-hidden bg-white shadow-inner">
          {/* Desktop Table */}
          <div className="hidden lg:block">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={Array.isArray(bookings) ? bookings : []}
              rowKey="id"
              loading={loading}
              pagination={false}
              onChange={handleTableChange}
              size={window.innerWidth < 1024 ? "small" : "default"}
              className="custom-admin-table ant-table-custom ant-table-booking"
              locale={{
                emptyText: (
                  <div className="py-20 flex flex-col items-center opacity-30">
                    <SlidersHorizontal size={48} className="mb-4" />
                    <span className="text-[15px] text-slate-600 font-semibold ">Chưa có lịch thu âm nào</span>
                  </div>
                )
              }}
            />
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {loading ? (
              <div className="p-4 sm:p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse border border-slate-100"></div>
                ))}
              </div>
            ) : (Array.isArray(bookings) && bookings.length > 0) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-6">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-semibold text-slate-900 truncate">{booking.customerName}</h4>
                        <p className="text-[12px] font-medium text-slate-500 mt-0.5">{booking.phone}</p>
                      </div>
                      <div className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium tracking-wider border border-slate-200 shrink-0">
                        {booking.bookingCode || booking.bookingCode?.slice(0, 8)}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-2 border-y border-slate-50 text-[12px]">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <CalendarDays size={13} className="text-blue-500" />
                        <span className="font-semibold">{dayjs(booking.recordDate).format("DD/MM/YYYY")}</span>
                      </div>
                      {booking.needConsultation && (
                        <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 uppercase tracking-wider">
                          <AlertCircle size={10} /> Cần tư vấn
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <Select
                        value={booking.status}
                        onChange={(val) => handleStatusUpdate(booking.id, val)}
                        className="w-[140px] select-custom-sm"
                        size="small"
                      >
                        {bookingStatuses.map((s) => (
                          <Option key={s.value} value={s.value}>
                            <span className="text-[12px] font-semibold">{s.label}</span>
                          </Option>
                        ))}
                      </Select>
                      <div className="flex items-center gap-1">
                        <Button type="text" onClick={() => handleViewDetails(booking)} className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 p-0"><Search size={16} /></Button>
                        <Button type="text" onClick={() => handleEdit(booking)} className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-500 p-0"><Edit size={16} /></Button>
                        <Button type="text" onClick={() => openDeleteModal(booking)} className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 p-0"><Trash2 size={16} /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center opacity-30">
                <SlidersHorizontal size={40} className="mb-4" />
                <span className="text-[13px] text-slate-600 font-semibold">Chưa có lịch thu âm nào</span>
              </div>
            )}
          </div>

          {pagination.total > 0 && (
            <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="px-3 py-1 bg-white border border-slate-100 rounded-xl text-[13px] font-medium text-slate-500 shadow-sm">Hiển thị
                <span> {pagination.current} / {Math.ceil(pagination.total / (pagination.pageSize || 10))}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border-slate-200 text-slate-500 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all p-0"
                  disabled={pagination.current === 1}
                  onClick={() => handleTableChange({ current: pagination.current - 1, pageSize: pagination.pageSize })}
                  icon={<ChevronLeft size={16} />}
                />

                <Button
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border-slate-200 text-slate-500 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all p-0"
                  disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                  onClick={() => handleTableChange({ current: pagination.current + 1, pageSize: pagination.pageSize })}
                  icon={<ChevronRight size={16} />}
                />
              </div>
            </div>
          )}
        </div>
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
        title={null}
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        centered
        width={400}
        className="delete-confirmation-modal !max-w-[95vw]"
      >
        <div className="p-4 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Gỡ bỏ đơn hàng?</h3>
          <p className="text-slate-500 text-sm font-medium mb-8">Thao tác này sẽ xóa hồ sơ đơn hàng vĩnh viễn và không thể khôi phục.</p>

          {selectedBooking && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-[10px] font-black text-slate-400">Mã đơn</span>
                <span className="text-xs font-black text-slate-700">{selectedBooking.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-black text-slate-400">Khách hàng</span>
                <span className="text-xs font-black text-slate-700">{selectedBooking.customerName}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 h-12 rounded-none font-black uppercase tracking-widest text-[10px]">Quay lại</Button>
            <Button onClick={confirmDelete} danger type="primary" className="flex-1 h-12 rounded-none bg-red-600 border-none font-black uppercase tracking-widest text-[10px]">Xác nhận xóa</Button>
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
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Xóa hàng loạt?</h3>
          <p className="text-slate-500 text-sm font-medium mb-6">Bạn đang chuẩn bị xóa <strong>{selectedRowKeys.length}</strong> đơn hàng đã chọn.</p>

          <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar mb-8 space-y-2">
            {selectedRowKeys.map((key) => {
              const booking = bookings.find((b) => b.id === key);
              return booking ? (
                <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-none border border-slate-100">
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{booking.bookingCode}</span>
                    <span className="text-xs font-bold text-slate-700">{booking.customerName}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{booking.phone}</span>
                </div>
              ) : null;
            })}
          </div>

          <div className="flex gap-3">
            <Button onClick={() => setIsBulkDeleteModalOpen(false)} className="flex-1 h-12 rounded-none font-black uppercase tracking-widest text-[10px]">Hủy bỏ</Button>
            <Button onClick={confirmBulkDelete} danger type="primary" className="flex-1 h-12 rounded-none bg-red-600 border-none font-black uppercase tracking-widest text-[10px]">Xóa {selectedRowKeys.length} đơn</Button>
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
            <div className="bg-slate-50 px-4 py-6 sm:px-8 sm:py-10 text-slate-900 relative overflow-hidden border-b border-slate-200">
              {/* Subtle Decorative Element */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-lg text-[14px] font-medium shadow-sm">
                      Chi tiết đặt lịch
                    </span>
                    <span className="text-slate-300 font-bold">/</span>
                    <span className="text-slate-400 font-bold tracking-widest uppercase text-[12px]">
                      #{selectedDetailBooking.bookingCode}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-0">
                    {selectedDetailBooking.customerName}
                  </h2>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className={`px-5 py-2 rounded-2xl flex items-center gap-2 border shadow-lg ${bookingStatuses.find(s => s.value === selectedDetailBooking.status)?.classes}`}>
                    {getStatusIcon(selectedDetailBooking.status)}
                    <span className="font-semibold text-[15px]">
                      {bookingStatuses.find(s => s.value === selectedDetailBooking.status)?.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-10">

                {/* Left Column: Customer & Timeline */}
                <div className="md:col-span-1 space-y-6 sm:space-y-8">
                  <section>
                    <h4 className="text-[16px] font-medium text-slate-600  mb-4 flex items-center gap-2">
                      <User size={20} className="text-blue-500" /> Liên hệ
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[16px] font-medium text-slate-900 mb-0.5">{selectedDetailBooking.phone}</p>
                        <p className="text-[13px] font-medium text-slate-600">Số điện thoại</p>
                      </div>
                      <div>
                        <p className="text-[16px] font-medium text-slate-900 mb-0.5">{selectedDetailBooking.email || "Chưa cập nhật"}</p>
                        <p className="text-[13px] font-medium text-slate-600">Email liên lạc</p>
                      </div>
                    </div>
                  </section>

                  <div className="h-px bg-slate-100"></div>

                  <section>
                    <h4 className="text-[15px] font-medium text-slate-600 mb-4 flex items-center gap-2">
                      <Clock size={20} className="text-amber-500" /> Thời gian
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                        <p className="text-[14px] font-bold text-slate-700 m-0">
                          {selectedDetailBooking.createdDate ? dayjs(selectedDetailBooking.createdDate).format("DD/MM/YYYY") : "---"}
                        </p>
                      </div>
                      <p className="text-[14px] font-medium text-slate-600 m-0 pl-4">
                        Đặt lịch lúc: <span className="text-slate-600 ml-1">
                          {selectedDetailBooking.createdDate ? dayjs(selectedDetailBooking.createdDate).format("HH:mm:ss") : "---"}
                        </span>
                      </p>
                    </div>
                  </section>
                </div>

                {/* Right Column: Services & Studio */}
                <div className="md:col-span-2 space-y-6 sm:space-y-10">
                  {/* Booking Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden group">
                      <p className="text-[16px] font-medium text-slate-600 mb-2 flex items-center gap-2">
                        <CalendarDays size={18} className="text-blue-500" /> Ngày thu âm
                      </p>
                      <p className="text-[19px] font-medium text-slate-700">
                        {dayjs(selectedDetailBooking.recordDate).format("DD/MM/YYYY")}
                      </p>
                      {dayjs(selectedDetailBooking.recordDate).isBefore(dayjs(), 'day') ? (
                        <span className="text-[13px] font-bold text-red-500">Đã quá hạn</span>
                      ) : (
                        <span className="text-[13px] font-bold text-emerald-500">Sắp đến</span>
                      )}
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden group">
                      <p className="text-[16px] font-medium text-slate-600 mb-2 flex items-center gap-2">
                        <Home size={18} className="text-orange-500" /> Phòng thu
                      </p>
                      <p className="text-[19px] font-medium text-slate-700">
                        {typeof selectedDetailBooking.studioRoom === "object" ? selectedDetailBooking.studioRoom?.studioName : selectedDetailBooking.studioRoom}
                      </p>
                    </div>
                  </div>

                  {/* Services List */}
                  <section>
                    <h4 className="text-[15px] font-medium text-slate-600 mb-4 flex items-center gap-2">
                      <Package size={20} className="text-indigo-500" /> Dịch vụ
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedDetailBooking.services)
                        ? selectedDetailBooking.services.map((s, i) => (
                          <div key={i} className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold rounded-xl text-[14px] flex items-center gap-2">
                            <CheckCircle size={18} strokeWidth={3} />
                            {s.name || s}
                          </div>
                        ))
                        : (
                          <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold rounded-xl text-[12px] flex items-center gap-2">
                            <CheckCircle size={18} strokeWidth={3} />
                            {selectedDetailBooking.services?.name || selectedDetailBooking.services}
                          </div>
                        )
                      }
                    </div>
                  </section>

                  {/* Notes */}
                  <section>
                    <h4 className="text-[15px] font-medium text-slate-600 mb-4 flex items-center gap-2">
                      <FileText size={20} className="text-slate-500" /> Ghi chú
                    </h4>
                    <div className="p-6 bg-slate-50 rounded-[20px] border-l-4 border-slate-900 text-[15px] font-medium text-slate-600 leading-relaxed italic shadow-inner">
                      {selectedDetailBooking.note || "Không có ghi chú"}
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-4 sm:px-8 sm:py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <div className="flex gap-3 w-full md:w-auto">
                <Button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="flex-1 md:flex-none h-12 px-10 rounded-xl bg-white border border-slate-300 font-bold text-[13px] text-slate-700 shadow-sm hover:!bg-white hover:!text-slate-700 hover:!border-slate-300 transition-none"
                >
                  Đóng
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEdit(selectedDetailBooking);
                  }}
                  className="flex-1 md:flex-none h-12 px-8 rounded-xl bg-slate-900 border-none font-medium text-[14px] text-white shadow-lg shadow-slate-200 hover:!bg-slate-900 hover:!text-white transition-none active:scale-95"
                >
                  Chỉnh sửa lịch
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingManagement;
