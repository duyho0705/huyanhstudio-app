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
  Tooltip,
} from "antd";
import statsApi from "../../../api/statsApi";
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

  // For debouncing search
  const [searchTerm, setSearchTerm] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admin: 0,
    customer: 0,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDetailUser, setSelectedDetailUser] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const roles = [
    { value: "ROLE_ADMIN", label: "Quản trị viên", color: "red", classes: "bg-red-50 text-red-600 border-red-100" },
    { value: "ROLE_USER", label: "Khách hàng", color: "slate", classes: "bg-slate-50 text-slate-600 border-slate-100" },
  ];

  const statusOptions = [
    { value: true, label: "Đang hoạt động", color: "green", classes: "bg-green-50 text-green-600 shadow-green-100" },
    { value: false, label: "Đã bị khóa", color: "red", classes: "bg-red-50 text-red-600 shadow-red-100" },
  ];

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize, filters.role, filters.status, filters.search]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await statsApi.getSummary();
      const data = response.data?.data || response.data;

      setStats({
        total: data.totalUsers || 0,
        active: data.activeUsers || 0,
        inactive: data.inactiveUsers || 0,
        admin: data.adminUsers || 0,
        staff: data.staffUsers || 0,
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

  const handleDelete = (record) => {
    setDeletingUser(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await userApi.admin.delete(deletingUser.id);
      messageApi.success("Tài khoản đã được xóa vĩnh viễn!");
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      messageApi.error("Không thể xóa tài khoản này!");
    }
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
        title: <span className="text-[15px] font-medium text-slate-600">Khách hàng</span>,
        dataIndex: "customerName",
        key: "customerName",
        width: 200,
        render: (name) => (
          <span className="text-slate-900 font-semibold text-[14px] leading-none mb-1">{name}</span>
        ),
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Email</span>,
        dataIndex: "email",
        key: "email",
        width: 220,
        render: (email) => (
          <span className="text-slate-600 text-[14px] font-semibold">{email || "---"}</span>
        )
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Số điện thoại</span>,
        dataIndex: "phone",
        key: "phone",
        width: 150,
        render: (phone) => (
          <span className="text-slate-600 text-[14px] font-medium">{phone || "---"}</span>
        )
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Vai trò</span>,
        dataIndex: "roles",
        key: "roles",
        width: 150,
        render: (userRoles) => {
          const roleArray = Array.isArray(userRoles) ? userRoles : [userRoles];

          if (!roleArray || roleArray.length === 0) {
            return <span className="text-slate-600 text-[14px] font-semibold">---</span>;
          }

          if (roleArray.length === 1) {
            return <span className="text-slate-600 text-[14px] font-semibold">{getRoleLabel(roleArray[0])}</span>;
          }

          return (
            <Tooltip
              title={
                <div className="flex flex-col gap-1.5 p-1">
                  {roleArray.map((role) => (
                    <div key={role} className="flex items-center">
                      <span className="text-white text-[13px] font-medium">{getRoleLabel(role)}</span>
                    </div>
                  ))}
                </div>
              }
              color="#0f172a"
              placement="top"
            >
              <span className="text-slate-600 text-[14px] font-semibold cursor-pointer border-b border-dashed border-slate-400 pb-0.5 hover:text-blue-600 hover:border-blue-600 transition-colors">
                Nhiều vai trò
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Trạng thái</span>,
        dataIndex: "active",
        key: "active",
        width: 140,
        render: (active) => (
          <span className={`px-2.5 py-1 rounded-full text-[13px] font-semibold text-white inline-block ${active ? "bg-green-500 shadow-sm shadow-green-200" : "bg-red-500 shadow-sm shadow-red-200"
            }`}>
            {active ? "Hoạt động" : "Bị khóa"}
          </span>
        ),
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">Ngày tạo</span>,
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
        title: <span className="text-[15px] font-medium text-slate-600">Thao tác</span>,
        key: "actions",
        width: 140,
        fixed: "right",
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-2">
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
              onClick={() => handleDelete(record)}
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
    <div className="space-y-6 animate-in fade-in duration-700">
      {messageContext}

      {/* 1. Stats Section - Multi-column responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[
          { icon: <Users className="w-5 h-5 sm:w-7 sm:h-7" />, label: "Tổng", value: pagination.total, config: "text-indigo-600 bg-indigo-50" },
          { icon: <UserCheck className="w-5 h-5 sm:w-7 sm:h-7" />, label: "Hoạt động", value: stats.active, config: "text-emerald-600 bg-emerald-50" },
          { icon: <UserX className="w-5 h-5 sm:w-7 sm:h-7" />, label: "Đã khóa", value: stats.inactive, config: "text-rose-600 bg-rose-50" },
          { icon: <ShieldCheck className="w-5 h-5 sm:w-7 sm:h-7" />, label: "Quản trị viên", value: stats.admin, config: "text-amber-600 bg-amber-50" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-[32px] border border-slate-200 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden flex flex-col justify-between min-h-[90px] sm:min-h-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 relative z-10 w-full">
              <div className="flex justify-between items-center w-full sm:w-auto">
                 <div className={`w-8 h-8 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${item.config} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                  {item.icon}
                 </div>
                 <h3 className="text-xl sm:hidden font-black text-slate-900 m-0 leading-none">{item.value}</h3>
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base font-semibold text-slate-500 sm:text-slate-600 mb-0.5 mt-0">{item.label}</p>
                <h3 className="hidden sm:block text-2xl font-black text-slate-900 m-0 leading-none">{item.value}</h3>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 sm:-right-6 sm:-bottom-6 opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-700 group-hover:-rotate-12 scale-150">
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* 2. Main Data Section */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-50">
          <h2 className="text-[17px] sm:text-[20px] font-bold text-slate-800 whitespace-nowrap flex items-center gap-3">
            <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
            Danh sách người dùng
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-80 relative">
              <Input
                placeholder="Truy vấn tài khoản..."
                prefix={<Search size={18} className="text-slate-400" />}
                className="h-10 border-slate-200 rounded-xl text-[14px] font-medium text-slate-900 shadow-sm hover:border-indigo-400 focus:border-indigo-500 placeholder:font-medium placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <Select
                placeholder={
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-slate-400" />
                    <span className="font-bold text-slate-500">Vai trò</span>
                  </div>
                }
                value={filters.role}
                onChange={(val) => handleFilterChange("role", val)}
                className="h-10 flex-1 sm:flex-none sm:min-w-[150px] custom-select-premium"
                allowClear
                dropdownStyle={{
                  borderRadius: '20px',
                  padding: '8px',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                  border: '1px solid #f1f5f9'
                }}
              >
                {roles.map(r => (
                  <Option key={r.value} value={r.value}>
                    <div className="flex items-center gap-2.5 py-1">
                      <div className={`w-2 h-2 rounded-full ${r.value === 'ROLE_ADMIN' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                      <span className="font-bold text-slate-700 text-[13px]">{r.label}</span>
                    </div>
                  </Option>
                ))}
              </Select>

              <Select
                placeholder={
                  <div className="flex items-center gap-2">
                    <Settings size={14} className="text-slate-400" />
                    <span className="font-bold text-slate-500">Trạng thái</span>
                  </div>
                }
                value={filters.status}
                onChange={(val) => handleFilterChange("status", val)}
                className="h-10 flex-1 sm:flex-none sm:min-w-[150px] custom-select-premium"
                allowClear
                dropdownStyle={{
                  borderRadius: '20px',
                  padding: '8px',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                  border: '1px solid #f1f5f9'
                }}
              >
                {statusOptions.map(s => (
                  <Option key={s.value.toString()} value={s.value}>
                    <div className="flex items-center gap-2.5 py-1">
                      <div className={`w-2 h-2 rounded-full ${s.value ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}></div>
                      <span className="font-bold text-slate-700 text-[13px]">{s.label}</span>
                    </div>
                  </Option>
                ))}
              </Select>

              <Button
                onClick={handleCreate}
                className="h-10 px-6 bg-slate-900 border-none rounded-xl font-bold text-[14px] text-white shadow-lg shadow-slate-200 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Plus size={18} strokeWidth={3} />
                Thêm mới
              </Button>

              {(filters.role !== null || filters.status !== null || filters.search) && (
                <Button
                  onClick={clearFilters}
                  className="h-10 px-4 flex items-center gap-2 text-slate-600 font-semibold text-[14px] bg-white border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-600 transition-all"
                  icon={<RotateCcw size={16} />}
                >
                  <span className="hidden sm:inline">Làm mới</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Data Area */}
        <div className="rounded-[28px] border-2 border-slate-200 overflow-hidden bg-white shadow-inner">
          {loading ? (
            /* Skeleton Loading State */
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-20 bg-slate-50 rounded-[20px] animate-pulse border border-slate-100 flex items-center px-6 gap-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-1/3 h-4 bg-slate-200 rounded"></div>
                    <div className="w-1/4 h-3 bg-slate-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-hidden">
                <Table
                  columns={columns}
                  dataSource={users}
                  rowKey="id"
                  loading={false}
                  pagination={false}
                  onChange={handleTableChange}
                  scroll={{ x: 1000 }}
                  size={window.innerWidth < 1024 ? "small" : "default"}
                  className="ant-table-premium"
                  locale={{ emptyText: <div className="py-20 text-slate-300 font-bold uppercase tracking-widest italic">Dữ liệu trống</div> }}
                />
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6 lg:p-8">
                {users?.length > 0 ? users.map((u) => (
                  <div key={u.id} className="bg-white p-5 rounded-[28px] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                        <User size={22} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[15px] font-black text-slate-900 m-0 uppercase truncate tracking-tight">{u.customerName}</h4>
                        <p className="text-[12px] font-bold text-slate-400 m-0 flex items-center gap-1.5 mt-0.5 italic">
                          <Phone size={12} className="text-indigo-400" /> {u.phone}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${u.active ? "bg-green-500 shadow-xl shadow-green-100 animate-pulse" : "bg-red-500 shadow-xl shadow-red-100"}`}></div>
                    </div>
                    <div className="flex flex-wrap gap-2 py-3 border-y border-slate-50">
                      {Array.isArray(u.roles) ? u.roles.map(r => (
                        <span key={r} className="px-3 py-1 bg-indigo-50/50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{getRoleLabel(r)}</span>
                      )) : (
                        <span className="px-3 py-1 bg-indigo-50/50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{getRoleLabel(u.roles)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tighter">Ngày tạo: {u.createdAt ? dayjs(u.createdAt).format("DD/MM/YYYY") : "---"}</span>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleEdit(u)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-amber-50 text-amber-500 border-none p-0 hover:bg-amber-100 hover:text-amber-600"><Edit size={18} strokeWidth={2.5} /></Button>
                        <Button onClick={() => handleDelete(u)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 border-none p-0 hover:bg-red-100 hover:text-red-600"><Trash2 size={18} strokeWidth={2.5} /></Button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-16 text-center text-slate-300 font-bold italic uppercase tracking-widest bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">Không có dữ liệu</div>
                )}
              </div>
            </>
          )}

          {/* Footer: Modern Pagination */}
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
                  disabled={pagination.current >= Math.ceil(pagination.total / (pagination.pageSize || 10))}
                  onClick={() => handleTableChange({ current: pagination.current + 1, pageSize: pagination.pageSize })}
                  icon={<ChevronRight size={16} />}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {notification.show && (
        <div className="fixed bottom-10 right-10 z-[2000] px-8 py-5 bg-white rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-5 animate-in slide-in-from-right duration-500">
          <div className={`p-4 rounded-2xl shadow-lg ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {notification.type === "success" ? <CheckCircle size={24} strokeWidth={2.5} /> : <XCircle size={24} strokeWidth={2.5} />}
          </div>
          <div className="pr-4">
            <h5 className="font-black text-slate-900 tracking-wider uppercase text-xs mb-1">{notification.type === "success" ? "Thành công" : "Có lỗi xảy ra"}</h5>
            <p className="text-xs text-slate-500 font-bold mb-0">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Modals are now properly placed as siblings inside the main container */}
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
        className="user-detail-modal-redesign !max-w-[95vw]"
        styles={{ content: { padding: 0, borderRadius: '32px', overflow: 'hidden' } }}
      >
        {selectedDetailUser && (
          <div className="flex flex-col bg-white overflow-hidden">
            <div className="bg-slate-900 p-10 text-white relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="w-24 h-24 rounded-[32px] bg-white text-slate-900 flex items-center justify-center shadow-2xl">
                  <User size={48} strokeWidth={1} />
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                    {selectedDetailUser.roles?.map(r => (
                      <span key={r} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest">{getRoleLabel(r)}</span>
                    ))}
                    <div className={`w-3 h-3 rounded-full ${selectedDetailUser.active ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></div>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter m-0">{selectedDetailUser.customerName}</h2>
                </div>
              </div>
            </div>
            <div className="p-5 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
              <div className="space-y-8">
                <div className="space-y-1">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest uppercase">Thông tin liên lạc</p>
                  <div className="flex items-center gap-3 text-[16px] font-bold text-slate-900"><Phone size={18} className="text-indigo-500" /> {selectedDetailUser.phone}</div>
                  <div className="flex items-center gap-3 text-[16px] font-bold text-slate-900"><Mail size={18} className="text-indigo-500" /> {selectedDetailUser.email || "---"}</div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 sm:p-6 rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày gia nhập</p>
                  <p className="text-[18px] font-black text-slate-900 m-0 uppercase leading-none">{dayjs(selectedDetailUser.createdAt).format("DD/MM/YYYY")}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedDetailUser); }} className="h-12 px-6 rounded-xl bg-indigo-600 text-white border-none font-bold text-[13px] uppercase tracking-widest flex-1 sm:flex-none">Cập nhật</Button>
                  <Button onClick={() => setIsDetailModalOpen(false)} className="h-12 px-6 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-[13px] uppercase tracking-widest shadow-sm flex-1 sm:flex-none">Đóng</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={confirmDelete}
        title={null}
        footer={null}
        centered
        width={440}
        styles={{ content: { borderRadius: '28px', padding: '32px' } }}
      >
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center mx-auto shadow-inner">
            <Trash2 size={36} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight m-0">Xóa vĩnh viễn?</h3>
            <p className="text-slate-500 text-[14px] font-medium mt-2">Hành động này sẽ xóa hoàn toàn tài khoản <br /><span className="text-red-600 font-black uppercase text-[15px]">{deletingUser?.customerName}</span> khỏi hệ thống.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button onClick={() => setIsDeleteModalOpen(false)} className="h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] border-slate-200 text-slate-600">Hủy bỏ</Button>
            <Button onClick={confirmDelete} danger type="primary" className="h-14 rounded-2xl bg-red-600 border-none font-black uppercase tracking-widest text-[11px] shadow-lg shadow-red-200">Xác nhận xóa</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
