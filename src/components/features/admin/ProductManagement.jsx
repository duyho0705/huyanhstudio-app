import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
  CalendarDays,
  AlertTriangle
} from "lucide-react";
import productApi from "../../../api/productApi";
import ProductForm from "./components/ProductForm";
import dayjs from "dayjs";

const ProductManagement = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [messageApi, contextHolder] = message.useMessage();

  const [searchText, setSearchText] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");

  const stats = useMemo(() => ({
    total: pagination.total,
    videos: products.length, 
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
      messageApi.error(t('admin.products.errors.load_fail'));
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchDebounce, messageApi, t]);

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
      messageApi.success(t('common.delete_success'));
      setIsDeleteModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      const errorMsg = error.response?.data?.message || t('admin.products.errors.delete_fail');
      messageApi.error(errorMsg);
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      if (selectedProduct) {
        await productApi.update(selectedProduct.id, values);
        messageApi.success(t('common.update_success'));
      } else {
        const payload = {
          ...values,
          createdAt: new Date().toISOString(),
        };
        await productApi.create(payload);
        messageApi.success(t('common.create_success'));
      }
      setIsFormModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      const errorMsg = error.response?.data?.message || t('admin.products.errors.save_fail');
      messageApi.error(errorMsg);
    }
  };

  const getThumbnail = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop";
    const full = url.startsWith("http") ? url : `https://${url}`;
    const v = full.match(/[?&]v=([^&]+)/);
    if (v) return `https://img.youtube.com/vi/${v[1]}/maxresdefault.jpg`;
    if (full.includes("youtu.be/")) {
      return `https://img.youtube.com/vi/${full.split("youtu.be/")[1].split("?")[0]}/maxresdefault.jpg`;
    }
    if (full.includes("youtube.com/embed/")) {
      return `https://img.youtube.com/vi/${full.split("embed/")[1].split("?")[0]}/maxresdefault.jpg`;
    }
    return "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop";
  };

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-500">
      {contextHolder}

      {/* Stats Section */}
      <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6">
        {loading ? (
          [1, 2].map((i) => (
            <div key={i} className="bg-white p-3 sm:p-7 rounded-2xl border border-slate-300 shadow-sm animate-pulse flex items-center gap-3 sm:gap-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-100"></div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-slate-50 rounded"></div>
                <div className="h-6 w-12 bg-slate-100 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          [
            { icon: <LayoutGrid className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" strokeWidth={1.5} />, label: t('admin.products.stats_total'), value: stats.total, config: "bg-indigo-100 border border-indigo-200/60" },
            { icon: <Video className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" strokeWidth={1.5} />, label: t('admin.products.stats_videos'), value: stats.videos, config: "bg-emerald-100 border border-emerald-200/60" },
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
          ))
        )}
      </div>

      <div className="bg-white p-4 sm:p-8 rounded-[32px] border border-slate-300 shadow-sm space-y-6 sm:space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 pb-0 border-b border-slate-50">
          <h2 className="text-[17px] sm:text-[20px] font-bold text-slate-800 whitespace-nowrap mr-auto flex items-center gap-3">
            <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full"></div>
            {t('admin.products.title')}
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-80 relative">
              <Input
                placeholder={t('admin.products.search_placeholder')}
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
              {t('admin.products.add_btn')}
            </Button>
          </div>
        </div>

        <div className="rounded-[28px] border-2 border-slate-200 overflow-hidden bg-white shadow-inner">
          <div className="p-3 sm:p-8">
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
                <div className="col-span-full flex flex-col items-center justify-center py-40 text-slate-400">
                  <div className="w-24 h-24 rounded-3xl bg-white shadow-xl shadow-slate-200 flex items-center justify-center text-slate-200 mb-8">
                    <Package size={48} strokeWidth={1} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">
                    {searchText ? t('admin.products.empty_search') : t('admin.products.empty_library')}
                  </h3>
                  <p className="text-[14px] font-black text-slate-400 max-w-xs text-center leading-relaxed">
                    {searchText
                      ? t('admin.products.empty_search_desc')
                      : t('admin.products.empty_library_desc')}
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
                          <span className="text-[14px] font-semibold text-slate-600 truncate">{t('admin.products.author')}: {p.author || t('admin.products.not_updated')}</span>
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
          </div>

          {pagination.total > 0 && (
            <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="px-3 py-1 bg-white border border-slate-100 rounded-xl text-[13px] font-medium text-slate-500 shadow-sm">
                <span>{t('admin.bookings.display')} {pagination.current} / {Math.ceil(pagination.total / (pagination.pageSize || 10))}</span>
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
                  icon={<ChevronRight size={16} />}
                />
              </div>
            </div>
          )}
        </div>
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
        centered
        width={540}
        closable={false}
        className="premium-delete-modal"
      >
        <div className="space-y-4 sm:space-y-8">
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-[20px] sm:text-[26px] font-bold text-slate-900 leading-tight">{t('admin.products.delete_title')}</h3>
            <p className="text-[14px] sm:text-[15px] text-slate-500 leading-relaxed font-medium">
              {t('admin.products.delete_desc')}
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-3">
              <label className="text-[14px] sm:text-[15px] font-semibold text-slate-700">
                {t('admin.products.delete_confirm_label')}: <span className="text-red-500">"{selectedProduct?.title}"</span>
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={t('admin.bookings.confirm_placeholder')}
                className="h-10 sm:h-12 rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-100 font-medium text-[13px] sm:text-[15px]"
              />
            </div>

            <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-5 bg-red-50 rounded-2xl border border-red-100">
              <div className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={12} sm:size={16} strokeWidth={2.5} />
              </div>
              <p className="text-[13px] sm:text-[15px] font-medium text-red-800 leading-relaxed">
                {t('admin.products.delete_warning')}
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
              disabled={deleteConfirmText !== selectedProduct?.title}
              className={`flex-[1.5] h-9 rounded-xl font-medium text-[13px] shadow-lg shadow-red-100 transition-all ${deleteConfirmText === selectedProduct?.title
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

export default ProductManagement;
