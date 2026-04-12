import React from "react";
import { Input, Select, DatePicker, Button, Tag } from "antd";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  FilterX,
  Trash2,
  CalendarDays
} from "lucide-react";
import dayjs from "dayjs";

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const BookingFilters = ({
  filters,
  onFilterChange,
  onDateRangeChange,
  onClear,
  bookingStatuses,
  selectedRowKeys,
  onBulkDelete,
  showSearch = true,
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDING": return <Clock size={14} />;
      case "CONFIRMED": return <CalendarIcon size={14} />;
      case "COMPLETED": return <CheckCircle size={14} />;
      case "CANCELLED": return <XCircle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {showSearch && (
        <div className="w-full sm:w-auto">
            <Search
              placeholder="Tìm kiếm..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="search-input-custom"
              size="large"
              style={{ width: 300 }}
              allowClear
            />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
          <Select
            placeholder="Lọc trạng thái"
            value={filters.status}
            onChange={(val) => onFilterChange("status", val)}
            className="w-[200px] h-12 flex items-center select-custom-xl rounded-xl"
            allowClear
            variant="filled"
          >
            {bookingStatuses.map((s) => (
              <Option key={s.value} value={s.value}>
                <div className="flex items-center gap-2 font-medium">
                  {getStatusIcon(s.value)}
                  <span>{s.label}</span>
                </div>
              </Option>
            ))}
          </Select>

          <RangePicker
            format="DD/MM/YYYY"
            value={
              filters.fromDate && filters.toDate
                ? [dayjs(filters.fromDate), dayjs(filters.toDate)]
                : null
            }
            onChange={onDateRangeChange}
            separator={<div className="text-slate-300 mx-1">—</div>}
            placeholder={["Từ ngày", "Đến ngày"]}
            className="h-12 border-slate-100 bg-slate-50/50 rounded-xl px-4 hover:border-blue-300 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all font-medium"
            suffixIcon={<CalendarDays size={16} className="text-slate-400" />}
          />

          <button 
            onClick={onClear}
            className="h-12 px-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black uppercase tracking-widest text-[10px] bg-white border border-slate-100 rounded-xl transition-all active:scale-95"
          >
            <FilterX size={14} />
            Xóa bộ lọc
          </button>

          {selectedRowKeys.length > 0 && (
            <button 
              onClick={onBulkDelete}
              className="h-12 px-6 flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-black uppercase tracking-widest text-[10px] border border-red-100 rounded-xl transition-all active:scale-95 animate-in zoom-in-95 duration-200"
            >
              <Trash2 size={14} />
              Xóa đã chọn ({selectedRowKeys.length})
            </button>
          )}
      </div>
    </div>
  );
};

export default BookingFilters;
