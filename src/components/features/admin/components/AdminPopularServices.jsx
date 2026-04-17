import { Music, Camera, Video, Mic, Star, TrendingUp, TrendingDown } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Thu âm bài hát",
    bookings: 124,
    growth: "+12%",
    icon: <Mic size={20} />,
    color: "from-blue-600 to-indigo-700",
    bg: "bg-blue-50"
  },
  {
    id: 2,
    name: "Chụp ảnh Profile",
    bookings: 85,
    growth: "+5%",
    icon: <Camera size={20} />,
    color: "from-pink-600 to-rose-700",
    bg: "bg-pink-50"
  },
  {
    id: 3,
    name: "Quay phim MV",
    bookings: 62,
    growth: "+8%",
    icon: <Video size={20} />,
    color: "from-cyan-600 to-blue-700",
    bg: "bg-cyan-50"
  },
  {
    id: 4,
    name: "Hòa âm phối khí",
    bookings: 45,
    growth: "-2%",
    icon: <Music size={20} />,
    color: "from-emerald-600 to-teal-700",
    bg: "bg-emerald-50"
  },
];

const AdminPopularServices = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Star size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-[15px] sm:text-[17px] font-semibold text-slate-900 leading-tight">Dịch vụ nổi bật</h3>
            <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-0.5 hidden sm:block">Top hạng mục có tỷ lệ chuyển đổi cao</p>
          </div>
        </div>

        <div className="hidden sm:block">
          <button className="text-[13px] font-semibold text-blue-600 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all">Chi tiết dữ liệu</button>
        </div>
      </div>

      <div className="space-y-2.5 sm:space-y-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm transition-all group">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 shrink-0`}>
                {service.icon}
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-semibold text-slate-900 text-[13px] sm:text-[14px] leading-tight mb-0.5 sm:mb-1 truncate">{service.name}</h4>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-[11px] sm:text-[13px] font-medium text-slate-500">{service.bookings} lượt</span>
                  <div className="w-1 h-1 rounded-full bg-slate-300 hidden sm:block"></div>
                  <span className="text-[11px] sm:text-[13px] font-medium text-slate-900 hidden sm:inline">Premium</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-0.5 sm:gap-1 shrink-0 ml-2">
              <div
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-[13px] font-semibold flex items-center gap-1 sm:gap-1.5 ${service.growth.startsWith("+")
                    ? "bg-green-50 text-green-600 border border-green-100"
                    : "bg-red-50 text-red-600 border border-red-100"
                  }`}
              >
                {service.growth.startsWith("+") ? <TrendingUp size={12} className="sm:w-3.5 sm:h-3.5" /> : <TrendingDown size={12} className="sm:w-3.5 sm:h-3.5" />}
                {service.growth}
              </div>
              <span className="text-[10px] sm:text-[12px] font-medium text-slate-400">{service.growth.startsWith("+") ? "Thịnh hành" : "Sụt giảm"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPopularServices;
