import React from "react";
import { Input, Select, DatePicker, Button, Tag } from "antd";
import {
  Clock,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  FilterX,
  Trash2,
  Search as SearchIcon,
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
        <div className="w-full sm:w-80">
          <Input
            placeholder="Truy vấn đơn hàng..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="h-10 rounded-xl font-medium text-[14px] text-slate-700 bg-white placeholder:font-medium placeholder:text-slate-400"
            prefix={<SearchIcon size={16} className="text-slate-400 mr-2" />}
            allowClear
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Select
          placeholder={<span className="font-semibold text-slate-600">Lọc trạng thái</span>}
          value={filters.status}
          onChange={(val) => onFilterChange("status", val)}
          className="w-full sm:w-[180px] h-10 rounded-xl"
          allowClear
        >
          {bookingStatuses.map((s) => (
            <Option key={s.value} value={s.value}>
              <div className="flex items-center gap-2 font-semibold text-[14px] text-slate-700">
                {getStatusIcon(s.value)}
                <span>{s.label}</span>
              </div>
            </Option>
          ))}
        </Select>

        <div className="w-full sm:w-auto">
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
            className="h-10 w-full sm:w-auto bg-white px-3 font-semibold !rounded-xl border border-slate-200"
            suffixIcon={<CalendarDays size={18} className="text-slate-500" />}
          />
        </div>

        <Button
          onClick={onClear}
          className="h-10 px-4 flex items-center gap-2 text-slate-600 font-semibold text-[14px] bg-white border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-600 transition-all"
          icon={<FilterX size={16} />}
        >
          Làm mới
        </Button>

        {selectedRowKeys.length > 0 && (
          <Button
            onClick={onBulkDelete}
            danger
            type="primary"
            className="h-10 px-4 flex items-center gap-2 font-semibold text-[14px] rounded-xl animate-in zoom-in-95"
            icon={<Trash2 size={16} />}
          >
            Xóa ({selectedRowKeys.length})
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingFilters;
