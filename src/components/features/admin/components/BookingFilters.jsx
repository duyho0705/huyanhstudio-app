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
  children
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
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-2 xl:gap-3 w-full">
      {showSearch && (
        <div className="w-full xl:max-w-[280px] flex-1">
          <Input
            placeholder="Tìm mã, tên..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="h-9 xl:h-10 w-full rounded-xl font-medium text-[13px] xl:text-[14px] text-slate-700 bg-white"
            prefix={<SearchIcon size={14} className="text-slate-400 mr-1" />}
            allowClear
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full xl:w-auto flex-1">
        <div className="col-span-1 sm:col-span-1">
          <RangePicker
            format="DD/MM/YYYY"
            value={
              filters.fromDate && filters.toDate
                ? [dayjs(filters.fromDate), dayjs(filters.toDate)]
                : null
            }
            onChange={onDateRangeChange}
            separator={<span className="text-slate-300 text-[10px]">to</span>}
            placeholder={["Từ", "Đến"]}
            className="h-9 xl:h-10 w-full xl:w-[220px] bg-white px-2 font-medium !rounded-xl border-slate-200 text-[13px]"
            suffixIcon={<CalendarDays size={14} className="text-slate-400" />}
          />
        </div>

        <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
          <Select
            placeholder={<span className="font-semibold text-slate-500">Trạng thái</span>}
            value={filters.status}
            onChange={(val) => onFilterChange("status", val)}
            className="flex-1 xl:w-[130px] h-9 xl:h-10 rounded-xl"
            allowClear
          >
            {bookingStatuses.map((s) => (
              <Option key={s.value} value={s.value}>
                <div className="flex items-center gap-2 font-medium text-[13px] text-slate-700">
                  {getStatusIcon(s.value)}
                  <span className="truncate">{s.label}</span>
                </div>
              </Option>
            ))}
          </Select>

          <Button
            onClick={onClear}
            className="h-9 px-3 flex items-center justify-center gap-1.5 text-slate-600 font-semibold text-[13px] bg-white border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-600 transition-all"
            icon={<FilterX size={15} />}
          >
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {selectedRowKeys.length > 0 && (
            <Button
              onClick={onBulkDelete}
              danger
              type="primary"
              className="h-9 px-3 flex items-center justify-center gap-1.5 font-semibold text-[13px] rounded-xl animate-in zoom-in-95"
              icon={<Trash2 size={15} />}
            >
              <span className="hidden sm:inline">Xóa</span> ({selectedRowKeys.length})
            </Button>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default BookingFilters;
