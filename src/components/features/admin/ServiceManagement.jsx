import { useState, useEffect, useCallback } from "react";
import { message, Table, Button, Tag, Switch, Tooltip } from "antd";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Crown,
  Rocket,
  Layers,
  Edit,
  Trash2
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

  const columns = [
    {
      title: <span className="text-[13px] font-semibold text-slate-600">Tên dịch vụ</span>,
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name) => (
        <span className="text-slate-900 font-semibold text-[14px] leading-none mb-1">{name}</span>
      ),
    },
    {
      title: <span className="text-[13px] font-semibold text-slate-600">Đơn giá (VNĐ)</span>,
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price) => (
        <span className="text-slate-600 font-semibold text-[14px]">{price?.toLocaleString("vi-VN")}</span>
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
        <div className="flex items-center gap-2">
          <Switch
            checked={active}
            onChange={(checked) => handleStatusToggle(record.id, checked)}
            size="small"
          />
          <span className={`text-[13px] font-semibold ${active ? "text-green-600" : "text-slate-400"}`}>
            {active ? "Hoạt động" : "Tạm khóa"}
          </span>
        </div>
      ),
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
            onClick={() => handleEdit(record)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-500 hover:bg-amber-50 transition-all p-0"
            title="Chỉnh sửa"
          >
            <Edit size={18} strokeWidth={2.5} />
          </Button>
          <Button
            type="text"
            onClick={() => messageApi.warning("Tính năng xóa dịch vụ đang bảo trì")}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-all p-0"
            title="Gỡ bỏ"
          >
            <Trash2 size={18} strokeWidth={2.5} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {contextHolder}

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Crown size={22} />, label: "Gói cao cấp", value: services.filter(s => (s.price || 0) > 10000000).length, config: "bg-amber-50 text-amber-600 border-amber-100" },
          { icon: <Rocket size={22} />, label: "Đang mở bán", value: services.filter(s => s.active).length, config: "bg-indigo-50 text-indigo-600 border-indigo-100" },
          { icon: <Layers size={22} />, label: "Tổng dịch vụ", value: pagination.total, config: "bg-slate-50 text-slate-600 border-slate-100" }
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 transition-all hover:bg-slate-50 group">
            <div className={`w-14 h-14 rounded-xl border ${item.config} flex items-center justify-center transition-all group-hover:bg-white shadow-sm`}>
              {item.icon}
            </div>
            <div>
              <h4 className="text-[14px] font-semibold text-slate-500 mb-1">{item.label}</h4>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-50">
          <div>
            <h2 className="text-[18px] font-semibold text-slate-900 leading-tight">Danh sách dịch vụ</h2>
            <p className="text-[13px] font-medium text-slate-500 mt-1">Hệ thống quản lý định mức và cấu hình gói</p>
          </div>
          <Button
            type="primary"
            onClick={handleCreate}
            className="h-10 px-4 bg-slate-900 hover:bg-slate-800 rounded-2xl border-none font-semibold text-[14px] shadow-sm flex items-center gap-2 transition-all whitespace-nowrap"
          >
            <Plus size={16} strokeWidth={2.5} />
            Kiến tạo dịch vụ
          </Button>
        </div>

        <div className="border border-slate-100 overflow-hidden bg-white shadow-sm rounded-2xl">
          <Table
            columns={columns}
            dataSource={Array.isArray(services) ? services : []}
            rowKey="id"
            loading={loading}
            pagination={false}
            onChange={handleTableChange}
            scroll={{ x: 1100 }}
            className="ant-table-custom"
            locale={{
              emptyText: (
                <div className="py-24 flex flex-col items-center opacity-30">
                  <Briefcase size={64} strokeWidth={1} className="mb-4" />
                  <span className="text-sm font-black uppercase tracking-[0.2em]">Cơ sở dữ liệu dịch vụ trống</span>
                </div>
              )
            }}
          />

          {pagination.total > 0 && (
            <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-600 uppercase tracking-widest shadow-sm flex items-center gap-2">
                <span>{Math.min(pagination.total, (pagination.current - 1) * pagination.pageSize + 1)} — {Math.min(pagination.current * pagination.pageSize, pagination.total)}</span>
                <span className="text-slate-200">/</span>
                <span className="text-slate-500">{pagination.total} Dịch vụ</span>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm p-0"
                  disabled={pagination.current === 1}
                  onClick={() => handleTableChange({ current: pagination.current - 1, pageSize: pagination.pageSize })}
                  icon={<ChevronLeft size={20} />}
                />
                <Button
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm p-0"
                  disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                  onClick={() => handleTableChange({ current: pagination.current + 1, pageSize: pagination.pageSize })}
                  icon={<ChevronRight size={20} />}
                />
              </div>
            </div>
          )}
        </div>
      </div>

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
