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
      case "PENDING": return <Clock size={13} />;
      case "CONFIRMED": return <CalendarIcon size={13} />;
      case "COMPLETED": return <CheckCircle size={13} />;
      case "CANCELLED": return <XCircle size={13} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-2 xl:gap-3 w-full">
      {showSearch && (
        <div className="w-full xl:max-w-[280px]">
          <Input
            placeholder="Tìm mã, tên..."
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="h-9 xl:h-10 w-full rounded-xl font-medium text-[13px] xl:text-[14px] text-slate-700 bg-white border-slate-200"
            prefix={<SearchIcon size={13} className="text-slate-400 mr-1" />}
            allowClear
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch gap-2 flex-1">
        <div className="w-full sm:w-auto sm:flex-1">
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
            className="h-9 xl:h-10 w-full bg-white px-2 font-medium !rounded-xl border-slate-200 text-[13px]"
            suffixIcon={<CalendarDays size={13} className="text-slate-400" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto sm:flex-1">
          <Select
            placeholder={<span className="font-medium text-slate-500 text-[13px]">Trạng thái</span>}
            value={filters.status}
            onChange={(val) => onFilterChange("status", val)}
            className="flex-1 xl:w-[130px] h-9 xl:h-10 rounded-xl"
            allowClear
            dropdownStyle={{ borderRadius: '12px' }}
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
            className="h-9 w-9 sm:w-auto sm:px-3 flex items-center justify-center gap-1.5 text-slate-600 font-medium text-[13px] bg-white border border-slate-200 rounded-xl hover:text-blue-600 hover:border-blue-600 transition-all p-0"
            icon={<FilterX size={15} />}
          >
            <span className="hidden sm:inline">Lọc lại</span>
          </Button>

          {selectedRowKeys.length > 0 && (
            <Button
              onClick={onBulkDelete}
              danger
              type="primary"
              className="h-9 px-3 flex items-center justify-center gap-1.5 font-medium text-[13px] rounded-xl"
              icon={<Trash2 size={15} />}
            >
              <span className="hidden sm:inline font-medium">Xóa</span> ({selectedRowKeys.length})
            </Button>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default BookingFilters;
