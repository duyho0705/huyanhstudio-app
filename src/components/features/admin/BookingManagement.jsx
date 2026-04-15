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
  { value: "PENDING", label: "Chờ xác nhận", color: "orange", classes: "bg-orange-50 text-orange-600 border-orange-100" },
  { value: "CONFIRMED", label: "Đã xác nhận", color: "purple", classes: "bg-purple-50 text-purple-600 border-purple-100" },
  { value: "COMPLETED", label: "Hoàn thành", color: "green", classes: "bg-green-50 text-green-600 border-green-100" },
  { value: "CANCELLED", label: "Đã hủy", color: "red", classes: "bg-red-50 text-red-600 border-red-100" },
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
      case "PENDING": return <Clock size={14} />;
      case "CONFIRMED": return <CalendarCheck size={14} />;
      case "COMPLETED": return <CheckCircle2 size={14} />;
      case "CANCELLED": return <XCircle size={14} />;
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
          <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[13px] font-semibold tracking-wider border border-slate-200 inline-block shadow-sm">
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
            <span className="text-slate-900 font-semibold text-[15px] tracking-tight leading-none mb-1">{name}</span>
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
          <span className="text-slate-600 text-[15px] font-semibold">
            {phone}
          </span>
        ),
      },
      {
        title: <span className="text-[15px] font-semibold text-slate-600">Ngày thu</span>,
        dataIndex: "recordDate",
        key: "recordDate",
        width: 140,
        render: (date) => (
          <span className="text-slate-600 text-[15px] font-semibold">
            {dayjs(date).format("DD/MM/YYYY")}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            icon: <ShoppingBag size={26} strokeWidth={1.5} className="text-indigo-600" />, 
            label: "Tổng đơn hàng", 
            value: globalStats.totalBookings, 
            config: "bg-indigo-100 border border-indigo-200/60" 
          },
          { 
            icon: <Timer size={26} strokeWidth={1.5} className="text-amber-600" />, 
            label: "Chờ xác nhận", 
            value: globalStats.pendingBookings, 
            config: "bg-amber-100 border border-amber-200/60" 
          },
          { 
            icon: <CheckCircle2 size={26} strokeWidth={1.5} className="text-emerald-600" />, 
            label: "Hoàn thành", 
            value: globalStats.completedBookings, 
            config: "bg-emerald-100 border border-emerald-200/60" 
          },
          { 
            icon: <UserX size={26} strokeWidth={1.5} className="text-rose-500" />, 
            label: "Đã hủy", 
            value: globalStats.cancelledBookings, 
            config: "bg-rose-100 border border-rose-200/60" 
          }
        ].map((item, i) => (
          <div key={i} className="bg-white p-7 rounded-2xl border border-slate-300 shadow-sm flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-slate-200/50 group">
            <div className={`w-14 h-14 rounded-2xl ${item.config} flex items-center justify-center transition-transform group-hover:scale-110`}>
              {item.icon}
            </div>
            <div>
              <h4 className="text-[17px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</h4>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 pb-6 border-b border-slate-50">
          <h2 className="text-[20px] font-bold text-slate-800 whitespace-nowrap mr-auto flex items-center gap-3">
            <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
            Danh sách lịch thu âm
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <BookingFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onDateRangeChange={handleDateRangeChange}
              onClear={clearFilters}
              bookingStatuses={bookingStatuses}
              selectedRowKeys={selectedRowKeys}
              onBulkDelete={handleBulkDelete}
              showSearch={true}
            />

            <Button
              onClick={handleCreate}
              className="h-10 px-6 bg-slate-900 border-none font-bold text-[14px] shadow-lg shadow-slate-200 flex items-center gap-2 !text-white hover:!bg-slate-800 rounded-xl transition-all"
            >
              <Plus size={16} strokeWidth={3} />
              Tạo mới
            </Button>
          </div>
        </div>


        <div className="rounded-[28px] border-2 border-slate-200 overflow-hidden bg-white shadow-inner">
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={Array.isArray(bookings) ? bookings : []}
            rowKey="id"
            loading={loading}
            pagination={false}
            onChange={handleTableChange}
            scroll={{ x: 1200 }}
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

          {pagination.total > 0 && (
            <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-widest shadow-sm flex items-center gap-2">
                <span>{Math.min(pagination.total, (pagination.current - 1) * pagination.pageSize + 1)} — {Math.min(pagination.current * pagination.pageSize, pagination.total)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  className="h-12 w-12 flex items-center justify-center rounded-xl bg-white border-slate-100 text-slate-600 shadow-sm"
                  disabled={pagination.current === 1}
                  onClick={() => handleTableChange({ current: pagination.current - 1, pageSize: pagination.pageSize })}
                  icon={<ChevronLeft size={20} />}
                />

                <Button
                  className="h-12 w-12 flex items-center justify-center rounded-xl bg-white border-slate-100 text-slate-600 shadow-sm"
                  disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                  onClick={() => handleTableChange({ current: pagination.current + 1, pageSize: pagination.pageSize })}
                  icon={<ChevronRight size={20} />}
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
        className="delete-confirmation-modal"
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

      {/* Detail Modal */}
      <Modal
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={1000}
        centered
        closable={false}
        className="booking-detail-modal"
      >
        {selectedDetailBooking && (
          <div className="p-4 lg:p-10 space-y-10">
            {/* Header Detail */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-100 pb-10">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-2xl shadow-slate-200">
                  <Calendar size={36} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${bookingStatuses.find(s => s.value === selectedDetailBooking.status)?.classes}`}>
                      {bookingStatuses.find(s => s.value === selectedDetailBooking.status)?.label}
                    </span>
                    {selectedDetailBooking.needConsultation && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-amber-100 flex items-center gap-1">
                        <Phone size={10} /> Cần tư vấn
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{selectedDetailBooking.customerName}</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                    <CalendarClock size={14} className="text-blue-500" />
                    Khởi tạo: {dayjs(selectedDetailBooking.createdDate).format("DD/MM/YYYY HH:mm")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEdit(selectedDetailBooking);
                  }}
                  className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-200"
                >
                  Chỉnh sửa
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="h-14 px-8 rounded-2xl bg-slate-900 border-none font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200"
                >
                  Đóng cửa sổ
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Information Groups */}
              <div className="space-y-10">
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <FileText size={18} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Chi tiết đặt lịch</h4>
                  </div>

                  <div className="bg-slate-50 rounded-[24px] border border-slate-100 p-8 space-y-5">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Ngày thu hình</p>
                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <CalendarDays size={16} className="text-blue-500" />
                          {dayjs(selectedDetailBooking.recordDate).format("DD/MM/YYYY")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Dịch vụ</p>
                        <div className="flex flex-wrap gap-1">
                          {Array.isArray(selectedDetailBooking.services)
                            ? selectedDetailBooking.services.map((s, i) => (
                              <Tag key={i} className="!m-0 bg-white border-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px]">{s.name || s}</Tag>
                            ))
                            : <Tag className="!m-0 bg-white border-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded text-[10px]">{selectedDetailBooking.services?.name || selectedDetailBooking.services}</Tag>
                          }
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 border-t border-slate-200/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                        <Home size={12} /> Studio assigned
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {typeof selectedDetailBooking.studioRoom === "object" ? selectedDetailBooking.studioRoom?.studioName : selectedDetailBooking.studioRoom}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-slate-200/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <FileText size={12} /> Ghi chú nội bộ
                      </p>
                      <div className="p-4 bg-white rounded-2xl border border-slate-100 text-sm font-medium text-slate-500 italic leading-relaxed">
                        {selectedDetailBooking.note || "Không có ghi chú đặc biệt cho đơn hàng này."}
                      </div>
                    </div>
                  </div>
                </section>


              </div>

              <div className="space-y-10">
                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-green-50 text-green-600 flex items-center justify-center">
                      <Phone size={18} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hồ sơ khách hàng</h4>
                  </div>
                  <div className="bg-slate-50 rounded-none p-10 space-y-8 relative overflow-hidden border border-slate-100">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Họ và tên</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tight">{selectedDetailBooking.customerName}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-none bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-500">
                          <Phone size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Hotline</p>
                          <p className="font-black text-slate-700 tracking-wider text-base">{selectedDetailBooking.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-none bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-500">
                          <Mail size={20} />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Thư điện tử</p>
                          <p className="font-bold text-slate-700 truncate text-sm">{selectedDetailBooking.email || "N/A"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại khách hàng</span>
                      <div className="px-5 py-2 bg-slate-900 rounded-none">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                          <User size={12} className="text-blue-400" />
                          {selectedDetailBooking.userBooking || selectedDetailBooking.user ? "Standard Membership" : "Guest Account"}
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-0 right-0 p-8">
                      <CheckCircle2 size={80} className="text-slate-100" />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingManagement;
