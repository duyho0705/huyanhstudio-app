import { useState, useEffect, useCallback } from "react";
import { message, Button, Modal, Tooltip, Input, Tag } from "antd";
import {
  Edit,
  Trash2,
  Search,
  MonitorPlay,
  Plus,
  Video,
  AlertTriangle,
  PlayCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Play
} from "lucide-react";
import demoApi from "../../../api/demoApi";
import DemoForm from "./components/DemoForm";

const DemoManagement = () => {
  const [demos, setDemos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");

  const [messageApi, contextHolder] = message.useMessage();

  const [searchText, setSearchText] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounce(searchText), 500);
    return () => clearTimeout(t);
  }, [searchText]);

  const fetchDemos = useCallback(async () => {
    setLoading(true);

    try {
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
      };

      let response;
      if (searchDebounce.trim()) {
        params.title = searchDebounce.trim();
        response = await demoApi.search(params);
      } else {
        response = await demoApi.getAll(params);
      }

      const data = response.data?.data || response.data || response;
      const list = data.list || data.content || [];

      setDemos(list);
      setPagination({
        current: (data.pageNumber || 0) + 1,
        pageSize: data.pageSize || pagination.pageSize,
        total: data.totalElements || 0,
      });
    } catch (err) {
      console.error(err);
      messageApi.error("Không thể tải danh sách nhạc nền!");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchDebounce, messageApi]);

  useEffect(() => {
    fetchDemos();
  }, [fetchDemos]);

  useEffect(() => {
    if (searchDebounce !== "") {
      setPagination((p) => ({ ...p, current: 1 }));
    }
  }, [searchDebounce]);

  const handlePageChange = (newPage) => {
    setPagination((p) => ({ ...p, current: newPage }));
  };

  const handleCreate = () => {
    setSelectedDemo(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedDemo(record);
    setIsFormModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedDemo(record);
    setIsDeleteModalOpen(true);
  };

  const handleWatchVideo = (url) => {
    setCurrentVideoUrl(url);
    setIsVideoModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDemo?.id) return;
    try {
      await demoApi.delete(selectedDemo.id);
      messageApi.success("Xóa nhạc nền thành công!");
      setIsDeleteModalOpen(false);
      fetchDemos();
    } catch (error) {
      console.error("Error deleting nhạc nền:", error);
      const errorMsg = error.response?.data?.message || "Không thể xóa nhạc nền!";
      messageApi.error(errorMsg);
    }
  };

  const handleFormSubmit = async (values) => {
    if (values.isActive) {
      const currentActive = demos.find(
        (d) => d.isActive && d.id !== selectedDemo?.id
      );

      if (currentActive) {
        Modal.confirm({
          title: null,
          icon: null,
          centered: true,
          width: 450,
          content: (
            <div className="p-4 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">Chuyển đổi nhạc nền hiển thị?</h3>
              <p className="text-slate-500 text-sm font-medium mb-6">Nhạc nền <strong>"{currentActive.title}"</strong> đang ở trạng thái hiển thị. Bạn có muốn thay thế bằng bản này không?</p>
            </div>
          ),
          okText: "Đồng ý chuyển đổi",
          cancelText: "Hủy bỏ",
          okButtonProps: { className: "h-12 rounded-xl bg-slate-900 border-none font-black uppercase tracking-widest text-[10px]" },
          cancelButtonProps: { className: "h-12 rounded-xl font-black uppercase tracking-widest text-[10px]" },
          onOk: async () => {
            try {
              await demoApi.update(currentActive.id, {
                ...currentActive,
                isActive: false,
              });
              await saveDemo(values);
            } catch (error) {
              console.error("Error switching active demo:", error);
              messageApi.error("Có lỗi khi chuyển đổi video hiển thị!");
            }
          },
        });
        return;
      }
    }
    await saveDemo(values);
  };

  const saveDemo = async (values) => {
    try {
      if (selectedDemo) {
        await demoApi.update(selectedDemo.id, values);
        messageApi.success("Cập nhật nhạc nền thành công!");
      } else {
        const payload = {
          ...values,
          createdAt: new Date().toISOString(),
        };
        await demoApi.create(payload);
        messageApi.success("Tạo nhạc nền thành công!");
      }
      setIsFormModalOpen(false);
      fetchDemos();
    } catch (error) {
      console.error("Error saving nhạc nền:", error);
      const errorMsg = error.response?.data?.message || "Không thể lưu nhạc nền!";
      messageApi.error(errorMsg);
    }
  };

  const getVideoId = (url) => {
    if (!url) return null;
    const full = url.startsWith("http") ? url : `https://${url}`;
    const v = full.match(/[?&]v=([^&]+)/);
    if (v) return v[1];
    if (full.includes("youtu.be/")) return full.split("youtu.be/")[1].split("?")[0];
    if (full.includes("youtube.com/embed/")) return full.split("embed/")[1].split("?")[0];
    return null;
  };

  const getThumbnail = (url) => {
    const videoId = getVideoId(url);
    if (videoId) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return "https://via.placeholder.com/600x400?text=Invalid+Video+URL";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {contextHolder}
      <div className="bg-white p-4 sm:p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 pb-0 border-b border-slate-50">
          <h2 className="text-[17px] sm:text-[20px] font-bold text-slate-800 whitespace-nowrap mr-auto flex items-center gap-3">
            <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
            Thư viện Demo
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-80 relative">
              <Input
                placeholder="Truy vấn demo..."
                className="h-10 border-slate-200 rounded-xl font-medium text-[14px] text-slate-700"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                prefix={<Search size={16} className="text-slate-400 mr-2" />}
              />
            </div>
            <Button
              onClick={handleCreate}
              className="h-10 px-6 bg-slate-900 border-none font-bold text-[13px] sm:text-[14px] shadow-lg shadow-slate-200 flex items-center gap-2 !text-white hover:!bg-slate-800 rounded-xl transition-all w-full sm:w-auto justify-center"
            >
              <Plus size={16} strokeWidth={3} />
              Đăng Demo
            </Button>
          </div>
        </div>

        <div className="rounded-[28px] border-2 border-slate-200 overflow-hidden bg-white shadow-inner">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8 p-3 sm:p-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-slate-50 h-[400px] rounded-[2.5rem] animate-pulse"></div>
              ))
            ) : demos.length === 0 ? (
              <div className="col-span-full py-32 flex flex-col items-center opacity-20">
                <MonitorPlay size={120} strokeWidth={1} />
                <h3 className="text-2xl font-black uppercase tracking-widest mt-6">Không tìm thấy dữ liệu</h3>
              </div>
            ) : (
              demos.map((d) => (
                <div key={d.id} className="relative bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={getThumbnail(d.videoUrl)}
                      alt={d.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300">
                      <button
                        onClick={() => handleWatchVideo(d.videoUrl)}
                        className="w-16 h-16 rounded-3xl bg-white text-slate-950 flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-all duration-300"
                      >
                        <Play fill="currentColor" strokeWidth={0} size={24} />
                      </button>
                    </div>

                    {d.isActive && (
                      <div className="absolute top-6 left-6 px-4 py-2 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-green-500/30 flex items-center gap-2">
                        <CheckCircle2 size={14} />
                        Đang hiển thị
                      </div>
                    )}
                  </div>

                  <div className="p-4 sm:p-8">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight line-clamp-2 uppercase leading-snug h-[3rem] sm:h-[3.5rem] mb-4 sm:mb-6">
                      {d.title}
                    </h3>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Video size={14} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nhạc nền</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(d)}
                          className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-amber-50 hover:text-amber-500 transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(d)}
                          className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
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
                  onClick={() => handlePageChange(pagination.current - 1)}
                  icon={<ChevronLeft size={16} />}
                />

                <Button
                  className="h-9 w-9 flex items-center justify-center rounded-lg bg-white border-slate-200 text-slate-500 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all p-0"
                  disabled={pagination.current >= Math.ceil(pagination.total / (pagination.pageSize || 10))}
                  onClick={() => handlePageChange(pagination.current + 1)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <DemoForm
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedDemo}
      />

      <Modal
        title={null}
        open={isDeleteModalOpen}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        centered
        width={450}
        className="delete-confirmation-modal"
      >
        <div className="p-4 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-50">
            <Trash2 size={40} />
          </div>
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">Xóa bỏ nhạc nền?</h3>
          <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed px-6">Bản nhạc nền này sẽ được loại bỏ hoàn toàn khỏi hệ thống. Thao tác này không thể khôi phục.</p>

          {selectedDemo && (
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-10 text-left">
              <div className="flex items-center gap-4">
                <div className="w-24 aspect-video rounded-xl overflow-hidden shadow-md shrink-0 border border-slate-200">
                  <img src={getThumbnail(selectedDemo.videoUrl)} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tiêu đề nhạc nền</p>
                  <h4 className="text-sm font-black text-slate-800 line-clamp-2 leading-snug">{selectedDemo.title}</h4>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
               onClick={() => setIsDeleteModalOpen(false)} 
               className="flex-1 h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-slate-200 bg-white"
            >
              Giữ lại
            </button>
            <button 
              onClick={confirmDelete} 
              className="flex-1 h-16 rounded-2xl bg-red-600 border-none font-black uppercase tracking-widest text-[10px] shadow-xl shadow-red-100 text-white"
            >
              Xác nhận xóa
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={isVideoModalOpen}
        onCancel={() => setIsVideoModalOpen(false)}
        footer={null}
        width={1000}
        centered
        destroyOnClose
        closable={false}
        className="video-player-modal-custom"
      >
        <div className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <button
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute top-8 right-8 z-50 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center text-white"
          >
            <X size={24} />
          </button>

          <div className="aspect-video">
            {isVideoModalOpen && currentVideoUrl && (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${getVideoId(currentVideoUrl)}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>

          <div className="p-8 bg-slate-900 border-t border-white/5">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Trình phát sản phẩm hoàn thiện</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Huy Anh Studio - Cinematic Showcase</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DemoManagement;
