import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  UserX,
  AlertTriangle
} from "lucide-react";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import dayjs from "dayjs";
import UserForm from "./components/UserForm";
import { removeVietnameseTones } from "../../../utils/removeVietnameseTones";

const { Option } = Select;

const UserManagement = () => {
  const { t, i18n } = useTranslation();
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
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingUser, setDeletingUser] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    type: "success",
    message: "",
  });

  const roles = [
    { value: "ROLE_ADMIN", label: t('admin.users.roles.admin'), color: "red", classes: "bg-red-50 text-red-600 border-red-100" },
    { value: "ROLE_USER", label: t('admin.users.roles.customer'), color: "slate", classes: "bg-slate-50 text-slate-600 border-slate-100" },
  ];

  const statusOptions = [
    { value: true, label: t('admin.users.status_active'), color: "green", classes: "bg-green-50 text-green-600 shadow-green-100" },
    { value: false, label: t('admin.users.status_locked'), color: "red", classes: "bg-red-50 text-red-600 shadow-red-100" },
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
      messageApi.error(t('admin.users.errors.load_fail'));
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
    setDeleteConfirmText("");
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    try {
      await userApi.admin.delete(deletingUser.id);
      messageApi.success(t('common.update_success'));
      setIsDeleteModalOpen(false);
      setDeletingUser(null);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      messageApi.error(t('admin.users.errors.delete_fail'));
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
        showNotification("success", t('common.create_success'));
      }
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      messageApi.error(
        t('admin.users.errors.save_fail') + " " +
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
        title: <span className="text-[15px] font-medium text-slate-600">{t('admin.users.col_customer')}</span>,
        dataIndex: "customerName",
        key: "customerName",
        width: 200,
        render: (name) => (
          <span className="text-slate-900 font-semibold text-[14px] leading-none mb-1">
            {i18n.language === 'en' ? removeVietnameseTones(name) : name}
          </span>
        ),
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">{t('admin.users.col_email')}</span>,
        dataIndex: "email",
        key: "email",
        width: 220,
        render: (email) => (
          <span className="text-slate-600 text-[14px] font-semibold">{email || "---"}</span>
        )
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">{t('admin.users.col_phone')}</span>,
        dataIndex: "phone",
        key: "phone",
        width: 150,
        render: (phone) => (
          <span className="text-slate-600 text-[14px] font-medium">{phone || "---"}</span>
        )
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">{t('admin.users.col_role')}</span>,
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
                {t('admin.users.multi_role')}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">{t('admin.users.col_status')}</span>,
        dataIndex: "active",
        key: "active",
        width: 140,
        render: (active) => (
          <span className={`px-2.5 py-1 rounded-full text-[13px] font-semibold text-white inline-block ${active ? "bg-green-500 shadow-sm shadow-green-200" : "bg-red-500 shadow-sm shadow-red-200"
            }`}>
            {active ? t('admin.users.status_active') : t('admin.users.status_locked')}
          </span>
        ),
      },
      {
        title: <span className="text-[15px] font-medium text-slate-600">{t('admin.users.col_created')}</span>,
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
        title: <span className="text-[15px] font-medium text-slate-600">{t('admin.bookings.col_action')}</span>,
        key: "actions",
        width: 100,
        align: "center",
        render: (_, record) => (
          <div className="flex items-center justify-center gap-2">
            <Button
              type="text"
              onClick={() => handleEdit(record)}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-50 text-amber-500 hover:bg-amber-100 transition-all p-0"
              title="Chỉnh sửa"
            >
              <Edit size={16} strokeWidth={2.5} />
            </Button>
            <Button
              type="text"
              onClick={() => handleDelete(record)}
              className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all p-0"
              title="Xóa tài khoản"
            >
              <Trash2 size={16} strokeWidth={2.5} />
            </Button>
          </div>
        ),
      },
    ],
    [pagination, roles, i18n.language]
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {messageContext}

      {/* 1. Stats Section - Clean modern layout */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-4 sm:p-5 rounded-[22px] sm:rounded-[24px] border border-slate-200 shadow-sm animate-pulse">
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col space-y-2">
                  <div className="h-4 w-16 bg-slate-100 rounded"></div>
                  <div className="h-6 w-12 bg-slate-200 rounded"></div>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100"></div>
              </div>
            </div>
          ))
        ) : (
          [
            { icon: <Users size={22} />, label: t('admin.users.stats_total'), value: pagination.total, config: "text-indigo-600 bg-indigo-50" },
            { icon: <UserCheck size={22} />, label: t('admin.users.stats_active'), value: stats.active, config: "text-emerald-600 bg-emerald-50" },
            { icon: <UserX size={22} />, label: t('admin.users.stats_locked'), value: stats.inactive, config: "text-rose-600 bg-rose-50" },
            { icon: <ShieldCheck size={22} />, label: t('admin.users.stats_admin'), value: stats.admin, config: "text-amber-600 bg-amber-50" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 sm:p-5 rounded-[22px] sm:rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10 w-full">
                <div className="flex flex-col min-w-0">
                  <p className="text-[12px] sm:text-[14px] font-medium text-slate-500 mb-0.5 truncate">{item.label}</p>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 m-0 leading-none">{item.value}</h3>
                </div>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-2xl ${item.config} flex items-center justify-center transition-transform group-hover:scale-110 duration-500 relative z-10`}>
                  {item.icon}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 2. Main Data Section */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-50 pb-2">
          <h2 className="text-[18px] sm:text-[20px] font-bold text-slate-800 whitespace-nowrap flex items-center gap-3">
            <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
            {t('admin.users.title')}
          </h2>

          <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-2 xl:gap-3 w-full xl:w-auto flex-1 justify-end">
            <div className="w-full xl:max-w-[280px]">
              <Input
                placeholder={t('admin.users.search_placeholder')}
                prefix={<Search size={14} className="text-slate-400" />}
                className="h-9 xl:h-10 w-full border-slate-200 rounded-xl text-[13px] xl:text-[14px] font-medium text-slate-900 shadow-sm hover:border-blue-400 focus:border-blue-500 placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select
                  placeholder={
                    <div className="flex items-center gap-2">
                      <Shield size={13} className="text-slate-400" />
                      <span className="font-medium text-slate-500 text-[13px]">{t('admin.users.role_filter')}</span>
                    </div>
                  }
                  value={filters.role}
                  onChange={(val) => handleFilterChange("role", val)}
                  className="h-9 xl:h-10 flex-1 sm:w-[140px] custom-select-premium compact-select"
                  allowClear
                  dropdownStyle={{ borderRadius: '15px', padding: '8px' }}
                  popupMatchSelectWidth={false}
                >
                  {roles.map(r => (
                    <Option key={r.value} value={r.value}>
                      <div className="flex items-center gap-2 py-1">
                        <div className={`w-2 h-2 rounded-full ${r.value === 'ROLE_ADMIN' ? 'bg-red-500' : 'bg-slate-400'}`}></div>
                        <span className="font-medium text-slate-700 text-[13px]">{r.label}</span>
                      </div>
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder={
                    <div className="flex items-center gap-2">
                      <Settings size={13} className="text-slate-400" />
                      <span className="font-medium text-slate-500 text-[13px]">{t('admin.users.status_filter')}</span>
                    </div>
                  }
                  value={filters.status}
                  onChange={(val) => handleFilterChange("status", val)}
                  className="h-9 xl:h-10 flex-1 sm:w-[140px] custom-select-premium compact-select"
                  allowClear
                  dropdownStyle={{ borderRadius: '15px', padding: '8px' }}
                  popupMatchSelectWidth={false}
                >
                  {statusOptions.map(s => (
                    <Option key={s.value.toString()} value={s.value}>
                      <div className="flex items-center gap-2 py-1">
                        <div className={`w-2 h-2 rounded-full ${s.value ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium text-slate-700 text-[13px]">{s.label}</span>
                      </div>
                    </Option>
                  ))}
                </Select>

                <Button
                  onClick={clearFilters}
                  className="h-9 w-9 xl:h-10 sm:w-auto sm:px-3 flex items-center justify-center gap-2 text-slate-500 font-medium text-[13px] bg-white border border-slate-200 rounded-xl hover:text-blue-600 transition-all p-0"
                  icon={<RotateCcw size={14} />}
                >
                  <span className="hidden sm:inline whitespace-nowrap">{t('admin.users.reset_filters')}</span>
                </Button>

                <Button
                  onClick={handleCreate}
                  className="h-9 w-9 xl:h-10 xl:w-auto sm:px-4 bg-slate-900 border-none rounded-xl font-bold text-[13px] xl:text-[14px] text-white shadow-md flex items-center justify-center gap-1.5 hover:bg-slate-800 transition-all p-0 sm:p-auto"
                >
                  <Plus size={16} strokeWidth={3} className="text-white" />
                  <span className="hidden sm:inline text-white">{t('admin.users.add_btn')}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Area */}
        <div className="rounded-[28px] border-2 border-slate-200 overflow-hidden bg-white shadow-inner">
          {loading ? (
            /* Skeleton Loading State */
            <div className="p-4 sm:p-8 grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-32 sm:h-20 bg-slate-50 rounded-[20px] animate-pulse border border-slate-100 flex flex-col sm:flex-row items-center p-4 sm:px-6 gap-3 sm:gap-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0"></div>
                  <div className="flex-1 space-y-2 w-full text-center sm:text-left">
                    <div className="w-2/3 h-3 bg-slate-200 rounded mx-auto sm:mx-0"></div>
                    <div className="w-1/2 h-2 bg-slate-100 rounded mx-auto sm:mx-0"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Table View (shown from md/768px) */}
              <div className="hidden md:block overflow-hidden">
                <Table
                  columns={columns}
                  dataSource={users}
                  rowKey="id"
                  loading={false}
                  pagination={false}
                  onChange={handleTableChange}
                  scroll={{ x: 1000 }}
                  size={window.innerWidth < 1200 ? "small" : "default"}
                  className="ant-table-premium"
                  locale={{ emptyText: <div className="py-20 text-slate-600 font-bold italic">{t('admin.dashboard.no_records')}</div> }}
                />
              </div>

              {/* Mobile Card View (hidden from md/768px) */}
              <div className="md:hidden grid grid-cols-2 gap-2.5 p-2.5 sm:gap-6 sm:p-6">
                {users?.length > 0 ? users.map((u) => (
                  <div key={u.id} className="bg-white p-2.5 sm:p-5 rounded-[20px] sm:rounded-[28px] border border-slate-200 shadow-sm hover:border-indigo-200 transition-all flex flex-col h-full relative">
                    {/* Compact Top Section: Avatar + Name + Status */}
                    <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-4">
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
                          <User size={16} sm:size={22} strokeWidth={1.5} />
                        </div>
                        <div className={`absolute -top-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${u.active ? "bg-green-500" : "bg-red-500"}`}></div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[12px] sm:text-[15px] font-bold text-slate-900 m-0 truncate leading-tight">
                          {i18n.language === 'en' ? removeVietnameseTones(u.customerName) : u.customerName}
                        </h4>
                        <div className="flex items-center gap-1 mt-0.5 sm:mt-1 opacity-70">
                          <Phone size={10} sm:size={13} className="text-indigo-600 shrink-0" />
                          <span className="text-[10px] sm:text-[12px] font-bold text-slate-500 truncate">{u.phone || "---"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compact Footer: Role + Actions (all in one line on small screens) */}
                    <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between gap-1">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(u.roles) ? u.roles.slice(0, 1).map(r => (
                          <span key={r} className="px-1.5 py-0.5 bg-indigo-50/50 text-indigo-600 rounded-md text-[10px] sm:text-[13px] font-bold">{getRoleLabel(r)}</span>
                        )) : (
                          <span className="px-1.5 py-0.5 bg-indigo-50/50 text-indigo-600 rounded-md text-[10px] sm:text-[13px] font-bold">{getRoleLabel(u.roles)}</span>
                        )}
                        {Array.isArray(u.roles) && u.roles.length > 1 && (
                          <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[9px] font-black">+{u.roles.length - 1}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button onClick={() => handleEdit(u)} className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-amber-50 text-amber-500 border-none p-0 hover:bg-amber-100"><Edit size={14} sm:size={18} strokeWidth={2.5} /></Button>
                        <Button onClick={() => handleDelete(u)} className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 border-none p-0 hover:bg-red-100"><Trash2 size={14} sm:size={18} strokeWidth={2.5} /></Button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-16 text-center text-slate-300 font-bold italic bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">{t('admin.dashboard.no_records')}</div>
                )}
              </div>
            </>
          )}

          {/* Footer: Modern Pagination */}
          {pagination.total > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50/30 border-t border-slate-100 flex flex-row items-center justify-between gap-4">
              <div className="px-2.5 py-1 sm:px-3 bg-white border border-slate-100 rounded-xl text-[12px] sm:text-[13px] font-medium text-slate-500 shadow-sm">{t('admin.bookings.display')}
                <span className="font-bold text-slate-700"> {pagination.current} / {Math.ceil(pagination.total / (pagination.pageSize || 10))}</span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <Button
                  className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg bg-white border-slate-200 text-slate-500 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all p-0"
                  disabled={pagination.current === 1}
                  onClick={() => handleTableChange({ current: pagination.current - 1, pageSize: pagination.pageSize })}
                  icon={<ChevronLeft size={16} />}
                />

                <Button
                  className="h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg bg-white border-slate-200 text-slate-500 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all p-0"
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
        <div className="fixed bottom-4 right-4 sm:bottom-10 sm:right-10 z-[2000] px-4 py-3 sm:px-8 sm:py-5 bg-white rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-3 sm:gap-5 animate-in slide-in-from-right duration-500 max-w-[calc(100vw-32px)] sm:max-w-none">
          <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg shrink-0 ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {notification.type === "success" ? <CheckCircle size={20} strokeWidth={2.5} /> : <XCircle size={20} strokeWidth={2.5} />}
          </div>
          <div className="pr-2 sm:pr-4 min-w-0">
            <h5 className="font-black text-slate-900 tracking-wider text-[11px] sm:text-xs mb-1 truncate">{notification.type === "success" ? t('common.success') : t('common.error')}</h5>
            <p className="text-[11px] sm:text-xs text-slate-500 font-bold mb-0 truncate">{notification.message}</p>
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
            <div className="bg-slate-900 p-5 sm:p-10 text-white relative">
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>
              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-8 relative z-10">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-[32px] bg-white text-slate-900 flex items-center justify-center shadow-2xl">
                  <User size={32} strokeWidth={1} className="sm:w-12 sm:h-12" />
                </div>
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                    {selectedDetailUser.roles?.map(r => (
                      <span key={r} className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-white/10 backdrop-blur-md rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-bold">{getRoleLabel(r)}</span>
                    ))}
                    <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${selectedDetailUser.active ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></div>
                  </div>
                  <h2 className="text-xl sm:text-4xl font-bold m-0">
                    {i18n.language === 'en' ? removeVietnameseTones(selectedDetailUser.customerName) : selectedDetailUser.customerName}
                  </h2>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-10">
              <div className="space-y-6 sm:space-y-8">
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-[11px] font-black text-slate-400">{t('admin.users.detail_contact')}</p>
                  <div className="flex items-center gap-2.5 sm:gap-3 text-[14px] sm:text-[16px] font-bold text-slate-900"><Phone size={16} className="sm:w-[18px] sm:h-[18px] text-indigo-500" /> {selectedDetailUser.phone}</div>
                  <div className="flex items-center gap-2.5 sm:gap-3 text-[14px] sm:text-[16px] font-bold text-slate-900"><Mail size={16} className="sm:w-[18px] sm:h-[18px] text-indigo-500" /> {selectedDetailUser.email || "---"}</div>
                </div>
              </div>
              <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl sm:rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-[10px] sm:text-[11px] font-black text-slate-400 mb-1">{t('admin.users.detail_join')}</p>
                  <p className="text-[16px] sm:text-[18px] font-bold text-slate-900 m-0">{dayjs(selectedDetailUser.createdAt).format("DD/MM/YYYY")}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button onClick={() => { setIsDetailModalOpen(false); handleEdit(selectedDetailUser); }} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl bg-indigo-600 text-white border-none font-bold text-[12px] sm:text-[13px] flex-1 sm:flex-none">{t('common.update')}</Button>
                  <Button onClick={() => setIsDetailModalOpen(false)} className="h-10 sm:h-12 px-4 sm:px-6 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-[12px] sm:text-[13px] shadow-sm flex-1 sm:flex-none">{t('common.close')}</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        centered
        width={480}
        closable={false}
        className="premium-delete-modal"
      >
        <div className="space-y-4 sm:space-y-6">
            <h3 className="text-[20px] sm:text-[24px] font-bold text-slate-900 leading-tight">{t('admin.users.delete_title')}</h3>
            <p className="text-[14px] sm:text-[15px] text-slate-500 leading-relaxed font-medium">
              {t('admin.users.delete_desc')}
            </p>

          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[14px] sm:text-[15px] font-semibold text-slate-700">
                {t('admin.users.delete_confirm_label')}: <span className="text-red-500">"{i18n.language === 'en' ? removeVietnameseTones(deletingUser?.customerName) : deletingUser?.customerName}"</span>
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={t('admin.bookings.confirm_placeholder')}
                className="h-10 sm:h-11 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-100 font-medium text-[13px] sm:text-[14px]"
              />
            </div>

            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={12} sm:size={14} strokeWidth={2.5} />
              </div>
              <p className="text-[13px] sm:text-[15px] font-medium text-red-800 leading-relaxed">
                {t('admin.users.delete_warning')}
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 h-9 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-[13px] hover:bg-slate-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteConfirmText !== (i18n.language === 'en' ? removeVietnameseTones(deletingUser?.customerName) : deletingUser?.customerName)}
              className={`flex-[1.5] h-9 rounded-xl font-medium text-[13px] shadow-lg shadow-red-100 transition-all ${deleteConfirmText === (i18n.language === 'en' ? removeVietnameseTones(deletingUser?.customerName) : deletingUser?.customerName)
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border-none shadow-none"
                }`}
            >
              {t('common.delete')}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserManagement;
