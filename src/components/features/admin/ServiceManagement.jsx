import { useState, useEffect, useCallback } from "react";
import { message, Table, Button, Tag, Switch, Tooltip } from "antd";
import { 
  Edit, 
  Trash2, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Briefcase, 
  Gem,
  Zap,
  Star
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
      title: "Thông tin dịch vụ",
      dataIndex: "name",
      key: "name",
      width: 280,
      render: (name) => (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 shadow-lg shadow-slate-200">
                <Gem size={22} className="text-white" />
            </div>
            <div className="flex flex-col">
                <strong className="text-slate-900 font-black text-sm uppercase tracking-tight leading-none mb-1.5">{name}</strong>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enterprise Package</span>
                </div>
            </div>
        </div>
      ),
    },
    {
      title: "Định mức giá",
      dataIndex: "price",
      key: "price",
      width: 180,
      render: (price) => (
        <div className="flex flex-col">
            <div className="text-slate-900 font-black text-base flex items-center gap-1.5">
                {price?.toLocaleString("vi-VN")}
                <span className="text-[10px] font-black uppercase text-slate-400">VNĐ</span>
            </div>
            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-0.5">Giá niêm yết</span>
        </div>
      ),
    },
    {
      title: "Hạng mục đặc quyền",
      dataIndex: "benefitsList",
      key: "benefitsList",
      width: 320,
      render: (benefitsList) => (
        <div className="flex flex-wrap gap-1.5">
          {Array.isArray(benefitsList) && benefitsList.length > 0 ? (
            benefitsList.map((benefit, index) => (
              <Tag key={index} className="!m-0 bg-slate-50 border-slate-100 text-slate-700 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                {benefit}
              </Tag>
            ))
          ) : (
            <span className="text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] italic">Chưa cấu hình đặc quyền</span>
          )}
        </div>
      ),
    },
    {
      title: "Tiêu chuẩn vận hành",
      dataIndex: "active",
      key: "active",
      width: 180,
      render: (active, record) => (
        <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-2xl border ${active ? "bg-green-50 border-green-100" : "bg-slate-50 border-slate-200"}`}>
            <Switch
              checked={active}
              onChange={(checked) => handleStatusToggle(record.id, checked)}
              className={active ? "!bg-green-500 shadow-lg shadow-green-200" : "!bg-slate-300"}
              size="small"
            />
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${active ? "text-green-600" : "text-slate-400"}`}>
                {active ? "Đang mở bán" : "Tạm ngưng"}
            </span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <Button
            type="text"
            icon={<Edit size={20} />}
            onClick={() => handleEdit(record)}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center justify-center p-0 mx-auto"
        />
      ),
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {contextHolder}

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { icon: <Gem size={24} />, label: "Gói cao cấp", value: services.filter(s => (s.price || 0) > 10000000).length, config: "bg-blue-50 text-blue-600" },
            { icon: <Zap size={24} />, label: "Đang mở bán", value: services.filter(s => s.active).length, config: "bg-green-50 text-green-600" },
            { icon: <Star size={24} />, label: "Tổng dịch vụ", value: pagination.total, config: "bg-purple-50 text-purple-600" }
        ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 group">
                <div className={`w-16 h-16 rounded-[1.5rem] ${item.config} flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner`}>
                    {item.icon}
                </div>
                <div>
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{item.label}</h4>
                   <p className="text-3xl font-black text-slate-900 tracking-tight">{item.value}</p>
                </div>
            </div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pb-10 border-b border-slate-50">
           <div className="flex items-center gap-6">
              <div className="w-1.5 h-14 bg-slate-900 rounded-full"></div>
              <div>
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Danh mục dịch vụ</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Hệ thống quản trị hạ tầng gói chụp & quay phim</p>
              </div>
           </div>
           
           <Button
            type="primary"
            onClick={handleCreate}
            className="h-16 px-10 bg-slate-900 hover:bg-slate-800 rounded-2xl border-none font-black uppercase tracking-widest text-xs shadow-2xl shadow-slate-200 flex items-center gap-4 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={22} strokeWidth={3} />
            Kiến tạo dịch vụ mới
          </Button>
        </div>

        <div className="rounded-[3rem] border border-slate-100 overflow-hidden bg-white shadow-inner">
            <Table
              columns={columns}
              dataSource={Array.isArray(services) ? services : []}
              rowKey="id"
              loading={loading}
              pagination={false}
              onChange={handleTableChange}
              scroll={{ x: 1100 }}
              className="ant-table-custom"
              locale={{ emptyText: (
                <div className="py-24 flex flex-col items-center opacity-30">
                    <Briefcase size={64} strokeWidth={1} className="mb-4" />
                    <span className="text-sm font-black uppercase tracking-[0.2em]">Cơ sở dữ liệu dịch vụ trống</span>
                </div>
              )}}
            />

            {pagination.total > 0 && (
              <div className="p-10 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="px-8 py-3.5 bg-white border border-slate-100 rounded-[1.5rem] text-[11px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
                    Tài bản ghi số 
                    <span className="text-slate-900 mx-2">{Math.min(pagination.total, (pagination.current - 1) * pagination.pageSize + 1)} — {Math.min(pagination.current * pagination.pageSize, pagination.total)}</span>
                    của {pagination.total} Dữ liệu
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm group"
                        disabled={pagination.current === 1}
                        onClick={() => handleTableChange({ current: pagination.current - 1, pageSize: pagination.pageSize })}
                        icon={<ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />}
                    />
                    <div className="flex items-center bg-white border border-slate-100 rounded-[1.5rem] p-1 shadow-sm font-black text-xs h-14">
                        <span className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
                             {pagination.current}
                        </span>
                        <span className="px-6 text-[10px] uppercase tracking-[0.2em] text-slate-300">Phân trang</span>
                        <span className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-500 rounded-2xl">
                            {Math.ceil(pagination.total / pagination.pageSize) || 1}
                        </span>
                    </div>
                    <Button
                        className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm group"
                        disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                        onClick={() => handleTableChange({ current: pagination.current + 1, pageSize: pagination.pageSize })}
                        icon={<ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />}
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
