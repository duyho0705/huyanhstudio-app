import { useState, useEffect, useCallback } from "react";
import { message, Button, Modal, Input } from "antd";
import {
  Edit,
  Trash2,
  Search,
  Package,
  Plus,
  Video,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Play,
  Film,
  Zap,
  LayoutGrid
} from "lucide-react";
import productApi from "../../../api/productApi";
import ProductForm from "./components/ProductForm";

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
      return `https://img.youtube.com/vi/${
        full.split("youtu.be/")[1].split("?")[0]
      }/maxresdefault.jpg`;
    }
    if (full.includes("youtube.com/embed/")) {
      return `https://img.youtube.com/vi/${
        full.split("embed/")[1].split("?")[0]
      }/maxresdefault.jpg`;
    }
    return "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop";
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {contextHolder}

      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
            <div className="w-1.5 h-12 bg-slate-900 rounded-full"></div>
            <div>
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Thư viện sản phẩm</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">Hệ thống lưu trữ & phân phối nội dung video</p>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 lg:max-w-2xl">
          <div className="relative w-full">
            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Truy vấn dữ liệu sản phẩm..."
              className="w-full h-16 pl-14 pr-6 bg-slate-50 border-none rounded-2xl font-bold focus:bg-white focus:ring-4 focus:ring-slate-100 transition-all shadow-inner"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </div>
          <Button
            type="primary"
            onClick={handleCreate}
            className="h-16 px-8 bg-slate-900 hover:bg-slate-800 rounded-2xl border-none font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 flex items-center gap-3 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} strokeWidth={3} />
            Đăng sản phẩm mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] border border-slate-100 p-5 space-y-5 animate-pulse">
                <div className="aspect-video bg-slate-50 rounded-2xl"></div>
                <div className="h-4 bg-slate-50 rounded-full w-3/4"></div>
                <div className="flex justify-between">
                    <div className="h-10 bg-slate-50 rounded-xl w-24"></div>
                    <div className="h-10 bg-slate-50 rounded-xl w-10"></div>
                </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-40 text-slate-400 bg-slate-50/50 rounded-[4rem] border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 rounded-[2rem] bg-white shadow-xl shadow-slate-200 flex items-center justify-center text-slate-200 mb-8">
                <Package size={48} strokeWidth={1} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-2">
              {searchText ? "Không tìm thấy dữ liệu" : "Trung tâm lưu trữ trống"}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] max-w-xs text-center leading-relaxed">
              {searchText
                ? "Vui lòng kiểm tra lại từ khóa hoặc thay đổi tiêu chí tìm kiếm"
                : "Hệ thống chưa nhận được bản ghi sản phẩm nào từ bạn"}
            </p>
          </div>
        ) : (
          products.map((p) => (
            <div key={p.id} className="group bg-white rounded-[2.5rem] border border-slate-100 hover:border-slate-900 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-slate-200 overflow-hidden flex flex-col">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={getThumbnail(p.videoUrl)}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center">
                  <button
                    onClick={() => window.open(p.videoUrl, "_blank", "noopener,noreferrer")}
                    className="w-16 h-16 rounded-[2rem] bg-white text-slate-950 flex items-center justify-center shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 hover:scale-110 active:scale-90"
                  >
                    <Play size={24} fill="currentColor" strokeWidth={0} />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                    <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-900 border border-white shadow-sm flex items-center gap-1.5">
                        <Film size={10} />
                        RAW Content
                    </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex flex-col mb-6">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1.5">Sản phẩm hệ thống</span>
                    <h3 className="font-black text-slate-900 leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{p.title}</h3>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                   <button
                        onClick={() => handleEdit(p)}
                        className="flex-1 h-12 rounded-2xl bg-slate-50 text-slate-900 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px] border border-transparent shadow-sm"
                    >
                        <Edit size={14} />
                        Cập nhật
                    </button>
                    <button
                        onClick={() => handleDelete(p)}
                        className="w-12 h-12 ml-3 rounded-2xl bg-white text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center border border-slate-100"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.total > 0 && (
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="px-8 py-3.5 bg-slate-50 rounded-[1.5rem] text-[11px] font-black text-slate-400 uppercase tracking-widest shadow-inner">
            Dữ liệu sản phẩm 
            <span className="text-slate-900 mx-3">{Math.min(pagination.total, (pagination.current - 1) * pagination.pageSize + 1)} — {Math.min(pagination.current * pagination.pageSize, pagination.total)}</span>
            <span className="mx-2 text-slate-200">/</span>
            {pagination.total} Bản ghi
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
              disabled={pagination.current === 1}
              onClick={() => handlePageChange(pagination.current - 1)}
              icon={<ChevronLeft size={24} />}
            />
            <div className="flex items-center bg-white border border-slate-100 rounded-[1.5rem] p-1 shadow-sm font-black text-xs h-14">
              <span className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200">
                {pagination.current}
              </span>
              <span className="px-6 text-[10px] uppercase tracking-[0.2em] text-slate-300">Của</span>
              <span className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-500 rounded-2xl">
                {Math.ceil(pagination.total / pagination.pageSize) || 1}
              </span>
            </div>
            <Button
              className="h-14 w-14 flex items-center justify-center rounded-2xl bg-white border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => handlePageChange(pagination.current + 1)}
              icon={<ChevronRight size={24} />}
            />
          </div>
        </div>
      )}

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
        width={500}
        centered
        closable={false}
        className="premium-admin-modal"
      >
        {selectedProduct && (
          <div className="p-8 space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-[2rem] bg-red-50 text-red-500 flex items-center justify-center shadow-xl shadow-red-100">
                    <Trash2 size={32} strokeWidth={2.5} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase">Loại bỏ sản phẩm</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Hành động này không thể hoàn tác</p>
                </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-5">
              <img
                src={getThumbnail(selectedProduct.videoUrl)}
                alt={selectedProduct.title}
                className="w-24 h-16 rounded-xl object-cover shadow-sm grayscale"
              />
              <div className="overflow-hidden">
                <h4 className="text-xs font-black text-slate-900 uppercase truncate mb-1">
                  {selectedProduct.title}
                </h4>
                <div className="flex items-center gap-1.5 grayscale opacity-50">
                    {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-1 bg-red-500 rounded-full"></div>)}
                </div>
              </div>
            </div>

            <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100">
                <p className="text-red-600/80 text-[11px] font-bold text-center leading-relaxed">
                  Sản phẩm sẽ bị xóa vĩnh viễn khỏi kho lưu trữ và các liên kết liên quan. Bạn có chắc chắn muốn xóa không?
                </p>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="flex-1 h-16 rounded-2xl bg-white border border-slate-100 text-slate-900 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all shadow-sm"
                >
                    Hủy bỏ
                </button>
                <button 
                    onClick={confirmDelete}
                    className="flex-1 h-16 rounded-2xl bg-red-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-red-700 transition-all shadow-xl shadow-red-200"
                >
                    Xác nhận xóa
                </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductManagement;
