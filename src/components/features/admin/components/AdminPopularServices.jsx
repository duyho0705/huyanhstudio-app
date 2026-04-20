import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import serviceApi from "../../../../api/serviceApi";

const AdminPopularServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await serviceApi.admin.getAll({ page: 0, size: 4 });
        const apiRes = res?.data || res;
        const mainData = apiRes.data !== undefined ? apiRes.data : apiRes;
        const list = Array.isArray(mainData) ? mainData : (mainData?.content || mainData?.list || []);

        setServices(list);
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  const formatPrice = (price) => {
    if (!price) return "Thỏa thuận";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-[16px] font-bold text-slate-900 leading-tight">Dịch vụ hiện có</h3>
            <p className="text-[14px] font-medium text-slate-400 mt-0.5">Danh sách dịch vụ đang vận hành tại Studio</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {services.length > 0 ? services.map((service) => (
          <div key={service.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 transition-all group shadow-sm">
            <div className="flex flex-col min-w-0">
              <h4 className="font-bold text-slate-800 text-[14px] leading-tight mb-1 truncate group-hover:text-blue-600 transition-colors">
                {service.name}
              </h4>
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${service.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <span className="text-[14px] font-medium text-slate-500">
                  {service.active ? 'Đang hoạt động' : 'Tạm dừng'}
                </span>
              </div>
            </div>

            <div className="text-[14px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
              {formatPrice(service.price)}
            </div>
          </div>
        )) : (
          <div className="text-center py-10 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-3xl">
            Chưa có dịch vụ nào
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPopularServices;
