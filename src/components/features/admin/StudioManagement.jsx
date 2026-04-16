import { useState, useEffect } from "react";
import { message, Table, Button, Modal, Tag, Switch, Tooltip } from "antd";
import { Plus, Edit, Trash2, Home, Users, Settings, DollarSign, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from "lucide-react";
import studioRoomApi from "../../../api/studioRoomApi";
import StudioForm from "./components/StudioForm";

const StudioManagement = () => {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    fetchStudios();
  }, [pagination.current, pagination.pageSize]);

  const fetchStudios = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
      };
      const response = await studioRoomApi.admin.getAll(params);
      const data = response.data || response;

      setStudios(data.content || data);
      setPagination({
        ...pagination,
        total: data.totalElements || data.length || 0,
      });
    } catch (error) {
      console.error("Error fetching studios:", error);
      messageApi.error("Không thể tải danh sách studio!");
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

  const handleCreate = () => {
    setSelectedStudio(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedStudio(record);
    setIsFormModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedStudio(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await studioRoomApi.admin.delete(selectedStudio.id);
      messageApi.success("Xóa studio thành công!");
      setIsDeleteModalOpen(false);
      fetchStudios();
    } catch (error) {
      console.error("Error deleting studio:", error);
      messageApi.error("Không thể xóa studio!");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus =
        currentStatus === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
      await studioRoomApi.admin.updateStatus(id, newStatus);
      messageApi.success("Cập nhật trạng thái thành công!");
      fetchStudios();
    } catch (error) {
      console.error("Error updating status:", error);
      messageApi.error("Không thể cập nhật trạng thái!");
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedStudio) {
        await studioRoomApi.admin.update(selectedStudio.id, values);
        messageApi.success("Cập nhật studio thành công!");
      } else {
        await studioRoomApi.admin.create(values);
        messageApi.success("Tạo studio thành công!");
      }
      setIsFormModalOpen(false);
      fetchStudios();
    } catch (error) {
      console.error("Error saving studio:", error);
      messageApi.error("Không thể lưu studio!");
    }
  };

  const columns = [
    {
      title: "Phòng / Studio",
      dataIndex: "studioName",
      key: "studioName",
      width: 240,
      render: (name) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-none bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-lg shadow-slate-200">
            <Home size={20} />
          </div>
          <div>
            <strong className="text-slate-900 font-black text-sm uppercase tracking-tight leading-none block mb-1">{name}</strong>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Không gian làm việc</span>
          </div>
        </div>
      ),
    },
    {
      title: "Thông số kỹ thuật",
      key: "specs",
      width: 300,
      render: (_, record) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-blue-500" />
            <span className="text-xs font-bold text-slate-600">Sức chứa: {record.capacity} người</span>
          </div>
          <div className="flex items-start gap-2 max-w-[250px]">
            <Settings size={14} className="text-slate-400 shrink-0 mt-0.5" />
            <span className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-relaxed">
              {record.equipment || "Không thông báo thiết bị"}
            </span>
          </div>
        </div>
      )
    },
    {
      title: "Chi phí thuê",
      dataIndex: "hourlyRate",
      key: "hourlyRate",
      width: 180,
      render: (rate) => (
        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-none border border-green-100 inline-flex items-center gap-2">
          <DollarSign size={14} />
          <span className="font-black text-sm tracking-tight">{rate?.toLocaleString("vi-VN")}</span>
          <span className="text-[10px] opacity-70 font-bold uppercase tracking-widest">/ Giờ</span>
        </div>
      ),
    },
    {
      title: "Vận hành",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (status, record) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={status === "AVAILABLE"}
            onChange={() => handleStatusToggle(record.id, status)}
            className={status === "AVAILABLE" ? "!bg-green-500" : "!bg-red-400"}
            size="small"
          />
          <span className={`px-2.5 py-1 rounded-full text-[13px] font-semibold text-white inline-block ${
            status === "AVAILABLE" ? "bg-green-500 shadow-sm shadow-green-200" : "bg-red-500 shadow-sm shadow-red-200"
          }`}>
            {status === "AVAILABLE" ? "Sẵn sàng" : "Bảo trì"}
          </span>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      fixed: "right",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            type="text"
            onClick={() => handleEdit(record)}
            className="w-10 h-10 rounded-none bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600  flex items-center justify-center p-0"
            icon={<Edit size={18} />}
          />
          <Button
            type="text"
            danger
            onClick={() => handleDelete(record)}
            className="w-10 h-10 rounded-none bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600  flex items-center justify-center p-0"
            icon={<Trash2 size={18} />}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {contextHolder}

      <div className="bg-white p-4 sm:p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-0 border-b border-slate-50">
          <h2 className="text-[17px] sm:text-[20px] font-bold text-slate-800 whitespace-nowrap mr-auto flex items-center gap-3">
            <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
            Hệ thống Studio
          </h2>

          <Button
            onClick={handleCreate}
            className="h-10 px-6 bg-slate-900 border-none font-bold text-[13px] sm:text-[14px] shadow-lg shadow-slate-200 flex items-center gap-2 !text-white hover:!bg-slate-800 rounded-xl transition-all w-full sm:w-auto justify-center"
          >
            <Plus size={18} strokeWidth={3} />
            Tạo Studio mới
          </Button>
        </div>

        <div className="rounded-[28px] border-2 border-slate-200 overflow-hidden bg-white shadow-inner">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Table
              columns={columns}
              dataSource={studios}
              rowKey="id"
              loading={loading}
              pagination={false}
              onChange={handleTableChange}
              scroll={{ x: 1200 }}
              className="ant-table-custom"
            />
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            {loading ? (
              <div className="p-4 sm:p-6 space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-28 bg-slate-50 rounded-2xl animate-pulse border border-slate-100"></div>
                ))}
              </div>
            ) : (Array.isArray(studios) && studios.length > 0) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6">
                {studios.map((studio) => (
                  <div key={studio.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-md">
                        <Home size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-tight truncate">{studio.studioName}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Không gian làm việc</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 py-2 border-y border-slate-50 text-[12px] font-medium text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Users size={13} className="text-blue-500" />
                        <span>{studio.capacity} người</span>
                      </div>
                      <div className="px-3 py-1 bg-green-50 text-green-700 rounded-lg border border-green-100 inline-flex items-center gap-1 font-bold text-[12px]">
                        <DollarSign size={12} />
                        {studio.hourlyRate?.toLocaleString("vi-VN")} / Giờ
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={studio.status === "AVAILABLE"}
                          onChange={() => handleStatusToggle(studio.id, studio.status)}
                          className={studio.status === "AVAILABLE" ? "!bg-green-500" : "!bg-red-400"}
                          size="small"
                        />
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold text-white ${studio.status === "AVAILABLE" ? "bg-green-500" : "bg-red-500"}`}>
                          {studio.status === "AVAILABLE" ? "Sẵn sàng" : "Bảo trì"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button type="text" onClick={() => handleEdit(studio)} className="w-9 h-9 rounded-xl flex items-center justify-center text-amber-500 p-0" icon={<Edit size={18} />} />
                        <Button type="text" danger onClick={() => handleDelete(studio)} className="w-9 h-9 rounded-xl flex items-center justify-center text-red-500 p-0" icon={<Trash2 size={18} />} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center text-slate-300 font-bold italic uppercase tracking-widest">Không có dữ liệu</div>
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
                disabled={pagination.current >= Math.ceil(pagination.total / (pagination.pageSize || 10))}
                onClick={() => handleTableChange({ current: pagination.current + 1, pageSize: pagination.pageSize })}
                icon={<ChevronRight size={16} />}
              />
            </div>
          </div>
        )}
      </div>
    </div>

    <StudioForm
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedStudio}
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
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-none flex items-center justify-center mx-auto mb-6">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Xác nhận gỡ bỏ?</h3>
          <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed">Studio này sẽ được loại bỏ khỏi hệ thống vận hành. Hành động này không thể hoàn tác.</p>

          {selectedStudio && (
            <div className="bg-slate-50 p-6 rounded-none border border-slate-100 mb-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tên Studio</span>
                <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{selectedStudio.studioName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sức chứa</span>
                <Tag className="!m-0 bg-white text-slate-600 font-bold border-slate-200 rounded-none">{selectedStudio.capacity} người</Tag>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 h-12 rounded-none font-black uppercase tracking-widest text-[10px] border-slate-200">Hủy</Button>
            <Button onClick={confirmDelete} danger type="primary" className="flex-1 h-12 rounded-none bg-red-600 border-none font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-100  hover:bg-red-700">Xác nhận xóa</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudioManagement;
