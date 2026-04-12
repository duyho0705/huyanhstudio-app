import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";

const data = [
  { name: "Mon", income: 4000 },
  { name: "Tue", income: 3000 },
  { name: "Wed", income: 2000 },
  { name: "Thu", income: 2780 },
  { name: "Fri", income: 1890 },
  { name: "Sat", income: 2390 },
  { name: "Sun", income: 3490 },
];

const AdminRevenueChart = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Kinh doanh & Doanh thu</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Thống kê lưu lượng giao dịch tiền tệ</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-xl text-green-600 text-[10px] font-black uppercase tracking-widest border border-green-100">
                <TrendingUp size={12} />
                +14.5% So với tháng trước
            </div>
            <select className="px-5 py-3.5 bg-slate-50 border-none rounded-xl text-xs font-black text-slate-900 uppercase tracking-widest focus:ring-4 focus:ring-slate-100 transition-all cursor-pointer shadow-inner">
              <option>7 ngày gần nhất</option>
              <option>Tháng hiện tại</option>
              <option>Báo cáo năm nay</option>
            </select>
        </div>
      </div>

      <div className="h-[350px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={10}
              fontWeight={900}
              tickLine={false}
              axisLine={false}
              dy={15}
              textAnchor="middle"
              className="uppercase tracking-widest font-black"
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={10}
              fontWeight={900}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              className="font-black"
            />
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#f1f5f9"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(12px)",
                borderRadius: "24px",
                border: "1px solid #f1f5f9",
                boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)",
                padding: "16px",
              }}
              itemStyle={{ color: "#0f172a", fontWeight: "900", fontSize: "14px", textTransform: "uppercase" }}
              labelStyle={{ color: "#94a3b8", fontWeight: "900", marginBottom: "8px", textTransform: "uppercase" }}
              cursor={{ stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#2563eb"
              fillOpacity={1}
              fill="url(#colorIncome)"
              strokeWidth={4}
              animationDuration={2000}
              activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff', fill: '#2563eb', shadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminRevenueChart;
