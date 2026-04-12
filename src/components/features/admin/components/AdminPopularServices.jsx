import { Music, Camera, Video, Mic, Star, TrendingUp, TrendingDown } from "lucide-react";

const services = [
  {
    id: 1,
    name: "Thu âm bài hát",
    bookings: 124,
    growth: "+12%",
    icon: <Mic size={22} />,
    color: "from-blue-600 to-indigo-700",
    bg: "bg-blue-50"
  },
  {
    id: 2,
    name: "Chụp ảnh Profile",
    bookings: 85,
    growth: "+5%",
    icon: <Camera size={22} />,
    color: "from-pink-600 to-rose-700",
    bg: "bg-pink-50"
  },
  {
    id: 3,
    name: "Quay phim MV",
    bookings: 62,
    growth: "+8%",
    icon: <Video size={22} />,
    color: "from-cyan-600 to-blue-700",
    bg: "bg-cyan-50"
  },
  {
    id: 4,
    name: "Hòa âm phối khí",
    bookings: 45,
    growth: "-2%",
    icon: <Music size={22} />,
    color: "from-emerald-600 to-teal-700",
    bg: "bg-emerald-50"
  },
];

const AdminPopularServices = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Star size={24} />
          </div>
          <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Dịch vụ nổi bật</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Top hạng mục có tỷ lệ chuyển đổi cao</p>
          </div>
        </div>
        
        <div className="hidden sm:block">
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-4 py-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all">Chi tiết dữ liệu</button>
        </div>
      </div>
      
      <div className="space-y-5">
        {services.map((service) => (
          <div key={service.id} className="flex items-center justify-between p-5 rounded-3xl bg-slate-50 border border-transparent transition-all hover:bg-white hover:border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 group">
            <div className="flex items-center gap-5">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
                {service.icon}
              </div>
              <div className="flex flex-col">
                <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight mb-1">{service.name}</h4>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{service.bookings} Lượt Bookings</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Premium</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
                <div
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-1.5 ${
                    service.growth.startsWith("+") 
                      ? "bg-green-50 text-green-600 border border-green-100" 
                      : "bg-red-50 text-red-600 border border-red-100"
                  }`}
                >
                  {service.growth.startsWith("+") ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {service.growth}
                </div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-2">{service.growth.startsWith("+") ? "Thịnh hành" : "Sụt giảm"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPopularServices;
