import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const AdminDropdown = ({ options, value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 sm:gap-3 h-8 sm:h-9 px-3 sm:px-4 bg-white border border-blue-500 rounded-lg text-[12px] sm:text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-all min-w-[120px] sm:min-w-[150px] shadow-sm active:scale-[0.98]"
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={3}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1.5 w-full min-w-[180px] bg-white border border-slate-100 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-[13px] font-medium transition-all ${value === option.value
                ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-500'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDropdown;
