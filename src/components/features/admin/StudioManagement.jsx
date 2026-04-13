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
          <span className={`text-[10px] font-black uppercase tracking-widest ${status === "AVAILABLE" ? "text-green-600" : "text-red-500"}`}>
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {contextHolder}

      <div className="bg-white p-6 rounded-none border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-blue-600 rounded-none"></div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Hệ thống Studio</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Quản lý không gian quay chụp</p>
          </div>
        </div>
        <Button
          type="primary"
          onClick={handleCreate}
          className="h-14 px-8 bg-slate-900 hover:bg-slate-800 rounded-none border-none font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 flex items-center gap-3  "
        >
          <Plus size={20} strokeWidth={3} />
          Tạo Studio mới
        </Button>
      </div>

      <div className="bg-white rounded-none border border-slate-100 shadow-sm overflow-hidden bg-white">
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

        {pagination.total > 0 && (
          <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="px-6 py-3 bg-slate-50 rounded-none text-[11px] font-black text-slate-500 uppercase tracking-widest">
              Đang hiển thị {Math.min(pagination.total, (pagination.current - 1) * pagination.pageSize + 1)}-
              {Math.min(pagination.current * pagination.pageSize, pagination.total)}
              <span className="mx-2 text-slate-300">/</span>
              {pagination.total} Studio
            </div>

            <div className="flex items-center gap-2">
              <Button
                className="h-12 w-12 flex items-center justify-center rounded-none border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600  font-black shadow-sm bg-white"
                disabled={pagination.current === 1}
                onClick={() => handleTableChange({ current: pagination.current - 1, pageSize: pagination.pageSize })}
                icon={<ChevronLeft size={20} />}
              />
              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-none border border-slate-100 shadow-inner">
                <span className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-none font-black shadow-lg shadow-blue-100">
                  {pagination.current}
                </span>
                <span className="text-slate-300 font-black px-3 text-[10px] uppercase tracking-widest italic">Của</span>
                <span className="w-10 h-10 flex items-center justify-center bg-white text-slate-500 border border-slate-100 rounded-none font-bold">
                  {Math.ceil(pagination.total / pagination.pageSize) || 1}
                </span>
              </div>
              <Button
                className="h-12 w-12 flex items-center justify-center rounded-none border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600  font-black shadow-sm bg-white"
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                onClick={() => handleTableChange({ current: pagination.current + 1, pageSize: pagination.pageSize })}
                icon={<ChevronRight size={20} />}
              />
            </div>
          </div>
        )}
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
