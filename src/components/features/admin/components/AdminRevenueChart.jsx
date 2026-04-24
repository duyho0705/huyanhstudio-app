import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarDays } from "lucide-react";
import { useEffect, useState } from "react";
import AdminDropdown from "./AdminDropdown";
import statsApi from "../../../../api/statsApi";
import { useTranslation } from "react-i18next";

const AdminRevenueChart = () => {
  const { t, i18n } = useTranslation();
  const [timeframe, setTimeframe] = useState("7days");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const timeframeOptions = [
    { value: "7days", label: t('admin.dashboard.trend_7days') },
    { value: "month", label: t('admin.dashboard.trend_month') },
  ];

  useEffect(() => {
    fetchTrendData();
  }, [timeframe]);

  const fetchTrendData = async () => {
    try {
      setLoading(true);
      const response = await statsApi.getBookingTrend({ timeframe });
      
      const apiRes = response.data?.data || response.data || response;
      
      const dayMap = {
        "Thứ Hai": "Mon",
        "Thứ Ba": "Tue",
        "Thứ Tư": "Wed",
        "Thứ Năm": "Thu",
        "Thứ Sáu": "Fri",
        "Thứ Bảy": "Sat",
        "Chủ Nhật": "Sun"
      };

      const mappedData = Array.isArray(apiRes) ? apiRes.map(item => ({
        name: i18n.language === 'en' ? (dayMap[item.label] || item.label) : item.label,
        bookings: item.count || 0
      })) : [];
      
      setChartData(mappedData);
    } catch (error) {
      console.error("Error fetching booking trend:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <CalendarDays size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 className="text-[15px] sm:text-[17px] font-bold text-slate-900 leading-tight">{t('admin.dashboard.trend_title')}</h3>
            <p className="text-[12px] sm:text-[13px] font-medium text-slate-500 mt-0.5 hidden sm:block">{t('admin.dashboard.trend_desc')}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
            <AdminDropdown 
              options={timeframeOptions} 
              value={timeframe} 
              onChange={setTimeframe} 
            />
        </div>
      </div>

      <div className="h-[220px] sm:h-[280px] lg:h-[300px] w-full mt-2 sm:mt-4">
        {loading ? (
          <div className="w-full h-full p-4 space-y-6">
            <div className="h-full w-full bg-slate-50 border border-slate-100 rounded-[32px] relative overflow-hidden">
               {/* Skeleton grid lines */}
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="absolute w-full h-[1px] bg-slate-200/40" style={{ top: `${i * 20}%` }}></div>
               ))}
               <div className="absolute inset-0 flex items-end px-4 pb-4">
                  <div className="w-full h-[60%] bg-gradient-to-t from-purple-100/50 to-transparent rounded-t-3xl animate-pulse"></div>
               </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="99%" height="100%" debounce={50}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                fontWeight={700}
                tickLine={false}
                axisLine={false}
                dy={12}
                interval={timeframe === "month" ? 6 : 0}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                fontWeight={700}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                tickFormatter={(value) => `${value}`}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 flex flex-col gap-1">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                        <p className="text-[16px] font-black text-purple-600">
                          {payload[0].value} {t('admin.dashboard.unit_booking')}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ stroke: '#8b5cf6', strokeWidth: 2, strokeDasharray: '6 6' }}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorBookings)"
                strokeWidth={5}
                activeDot={{ r: 7, strokeWidth: 0, fill: '#7c3aed' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdminRevenueChart;
