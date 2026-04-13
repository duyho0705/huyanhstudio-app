import { useState, useEffect, useMemo } from "react";
import {
  message,
  Table,
  Button,
  Modal,
  Tag,
  Select,
  Input,
  Row,
  Col,
  Statistic,
  Dropdown,
  Descriptions,
} from "antd";
import userApi from "../../../api/userApi";
import {
  Users,
  CheckCircle,
  XCircle,
  Shield,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Settings,
  Search,
  User,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserX
} from "lucide-react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import dayjs from "dayjs";
import UserForm from "./components/UserForm";

const { Option } = Select;

const UserManagement = () => {
  const [messageApi, messageContext] = message.useMessage();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    role: null,
    status: null,
  });

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admin: 0,
    staff: 0,
    customer: 0,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDetailUser, setSelectedDetailUser] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const roles = [
    { value: "ROLE_ADMIN", label: "Quản trị viên", color: "red", classes: "bg-red-50 text-red-600 border-red-100" },
    { value: "ROLE_STAFF", label: "Nhân viên", color: "blue", classes: "bg-blue-50 text-blue-600 border-blue-100" },
    { value: "ROLE_USER", label: "Khách hàng", color: "slate", classes: "bg-slate-50 text-slate-600 border-slate-100" },
  ];

  const statusOptions = [
    { value: true, label: "Đang hoạt động", color: "green", classes: "bg-green-50 text-green-600 shadow-green-100" },
    { value: false, label: "Đã bị khóa", color: "red", classes: "bg-red-50 text-red-600 shadow-red-100" },
  ];

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [totalRes, activeRes, inactiveRes, adminRes, staffRes] =
        await Promise.all([
          userApi.admin.getAll({ page: 0, size: 1 }),
          userApi.admin.getAll({ page: 0, size: 1, active: true }),
          userApi.admin.getAll({ page: 0, size: 1, active: false }),
          userApi.admin.getAll({ page: 0, size: 1, role: "ROLE_ADMIN" }),
          userApi.admin.getAll({ page: 0, size: 1, role: "ROLE_STAFF" }),
        ]);

      const getTotal = (res) =>
        res.data?.data?.totalElements || res.data?.totalElements || 0;

      setStats({
        total: getTotal(totalRes),
        active: getTotal(activeRes),
        inactive: getTotal(inactiveRes),
        admin: getTotal(adminRes),
        staff: getTotal(staffRes),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
        role: filters.role,
        active: filters.status,
        search: filters.search?.trim(),
      };

      const response = await userApi.admin.getAll(params);
      const data = response.data?.data || response.data || response;
      const userList = data.list || data.content || [];

      setUsers(userList);
      setPagination((prev) => ({
        ...prev,
        current: data.page !== undefined ? data.page + 1 : prev.current,
        pageSize: data.pageSize,
        total: data.totalElements,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
      messageApi.error("Không thể tải danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, current: 1 });
  };

  const clearFilters = () => {
    setFilters({ search: "", role: null, status: null });
    setPagination({ ...pagination, current: 1 });
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedUser({
      ...record,
      customerName: record.customerName,
      role: record.roles?.[0] || null,
    });
    setIsFormModalOpen(true);
  };

  const handleViewDetails = (record) => {
    setSelectedDetailUser(record);
    setIsDetailModalOpen(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      const payload = {
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        roles: values.role ? [values.role] : [],
        active: values.active ? 1 : 0,
      };

      if (!selectedUser && values.username) {
        payload.username = values.username;
      }

      if (!selectedUser && values.password) {
        payload.password = values.password;
      }

      if (selectedUser) {
        await userApi.admin.update(selectedUser.id, payload);
        setIsFormModalOpen(false);
        showNotification("success", "Cập nhật người dùng thành công!");
      } else {
        await userApi.admin.create(payload);
        setIsFormModalOpen(false);
        showNotification("success", "Tạo người dùng thành công!");
      }
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      messageApi.error(
        "Không thể lưu người dùng! " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  const showNotification = (type, msg) => {
    setNotification({ show: true, type, message: msg });
    setTimeout(() => {
      setNotification({ show: false, type: "success", message: "" });
    }, 3000);
  };

  const getRoleLabel = (role) => {
    const roleObj = roles.find((r) => r.value === role);
    return roleObj ? roleObj.label : role;
  };

  const columns = useMemo(
    () => [
      {
        title: <span className="text-[13px] font-semibold text-slate-600">Khách hàng</span>,
        dataIndex: "customerName",
        key: "customerName",
        width: 200,
        render: (name) => (
          <span className="text-slate-900 font-semibold text-[14px] leading-none mb-1">{name}</span>
        ),
      },
      {
        title: <span className="text-[13px] font-semibold text-slate-600">Email</span>,
        dataIndex: "email",
        key: "email",
        width: 220,
        render: (email) => (
          <span className="text-slate-600 text-[14px] font-semibold">{email || "---"}</span>
        )
      },
      {
        title: <span className="text-[13px] font-semibold text-slate-600">Số điện thoại</span>,
        dataIndex: "phone",
        key: "phone",
        width: 150,
        render: (phone) => (
          <span className="text-slate-600 text-[14px] font-semibold tracking-widest">{phone || "---"}</span>
        )
      },
      {
        title: <span className="text-[13px] font-semibold text-slate-600">Thẩm quyền</span>,
        dataIndex: "roles",
        key: "roles",
        width: 150,
        render: (userRoles) => (
          <div className="flex gap-2">
            {Array.isArray(userRoles) ? userRoles.map(role => (
              <span key={role} className="text-slate-600 text-[14px] font-semibold">{getRoleLabel(role)}</span>
            )) : <span className="text-slate-600 text-[14px] font-semibold">{userRoles}</span>}
          </div>
        ),
      },
      {
        title: <span className="text-[13px] font-semibold text-slate-600">Trạng thái</span>,
        dataIndex: "active",
        key: "active",
        width: 140,
        render: (active) => (
          <span className={`text-[14px] font-semibold ${active ? "text-green-600" : "text-red-500"}`}>
            {active ? "Hoạt động" : "Bị khóa"}
          </span>
        ),
      },
      {
        title: <span className="text-[13px] font-semibold text-slate-600">Ngày tạo</span>,
        dataIndex: "createdAt",
        key: "createdAt",
        width: 140,
        render: (date) => (
          <span className="text-slate-600 text-[14px] font-semibold">
            {date ? dayjs(date).format("DD/MM/YYYY") : "---"}
          </span>
        )
      },
      {
        title: <span className="text-[13px] font-semibold text-slate-600">Thao tác</span>,
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
              onClick={() => messageApi.warning("Tính năng xóa tài khoản đang bảo trì")}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-all p-0"
              title="Xóa tài khoản"
            >
              <Trash2 size={18} strokeWidth={2.5} />
            </Button>
          </div>
        ),
      },
    ],
    [pagination, roles]
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {messageContext}

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Users size={24} className="text-blue-600" />, label: "Tổng tài khoản", value: pagination.total, config: "bg-blue-50" },
          { icon: <CheckCircle size={24} className="text-green-600" />, label: "Đang hoạt động", value: stats.active, config: "bg-green-50" },
          { icon: <XCircle size={24} className="text-red-500" />, label: "Số tài khoản khóa", value: stats.inactive, config: "bg-red-50" },
          { icon: <ShieldAlert size={24} className="text-orange-500" />, label: "Quản trị viên", value: `${stats.admin}`, config: "bg-orange-50" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-slate-200/50 group">
            <div className={`w-14 h-14 rounded-2xl ${item.config} flex items-center justify-center transition-transform group-hover:scale-110`}>
              {item.icon}
            </div>
            <div>
              <h4 className="text-[17px] font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</h4>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-50">
          <div>
            <h2 className="text-[18px] font-semibold text-slate-900">Danh sách người dùng</h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Tìm kiếm danh tính, SĐT..."
                className="h-10 pl-10 pr-4 bg-slate-50 border-none rounded-xl text-[14px] focus:bg-white focus:ring-2 focus:ring-slate-100 transition-all"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                allowClear
              />
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <Button
              type="primary"
              onClick={handleCreate}
              className="h-10 px-4 bg-slate-900 hover:bg-slate-800 rounded-xl border-none font-semibold text-[14px] shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus size={16} strokeWidth={2.5} />
              Thêm thành viên
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            placeholder="Vai trò hệ thống"
            value={filters.role}
            onChange={(val) => handleFilterChange("role", val)}
            className="w-[180px] h-10 select-custom-xl rounded-xl"
            allowClear
            variant="filled"
          >
            {roles.map((role) => (
              <Option key={role.value} value={role.value}>
                <span className="font-semibold text-[14px] text-slate-700">{role.label}</span>
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Trạng thái"
            value={filters.status}
            onChange={(val) => handleFilterChange("status", val)}
            className="w-[180px] h-10 select-custom-xl rounded-xl"
            allowClear
            variant="filled"
          >
            {statusOptions.map((status) => (
              <Option key={status.value.toString()} value={status.value}>
                <span className="font-semibold text-[14px] text-slate-700">{status.label}</span>
              </Option>
            ))}
          </Select>

          {(filters.role !== null || filters.status !== null || filters.search) && (
            <button
              onClick={clearFilters}
              className="h-12 px-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black uppercase tracking-widest text-[10px] bg-white border border-slate-100 rounded-xl transition-all active:scale-95"
            >
              <RotateCcw size={14} />
              Làm mới bộ lọc
            </button>
          )}
        </div>

        <div className="rounded-[2.5rem] border border-slate-100 overflow-hidden bg-white shadow-inner">
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            pagination={false}
            onChange={handleTableChange}
            scroll={{ x: 1000 }}
            className="ant-table-custom"
            locale={{
              emptyText: (
                <div className="py-24 flex flex-col items-center opacity-30">
                  <Users size={64} strokeWidth={1} className="mb-4" />
                  <span className="text-sm font-black uppercase tracking-[0.2em]">Không có thành viên được tìm thấy</span>
                </div>
              )
            }}
          />

          {pagination.total > 0 && (
            <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-600 uppercase tracking-widest shadow-sm flex items-center gap-2">
                <span>{Math.min(pagination.total, (pagination.current - 1) * pagination.pageSize + 1)} — {Math.min(pagination.current * pagination.pageSize, pagination.total)}</span>
                <span className="text-slate-200">/</span>
                <span className="text-slate-500">{pagination.total} Hồ sơ</span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
                  disabled={pagination.current === 1}
                  onClick={() => handleTableChange({ current: pagination.current - 1, pageSize: pagination.pageSize })}
                  icon={<ChevronLeft size={20} />}
                />

                <Button
                  className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
                  disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                  onClick={() => handleTableChange({ current: pagination.current + 1, pageSize: pagination.pageSize })}
                  icon={<ChevronRight size={20} />}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {notification.show && (
        <div className="fixed bottom-10 right-10 z-[2000] px-8 py-5 bg-white rounded-3xl shadow-2xl border border-slate-100 flex items-center gap-5 animate-in slide-in-from-right duration-500">
          <div className={`p-3 rounded-2xl ${notification.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
            {notification.type === "success" ? <CheckCircle size={24} /> : <XCircle size={24} />}
          </div>
          <div>
            <h5 className="font-black text-slate-900 tracking-tight uppercase text-xs mb-0.5">{notification.type === "success" ? "HOÀN TẤT THAO TÁC" : "PHÁT HIỆN LỖI"}</h5>
            <p className="text-xs text-slate-500 font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      <UserForm
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedUser}
        roles={roles}
      />

      <Modal
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={null}
        width={900}
        centered
        closable={false}
        className="user-detail-modal-redesign"
      >
        {selectedDetailUser && (
          <div className="p-4 lg:p-12 space-y-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-slate-100 pb-12">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-900 border border-slate-700 flex items-center justify-center text-white shadow-2xl shadow-slate-300">
                  <User size={44} strokeWidth={1} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {selectedDetailUser.roles?.map(role => (
                      <Tag key={role} className={`!m-0 border px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] ${roles.find(r => r.value === role)?.classes}`}>
                        {getRoleLabel(role)}
                      </Tag>
                    ))}
                    <div className={`w-3 h-3 rounded-full ${selectedDetailUser.active ? "bg-green-500 shadow-xl shadow-green-200" : "bg-red-500 shadow-xl shadow-red-200"}`}></div>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase leading-none">{selectedDetailUser.customerName}</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] mt-3 flex items-center gap-2">
                    <Calendar size={14} className="text-blue-500" />
                    Thành viên từ: {dayjs(selectedDetailUser.createdAt).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleEdit(selectedDetailUser);
                  }}
                  className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-200"
                >
                  Cập nhật
                </Button>
                <Button
                  type="primary"
                  onClick={() => setIsDetailModalOpen(false)}
                  className="h-16 px-10 rounded-2xl bg-slate-900 border-none font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-300"
                >
                  Hoàn tất
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Users size={18} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Hành trình hệ thống</h4>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2.5"></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Trạng thái xác thực</p>
                      <p className="text-sm font-bold text-slate-700">
                        {selectedDetailUser.active ? "Tài khoản đã được xác thực & Cho phép truy cập" : "Tài khoản đang bị treo / Cấm truy cập hệ thống"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2.5"></div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Chất lượng người dùng</p>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(s => <div key={s} className="w-8 h-1.5 bg-blue-100 rounded-full"></div>)}
                        <span className="text-[10px] font-black text-blue-600 ml-2">PREMIUM USER</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Mail size={18} />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Kênh liên lạc</h4>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-8 relative overflow-hidden">
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-500">
                      <Mail size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Thư điện tử</p>
                      <p className="font-bold text-slate-700 truncate text-sm">{selectedDetailUser.email || "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-blue-500">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Hotline liên hệ</p>
                      <p className="font-black text-slate-700 tracking-wider text-base">{selectedDetailUser.phone}</p>
                    </div>
                  </div>

                  <div className="absolute -bottom-6 -right-6 text-slate-100 opacity-30 transform rotate-12">
                    <Mail size={120} strokeWidth={1} />
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
