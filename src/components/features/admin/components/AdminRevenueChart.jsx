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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BarChart3 size={20} />
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-slate-900 leading-tight">Doanh thu & Kinh doanh</h3>
            <p className="text-[13px] font-medium text-slate-500 mt-0.5">Thống kê lưu lượng giao dịch tiền tệ</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-lg text-green-600 text-[13px] font-semibold">
                <TrendingUp size={16} />
                +14.5% Tháng trước
            </div>
            <select className="h-9 px-3 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 focus:ring-0 focus:border-blue-500 transition-all cursor-pointer outline-none">
              <option>7 ngày gần nhất</option>
              <option>Tháng hiện tại</option>
              <option>Năm nay</option>
            </select>
        </div>
      </div>

      <div className="h-[300px] w-full mt-4">
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
              fontSize={12}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              fontWeight={500}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.98)",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                padding: "12px",
              }}
              itemStyle={{ color: "#0f172a", fontWeight: "600", fontSize: "14px" }}
              labelStyle={{ color: "#64748b", fontWeight: "500", marginBottom: "4px" }}
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#2563eb"
              fillOpacity={1}
              fill="url(#colorIncome)"
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminRevenueChart;
