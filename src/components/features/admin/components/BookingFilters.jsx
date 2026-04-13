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
            className="w-[220px] h-12 [&_.ant-select-selector]:!rounded-[40px] [&_.ant-select-selector]:!border-2 [&_.ant-select-selector]:!border-slate-200 [&_.ant-select-selection-placeholder]:!text-slate-700 [&_.ant-select-selection-placeholder]:!font-semibold [&_.ant-select-selection-placeholder]:!text-center [&_.ant-select-selection-item]:!font-semibold [&_.ant-select-selection-item]:!text-slate-700 [&_.ant-select-selection-item]:!text-center"
            allowClear
            variant="outlined"
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
            className="h-12 bg-white px-2 font-semibold !rounded-[40px] border-2 border-slate-200 [&_.ant-picker-input_input::placeholder]:!text-slate-700 [&_.ant-picker-input_input]:!font-semibold [&_.ant-picker-input_input]:!text-slate-700 [&_.ant-picker-input_input]:!text-center"
            suffixIcon={<CalendarDays size={20} className="text-slate-500" />}
          />

          <button 
            onClick={onClear}
            className="h-12 px-8 flex items-center gap-2 text-slate-700 font-semibold text-[15px] bg-white border-2 border-slate-200 rounded-[30px] transition-all"
          >
            <FilterX size={14} />
            Xóa bộ lọc
          </button>

          {selectedRowKeys.length > 0 && (
            <button 
              onClick={onBulkDelete}
              className="h-12 px-6 flex items-center gap-2 bg-red-50 text-red-600 font-semibold text-[15px] border border-red-100 rounded-[30px] animate-in zoom-in-95 duration-200"
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
