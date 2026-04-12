import { useState, useEffect, useMemo, useCallback } from "react";
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
  Filter,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import dayjs from "dayjs";

import bookingApi from "../../../api/bookingApi";
import userApi from "../../../api/userApi";
import serviceApi from "../../../api/serviceApi";

import BookingForm from "./components/BookingForm";
import BookingFilters from "./components/BookingFilters";
import { useBookingManagement } from "./hooks/useBookingManagement";

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

  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);

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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [servicesRes, staffRes] = await Promise.all([
          serviceApi.admin.getAll({ page: 0, size: 100 }),
          userApi.admin.getStaff().catch(() => ({ data: [] })),
        ]);

        const getList = (res) => {
          if (Array.isArray(res)) return res;
          if (res?.data?.list && Array.isArray(res.data.list))
            return res.data.list;
          if (res?.data && Array.isArray(res.data)) return res.data;
          if (res?.content && Array.isArray(res.content)) return res.content;
          return [];
        };

        const uniqueStaff = getList(staffRes).filter(
          (v, i, a) => a.findIndex((t) => t.id === v.id) === i
        );

        setServices(getList(servicesRes));
        setStaffList(uniqueStaff);
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

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

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
          message: `Tạo đặt lịch thành công ${bookingCode} ${
            customerName ? " - " + customerName : ""
          }`,
          type: "success",
        });
      }
      fetchBookings(); 
    } catch (error) {
      messageApi.error(
        `${isUpdate ? "Cập nhật" : "Tạo"} thất bại: ${error.message}`
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
        title: "Mã đơn",
        dataIndex: "bookingCode",
        key: "shortCode",
        width: 120,
        render: (code, record) => (
          <div className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-black uppercase tracking-wider border border-slate-200 inline-block shadow-sm">
            {code || record.bookingCode?.slice(0, 8)}
          </div>
        ),
      },
      {
        title: "Khách hàng",
        dataIndex: "customerName",
        key: "customerName",
        width: 200,
        render: (name, record) => (
            <div className="flex flex-col">
                <span className="text-slate-900 font-black text-sm uppercase tracking-tight leading-none mb-1">{name}</span>
                <span className="text-slate-400 text-[10px] font-bold tracking-widest flex items-center gap-1">
                    <Phone size={10} /> {record.phone}
                </span>
            </div>
        )
      },
      {
        title: "Ngày thu",
        dataIndex: "recordDate",
        key: "recordDate",
        width: 140,
        render: (date) => (
            <div className="flex items-center gap-2 text-slate-600 font-bold text-xs uppercase tracking-widest bg-slate-50 px-3 py-2 rounded-xl">
                <CalendarDays size={14} className="text-blue-500" />
                {dayjs(date).format("DD/MM/YYYY")}
            </div>
        ),
      },
      {
        title: "Dịch vụ yêu cầu",
        dataIndex: "services",
        key: "services",
        width: 240,
        render: (svcs) => {
          if (!svcs) return <span className="text-slate-300 italic text-xs">N/A</span>;
          const getServiceName = (s) => (s && typeof s === "object" && s.name) ? s.name : (services.find(svc => svc.id === s)?.name || s);
          
          const names = Array.isArray(svcs) ? svcs.map(getServiceName) : [getServiceName(svcs)];
          return (
              <div className="flex flex-wrap gap-1">
                {names.map((n, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-black uppercase tracking-wider border border-blue-100">
                        {n}
                    </span>
                ))}
              </div>
          );
        },
      },
      {
        title: "Tiến độ",
        dataIndex: "status",
        key: "status",
        width: 180,
        render: (status, record) => {
          const statusConfig = bookingStatuses.find(s => s.value === status);
          return (
            <Select
              value={status}
              onChange={(val) => updateBookingStatus(record.id, val)}
              className="w-full select-custom-sm"
              variant="borderless"
              dropdownStyle={{ borderRadius: '12px', padding: '4px', border: '1px solid #f1f5f9' }}
            >
              {bookingStatuses.map((s) => (
                <Option key={s.value} value={s.value}>
                  <div className={`px-2 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${s.classes}`}>
                    {s.label}
                  </div>
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: "Phụ trách",
        dataIndex: ["assignedStaff", "fullName"],
        key: "staff",
        width: 180,
        render: (_, record) => {
          let staffId = record.assignedStaff?.id;
          if (!staffId && record.staff && typeof record.staff === "string") {
            staffId = staffList.find((s) => s.fullName === record.staff)?.id;
          }

          return (
            <Select
              placeholder="Chọn nhân viên"
              value={staffId}
              onChange={(val) => assignStaff(record.id, val, staffList)}
              className="w-full select-custom-sm font-bold text-xs"
              variant="borderless"
              showSearch
              filterOption={(input, option) => (option?.children ?? "").toLowerCase().includes(input.toLowerCase())}
            >
              {staffList.map((staff) => (
                <Option key={staff.id} value={staff.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500">
                        <User size={12} />
                    </div>
                    {staff.fullName}
                  </div>
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 80,
        fixed: "right",
        align: "center",
        render: (_, record) => (
            <Dropdown
              menu={{ 
                items: [
                    { key: "view", label: "Xem chi tiết", icon: <Search size={14} /> },
                    { key: "edit", label: "Chỉnh sửa", icon: <Edit size={14} /> },
                    { type: "divider" },
                    { key: "delete", label: "Gỡ bỏ", icon: <Trash2 size={14} />, danger: true },
                ], 
                onClick: (e) => {
                    if (e.key === "view") handleViewDetails(record);
                    if (e.key === "edit") handleEdit(record);
                    if (e.key === "delete") openDeleteModal(record);
                }
              }}
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button type="text" className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-50">
                <MoreHorizontal size={20} />
              </Button>
            </Dropdown>
        ),
      },
    ],
    [services, staffList, updateBookingStatus, assignStaff, handleEdit, openDeleteModal]
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {messageContext}

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <CalendarDays className="text-blue-600" />, label: "Tổng đơn hàng", value: pagination.total, color: "blue" },
          { icon: <Clock className="text-orange-600" />, label: "Chờ xác nhận", value: bookings.filter((b) => b.status === "PENDING").length, color: "orange" },
          { icon: <CheckCircle className="text-green-600" />, label: "Hoàn thành", value: bookings.filter((b) => b.status === "COMPLETED").length, color: "green" },
          { icon: <XCircle className="text-red-600" />, label: "Đã hủy", value: bookings.filter((b) => b.status === "CANCELLED").length, color: "red" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-slate-200/50 group">
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center transition-transform group-hover:scale-110`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-50">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-slate-900 rounded-full"></div>
                <div>
                   <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Hệ thống Booking</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mt-0.5">Quản trị lịch trình chuyên nghiệp</p>
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-80">
                    <Input
                        placeholder="Mã đơn, SĐT khách hàng..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange("search", e.target.value)}
                        className="h-14 pl-12 pr-6 bg-slate-50 border-none rounded-2xl font-medium focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all shadow-inner"
                    />
                    <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <Button
                    type="primary"
                    onClick={handleCreate}
                    className="h-14 px-8 bg-slate-900 hover:bg-slate-800 rounded-2xl border-none font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 flex items-center gap-3 transition-all active:scale-95 whitespace-nowrap"
                >
                    <Plus size={20} strokeWidth={3} />
                    Khởi tạo đơn mới
                </Button>
            </div>
        </div>

        <BookingFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onDateRangeChange={handleDateRangeChange}
          onClear={clearFilters}
          bookingStatuses={bookingStatuses}
          selectedRowKeys={selectedRowKeys}
          onBulkDelete={handleBulkDelete}
          showSearch={false}
        />

        <div className="rounded-3xl border border-slate-100 overflow-hidden bg-white shadow-inner">
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={Array.isArray(bookings) ? bookings : []}
              rowKey="id"
              loading={loading}
              pagination={false}
              onChange={handleTableChange}
              scroll={{ x: 1200 }}
              className="ant-table-custom ant-table-booking"
              locale={{ emptyText: (
                <div className="py-20 flex flex-col items-center opacity-30">
                    <Filter size={48} className="mb-4" />
                    <span className="text-sm font-black uppercase tracking-widest">Không có dữ liệu phù hợp</span>
                </div>
              )}}
            />

            {pagination.total > 0 && (
              <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="px-6 py-2.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] shadow-sm">
                    {Math.min(pagination.total, (pagination.current - 1) * pagination.pageSize + 1)} — 
                    {Math.min(pagination.current * pagination.pageSize, pagination.total)} 
                    <span className="mx-2 text-slate-200">/</span>
                    {pagination.total} Hồ sơ đơn hàng
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border-slate-100 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
                        disabled={pagination.current === 1}
                        onClick={() => handleTableChange({ current: pagination.current - 1, pageSize: pagination.pageSize })}
                        icon={<ChevronLeft size={20} />}
                    />
                    <div className="flex items-center bg-white border border-slate-100 rounded-2xl p-1 shadow-sm">
                        <span className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl font-black text-xs">
                            {pagination.current}
                        </span>
                        <div className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Của</div>
                        <span className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-xl font-black text-xs">
                            {Math.ceil(pagination.total / pagination.pageSize) || 1}
                        </span>
                    </div>
                    <Button
                        className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border-slate-100 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
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
        services={services}
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
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã đơn</span>
                        <span className="text-xs font-black text-slate-700">{selectedBooking.bookingCode}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</span>
                        <span className="text-xs font-black text-slate-700">{selectedBooking.customerName}</span>
                    </div>
                </div>
            )}

            <div className="flex gap-3">
                <Button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]">Quay lại</Button>
                <Button onClick={confirmDelete} danger type="primary" className="flex-1 h-12 rounded-xl bg-red-600 border-none font-black uppercase tracking-widest text-[10px]">Xác nhận xóa</Button>
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
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Xóa hàng loạt?</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Bạn đang chuẩn bị xóa <strong>{selectedRowKeys.length}</strong> đơn hàng đã chọn.</p>
            
            <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar mb-8 space-y-2">
                {selectedRowKeys.map((key) => {
                    const booking = bookings.find((b) => b.id === key);
                    return booking ? (
                        <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
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
                <Button onClick={() => setIsBulkDeleteModalOpen(false)} className="flex-1 h-12 rounded-xl font-black uppercase tracking-widest text-[10px]">Hủy bỏ</Button>
                <Button onClick={confirmBulkDelete} danger type="primary" className="flex-1 h-12 rounded-xl bg-red-600 border-none font-black uppercase tracking-widest text-[10px]">Xóa {selectedRowKeys.length} đơn</Button>
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
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100">
                                {selectedDetailBooking.bookingCode}
                            </span>
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] border ${bookingStatuses.find(s => s.value === selectedDetailBooking.status)?.classes}`}>
                                {bookingStatuses.find(s => s.value === selectedDetailBooking.status)?.label}
                            </span>
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
                        
                        <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8 space-y-5">
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
                                <div className="p-4 bg-white rounded-xl border border-slate-100 text-sm font-medium text-slate-500 italic leading-relaxed">
                                    {selectedDetailBooking.note || "Không có ghi chú đặc biệt cho đơn hàng này."}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <User size={18} />
                            </div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Phụ trách đơn hàng</h4>
                        </div>
                        <div className="bg-slate-50 rounded-[2rem] border border-slate-100 p-8">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                                    <User size={32} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nhân viên thực hiện</p>
                                    <h5 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">
                                        {selectedDetailBooking.staff || "Chưa phân công"}
                                    </h5>
                                    <div className="flex items-center gap-2">
                                        <Badge status={selectedDetailBooking.staff ? "success" : "warning"} />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            {selectedDetailBooking.staff ? "Đã xác nhận phụ trách" : "Cần phân công ngay"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                <Phone size={18} />
                            </div>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hồ sơ khách hàng</h4>
                        </div>
                        <div className="bg-slate-50 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden border border-slate-100">
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Họ và tên</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tight">{selectedDetailBooking.customerName}</p>
                             </div>
                             
                             <div className="grid grid-cols-1 gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-500">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Hotline</p>
                                        <p className="font-black text-slate-700 tracking-wider text-base">{selectedDetailBooking.phone}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-500">
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
                                <div className="px-5 py-2 bg-slate-900 rounded-2xl">
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
