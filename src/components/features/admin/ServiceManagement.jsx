import { useState, useEffect, useCallback, useMemo } from "react";
import { message, Table, Button, Tag, Switch, Tooltip, Modal, Input } from "antd";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Gem,
  ShoppingBag,
  Layers,
  Edit,
  Trash2,
  Mic,
  Music,
  Star,
  Camera,
  Video,
  Zap,
  Heart,
  AlertTriangle
} from "lucide-react";
import serviceApi from "../../../api/serviceApi";
import ServiceForm from "./components/ServiceForm";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: 0,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletingService, setDeletingService] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  const { current, pageSize } = pagination;

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: current - 1,
        size: pageSize,
      };
      const response = await serviceApi.admin.getAll(params);
      const data = response.data || response;

      let list = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data.list && Array.isArray(data.list)) {
        list = data.list;
      } else if (data.content && Array.isArray(data.content)) {
        list = data.content;
      }

      setServices(list);
      setPagination((prev) => ({
        ...prev,
        total: data.totalElements || data.totalItems || list.length || 0,
      }));
    } catch (error) {
      console.error("Error fetching services:", error);
      messageApi.error("Không thể tải danh sách dịch vụ!");
    } finally {
      setLoading(false);
    }
  }, [current, pageSize, messageApi]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleTableChange = (newPagination) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleCreate = () => {
    setSelectedService(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedService(record);
    setIsFormModalOpen(true);
  };

  const handleStatusToggle = async (id, newStatus) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === id ? { ...service, active: newStatus } : service
      )
    );

    try {
      await serviceApi.admin.updateStatus(id, newStatus);
      messageApi.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating status:", error);
      messageApi.error("Không thể cập nhật trạng thái!");
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.id === id ? { ...service, active: !newStatus } : service
        )
      );
    }
  };

  const handleDelete = (record) => {
    setDeletingService(record);
    setDeleteConfirmText("");
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingService) return;
    try {
      await serviceApi.admin.delete(deletingService.id);
      messageApi.success("Dịch vụ đã được xóa về cõi hư vô!");
      setIsDeleteModalOpen(false);
      setDeletingService(null);
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      messageApi.error("Có thế lực cản trở, không thể xóa!");
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (selectedService) {
        const promises = [serviceApi.admin.update(selectedService.id, values)];

        if (selectedService.active !== values.active) {
          promises.push(
            serviceApi.admin.updateStatus(selectedService.id, values.active)
          );
        }

        await Promise.all(promises);
        setIsFormModalOpen(false);
        messageApi.success("Cập nhật dịch vụ thành công!");
      } else {
        await serviceApi.admin.create(values);
        setIsFormModalOpen(false);
        messageApi.success("Tạo dịch vụ thành công!");
      }
      fetchServices();
    } catch (error) {
      console.error("Error saving service:", error);
      messageApi.error("Không thể lưu dịch vụ!");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = useMemo(() => [
    {
      title: <span className="text-[13px] font-semibold text-slate-600">Tên dịch vụ</span>,
      dataIndex: "name",
      key: "name",
      width: 250,
      render: (name, record) => {
        const IconComponent = {
          Mic, Music, Star, Camera, Video, Zap, Heart
        }[record.icon] || Briefcase;

        return (
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-slate-900 font-semibold text-[14px] leading-tight flex items-center gap-1.5">
                {name}
                {record.featured && (
                  <Tooltip title="Gói nổi bật">
                    <Star size={12} fill="currentColor" className="text-amber-500" />
                  </Tooltip>
                )}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      title: <span className="text-[13px] font-semibold text-slate-600">Đơn giá</span>,
      dataIndex: "price",
      key: "price",
      width: 180,
      render: (price) => (
        <div className="flex items-baseline gap-1.5">
          <span className="text-slate-900 font-medium text-[13px]">{price?.toLocaleString("vi-VN")}</span>
        </div>
      ),
    },
    {
      title: <span className="text-[13px] font-semibold text-slate-600">Quyền lợi đi kèm</span>,
      dataIndex: "benefitsList",
      key: "benefitsList",
      width: 300,
      render: (benefitsList) => (
        <div className="flex flex-wrap gap-1">
          {Array.isArray(benefitsList) && benefitsList.length > 0 ? (
            benefitsList.map((benefit, index) => (
              <span key={index} className="text-slate-600 text-[13px] mr-2">• {benefit}</span>
            ))
          ) : (
            <span className="text-slate-400 italic text-[13px]">---</span>
          )}
        </div>
      ),
    },
    {
      title: <span className="text-[13px] font-semibold text-slate-600">Trạng thái</span>,
      dataIndex: "active",
      key: "active",
      width: 150,
      render: (active, record) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={active}
            onChange={(checked) => handleStatusToggle(record.id, checked)}
            size="small"
          />
          <span className={`px-2.5 py-1 rounded-full text-[13px] font-semibold text-white inline-block ${active ? "bg-green-500 shadow-sm shadow-green-200" : "bg-red-500 shadow-sm shadow-red-200"
            }`}>
            {active ? "Hoạt động" : "Tạm khóa"}
          </span>
        </div>
      ),
    },
    {
      title: <span className="text-[13px] font-semibold text-slate-600">Thao tác</span>,
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Chỉnh sửa">
            <button
              onClick={() => handleEdit(record)}
              className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-center transition-all border border-slate-100"
            >
              <Edit size={16} />
            </button>
          </Tooltip>
          <Tooltip title="Xóa dịch vụ">
            <button
              onClick={() => handleDelete(record)}
              className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all border border-slate-100"
            >
              <Trash2 size={16} />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ], [services, pagination.total, handleEdit, handleDelete, handleStatusToggle]);

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-200">
      {contextHolder}

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm animate-pulse flex items-center gap-4 sm:gap-5">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-[20px] bg-slate-100 border-2 border-slate-50"></div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-slate-50 rounded"></div>
                <div className="h-7 w-12 bg-slate-100 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          [
            { icon: <Gem className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Cao cấp", value: services.filter(s => (s.price || 0) > 10000000).length, config: "bg-amber-50 text-amber-600 border-amber-100" },
            { icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Đang bán", value: services.filter(s => s.active).length, config: "bg-indigo-50 text-indigo-600 border-indigo-100" },
            { icon: <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Tổng số", value: pagination.total, config: "bg-slate-50 text-slate-600 border-slate-100" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-4 sm:gap-5 group">
              <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-[20px] ${item.config} border-2 flex items-center justify-center shrink-0 shadow-sm`}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm sm:text-base font-bold text-slate-500">{item.label}</p>
                <h4 className="text-xl sm:text-[28px] font-black text-slate-900 tracking-tight leading-none mt-1">{item.value}</h4>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-0 border-b border-slate-50">
          <div>
            <h2 className="text-[16px] sm:text-[18px] font-semibold text-slate-900 leading-tight">Danh sách dịch vụ</h2>
          </div>
          <Button
            type="primary"
            onClick={handleCreate}
            className="h-10 px-4 bg-slate-900 rounded-2xl border-none font-semibold text-[13px] sm:text-[14px] shadow-sm flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <Plus size={16} strokeWidth={2.5} />
            Tạo dịch vụ mới
          </Button>
        </div>

        <div className="border border-slate-100 overflow-hidden bg-white shadow-sm rounded-2xl">
          {/* Table View (shown from md/768px) */}
          <div className="hidden md:block">
            {loading ? (
              <div className="p-8 space-y-4">
                <div className="h-10 w-full bg-slate-50 rounded-xl animate-pulse"></div>
                {[1, 2, 3, 4, 5, 6, 7].map(i => (
                  <div key={i} className="h-16 w-full bg-slate-50/50 rounded-xl animate-pulse border border-slate-50"></div>
                ))}
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={Array.isArray(services) ? services : []}
                rowKey="id"
                loading={false}
                pagination={false}
                onChange={handleTableChange}
                scroll={{ x: 1100 }}
                className="ant-table-custom"
                locale={{
                  emptyText: (
                    <div className="py-24 flex flex-col items-center opacity-30">
                      <Briefcase size={64} strokeWidth={1} className="mb-4" />
                      <span className="text-sm font-bold ">Cơ sở dữ liệu dịch vụ trống</span>
                    </div>
                  )
                }}
              />
            )}
          </div>

          {/* Mobile Card View (hidden from md/768px) */}
          <div className="md:hidden">
            {loading ? (
              <div className="p-4 sm:p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-slate-50 rounded-2xl animate-pulse border border-slate-100"></div>
                ))}
              </div>
            ) : (Array.isArray(services) && services.length > 0) ? (
              <div className="md:hidden grid grid-cols-2 gap-2.5 p-2.5">
                {services.map((svc) => {
                  return (
                    <div key={svc.id} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full hover:border-blue-200 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[12px] font-bold text-slate-900 truncate flex items-center gap-1">
                            {svc.name}
                            {svc.featured && <Star size={10} fill="currentColor" className="text-amber-500 shrink-0" />}
                          </h4>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-baseline gap-1">
                          <span className="text-slate-900 font-bold text-[14px] center">{svc.price?.toLocaleString("vi-VN")}</span>
                        </div>

                        <div className="flex items-center justify-between py-1.5 border-y border-slate-50">
                          <Switch checked={svc.active} onChange={(checked) => handleStatusToggle(svc.id, checked)} size="small" />
                          <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white ${svc.active ? "bg-green-500" : "bg-red-500"}`}>
                            {svc.active ? "Mở" : "Khóa"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1 mt-2.5 pt-1">
                        <Button type="text" onClick={() => handleEdit(svc)} className="w-7 h-7 rounded-lg flex items-center justify-center text-amber-500 p-0 hover:bg-amber-50"><Edit size={14} /></Button>
                        <Button type="text" onClick={() => handleDelete(svc)} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-500 p-0 hover:bg-red-50"><Trash2 size={14} /></Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center opacity-30 p-4">
                <Briefcase size={48} strokeWidth={1} className="mb-4" />
                <span className="text-sm font-black text-center">Cơ sở dữ liệu dịch vụ trống</span>
              </div>
            )}
          </div>

          {pagination.total > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50/30 border-t border-slate-100 flex flex-row items-center justify-between gap-4">
              <div className="px-2.5 py-1 sm:px-3 sm:py-1 bg-white border border-slate-100 rounded-xl text-[12px] sm:text-[13px] font-medium text-slate-500 shadow-sm">
                Hiển thị <span className="font-bold text-slate-700">{pagination.current} / {Math.ceil(pagination.total / (pagination.pageSize || 10))}</span>
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
          <div className="space-y-2">
            <h3 className="text-[20px] sm:text-[24px] font-bold text-slate-900 leading-tight">Xóa dịch vụ</h3>
            <p className="text-[14px] sm:text-[15px] text-slate-500 leading-relaxed font-medium">
              Thao tác này sẽ xóa vĩnh viễn dịch vụ và tất cả dữ liệu liên quan. Hành động này không thể hoàn tác.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-1.5 sm:space-y-2">
              <label className="text-[14px] sm:text-[15px] font-semibold text-slate-700">
                Nhập tên dịch vụ để xác nhận: <span className="text-red-500">"{deletingService?.name}"</span>
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Nhập tên chính xác..."
                className="h-10 sm:h-11 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-100 font-medium text-[13px] sm:text-[14px]"
              />
            </div>

            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={12} sm:size={14} strokeWidth={2.5} />
              </div>
              <p className="text-[13px] sm:text-[15px] font-medium text-red-800 leading-relaxed">
                Cảnh báo: Việc xóa "{deletingService?.name}" sẽ ảnh hưởng đến lịch sử booking.
              </p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 h-9 rounded-xl border border-slate-200 bg-white text-slate-700 font-medium text-[13px] hover:bg-slate-50 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              onClick={confirmDelete}
              disabled={deleteConfirmText !== deletingService?.name}
              className={`flex-[1.5] h-9 rounded-xl font-medium text-[13px] shadow-lg shadow-red-100 transition-all ${deleteConfirmText === deletingService?.name
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border-none shadow-none"
                }`}
            >
              Xác nhận xóa
            </button>
          </div>
        </div>
      </Modal>

      <ServiceForm
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedService}
        confirmLoading={submitting}
      />
    </div>
  );
};

export default ServiceManagement;
