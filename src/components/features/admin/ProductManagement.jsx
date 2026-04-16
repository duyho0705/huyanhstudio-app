import { useState, useEffect, useCallback, useMemo } from "react";
import { message, Button, Modal, Input, Pagination } from "antd";
import {
  Edit,
  Trash2,
  Search,
  Package,
  Plus,
  Play,
  LayoutGrid,
  Video,
  ChevronLeft,
  ChevronRight,
  Film,
  Zap,
  Music,
  Eye,
  MoreVertical,
  Layers,
  CalendarDays
} from "lucide-react";
import productApi from "../../../api/productApi";
import ProductForm from "./components/ProductForm";
import dayjs from "dayjs";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  const [searchText, setSearchText] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");

  const stats = useMemo(() => ({
    total: pagination.total,
    videos: products.length, // Just demo logic
    latest: products[0]?.title || "N/A"
  }), [pagination.total, products]);

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounce(searchText), 500);
    return () => clearTimeout(t);
  }, [searchText]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const params = {
        page: pagination.current - 1,
        size: pagination.pageSize,
      };

      let response;
      if (searchDebounce.trim()) {
        params.title = searchDebounce.trim();
        response = await productApi.search(params);
      } else {
        response = await productApi.getAll(params);
      }

      const data = response.data?.data || response.data || response;
      const list = data.list || data.content || [];

      setProducts(list);
      setPagination({
        current: (data.pageNumber || 0) + 1,
        pageSize: data.pageSize || pagination.pageSize,
        total: data.totalElements || 0,
      });
    } catch (err) {
      console.error(err);
      messageApi.error("Không thể tải danh sách sản phẩm!");
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchDebounce, messageApi]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (searchDebounce !== "") {
      setPagination((p) => ({ ...p, current: 1 }));
    }
  }, [searchDebounce]);

  const handlePageChange = (newPage) => {
    setPagination((p) => ({ ...p, current: newPage }));
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedProduct(record);
    setIsFormModalOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedProduct(record);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct?.id) return;
    try {
      await productApi.delete(selectedProduct.id);
      messageApi.success("Xóa sản phẩm thành công!");
      setIsDeleteModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMsg =
        error.response?.data?.message || "Không thể xóa sản phẩm!";
      messageApi.error(errorMsg);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedProduct) {
        await productApi.update(selectedProduct.id, values);
        messageApi.success("Cập nhật sản phẩm thành công!");
      } else {
        const payload = {
          ...values,
          createdAt: new Date().toISOString(),
        };
        await productApi.create(payload);
        messageApi.success("Tạo sản phẩm thành công!");
      }
      setIsFormModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMsg =
        error.response?.data?.message || "Không thể lưu sản phẩm!";
      messageApi.error(errorMsg);
    }
  };

  const getThumbnail = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop";
    const full = url.startsWith("http") ? url : `https://${url}`;
    const v = full.match(/[?&]v=([^&]+)/);
    if (v) return `https://img.youtube.com/vi/${v[1]}/maxresdefault.jpg`;
    if (full.includes("youtu.be/")) {
      return `https://img.youtube.com/vi/${full.split("youtu.be/")[1].split("?")[0]
        }/maxresdefault.jpg`;
    }
    if (full.includes("youtube.com/embed/")) {
      return `https://img.youtube.com/vi/${full.split("embed/")[1].split("?")[0]
        }/maxresdefault.jpg`;
    }
    return "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop";
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {contextHolder}

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6">
        {[
          { icon: <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" strokeWidth={1.5} />, label: "Tổng", value: stats.total, config: "bg-indigo-100 border border-indigo-200/60" },
          { icon: <Video className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" strokeWidth={1.5} />, label: "Video", value: stats.videos, config: "bg-emerald-100 border border-emerald-200/60" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-3 sm:p-7 rounded-2xl border border-slate-300 shadow-sm flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-5 group text-center sm:text-left">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl ${item.config} flex items-center justify-center`}>
              {item.icon}
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-slate-500 sm:text-slate-600 whitespace-nowrap">{item.label}</h4>
              <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[32px] border border-slate-300 shadow-sm space-y-6 sm:space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 pb-0 border-b border-slate-50">
          <h2 className="text-[17px] sm:text-[20px] font-bold text-slate-800 whitespace-nowrap mr-auto flex items-center gap-3">
            <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
            Thư viện sản phẩm
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-80 relative">
              <Input
                placeholder="Truy vấn dữ liệu..."
                className="h-10 pl-10 pr-4 bg-white border border-slate-200 rounded-xl font-medium text-[14px] text-slate-700"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                prefix={<Search size={16} className="text-slate-400 mr-2" />}
              />
            </div>
            <Button
              onClick={handleCreate}
              className="h-10 px-6 bg-slate-900 border-none font-bold text-[13px] sm:text-[14px] flex items-center gap-2 !text-white rounded-xl w-full sm:w-auto justify-center"
            >
              <Plus size={16} strokeWidth={3} />
              Đăng sản phẩm
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-8 pb-4">
          {loading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-5 space-y-5 animate-pulse">
                <div className="aspect-video bg-slate-50 rounded-2xl"></div>
                <div className="h-4 bg-slate-50 rounded-full w-3/4"></div>
                <div className="flex justify-between">
                  <div className="h-10 bg-slate-50 rounded-xl w-24"></div>
                  <div className="h-10 bg-slate-50 rounded-xl w-10"></div>
                </div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-40 text-slate-400 bg-slate-50/20 rounded-[40px] border border-dashed border-slate-200">
              <div className="w-24 h-24 rounded-3xl bg-white shadow-xl shadow-slate-200 flex items-center justify-center text-slate-200 mb-8">
                <Package size={48} strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {searchText ? "Không tìm thấy dữ liệu" : "Trung tâm lưu trữ trống"}
              </h3>
              <p className="text-[10px] font-black text-slate-400  max-w-xs text-center leading-relaxed">
                {searchText
                  ? "Vui lòng kiểm tra lại từ khóa hoặc thay đổi tiêu chí tìm kiếm"
                  : "Hệ thống chưa nhận được bản ghi sản phẩm nào từ bạn"}
              </p>
            </div>
          ) : (
            products.map((p) => (
              <div key={p.id} className="group bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={getThumbnail(p.videoUrl)}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] flex items-center justify-center">
                    <button
                      onClick={() => window.open(p.videoUrl, "_blank", "noopener,noreferrer")}
                      className="w-14 h-14 rounded-2xl bg-white text-slate-950 flex items-center justify-center shadow-2xl transform"
                    >
                      <Play size={20} fill="currentColor" strokeWidth={0} />
                    </button>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-slate-600 truncate">Tác giả: {p.author || "Chưa cập nhật"}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 text-[15px] leading-tight line-clamp-2 cursor-pointer">{p.title}</h3>
                  </div>

                  <div className="flex items-center justify-end pt-6 mt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Button
                        type="text"
                        onClick={() => handleEdit(p)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 p-0"
                      >
                        <Edit size={18} strokeWidth={2.5} />
                      </Button>
                      <Button
                        type="text"
                        onClick={() => handleDelete(p)}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 p-0"
                      >
                        <Trash2 size={18} strokeWidth={2.5} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {pagination.total > 0 && (
          <div className="p-8 bg-slate-50/50 border-t border-slate-100 rounded-[28px] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-black text-slate-600 shadow-sm flex items-center gap-2">
              <span>{Math.min(pagination.total, (pagination.current - 1) * pagination.pageSize + 1)} — {Math.min(pagination.current * pagination.pageSize, pagination.total)}</span>
              <span className="text-slate-200">/</span>
              <span className="text-slate-500">{pagination.total} Hồ sơ</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border-slate-200 text-slate-600 shadow-sm"
                disabled={pagination.current === 1}
                onClick={() => handlePageChange(pagination.current - 1)}
                icon={<ChevronLeft size={20} />}
              />
              <Button
                className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border-slate-200 text-slate-600 shadow-sm"
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                onClick={() => handlePageChange(pagination.current + 1)}
                icon={<ChevronRight size={20} />}
              />
            </div>
          </div>
        )}
      </div>

      <ProductForm
        open={isFormModalOpen}
        onCancel={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialValues={selectedProduct}
      />

      <Modal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        footer={null}
        width={440}
        centered
        closable={false}
        className="premium-admin-modal"
      >
        {selectedProduct && (
          <div className="p-8 space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-red-50 text-red-500 flex items-center justify-center shadow-xl shadow-red-100">
                <Trash2 size={32} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Loại bỏ sản phẩm</h3>
                <p className="text-[10px] font-black text-slate-400 mt-1">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-5">
              <img
                src={getThumbnail(selectedProduct.videoUrl)}
                alt={selectedProduct.title}
                className="w-24 h-16 rounded-xl object-cover shadow-sm grayscale"
              />
              <div className="overflow-hidden">
                <h4 className="text-xs font-black text-slate-900 truncate mb-1">
                  {selectedProduct.title}
                </h4>
                <div className="flex items-center gap-1.5 opacity-30">
                  <Film size={12} />
                  <span className="text-[9px] font-black">Video Content</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 h-16 rounded-2xl bg-white border border-slate-100 text-slate-900 font-bold text-[10px] shadow-sm"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 h-16 rounded-2xl bg-red-600 text-white font-bold text-[10px] shadow-xl shadow-red-200"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductManagement;
