"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X, Check } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  searchPlaceholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export default function SearchableDropdown({
  value,
  onChange,
  options,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  icon,
  disabled = false,
  className = "",
  size = "md",
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find(o => o.value === value);
  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setOpen(false);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setQuery("");
  };

  const py = size === "sm" ? "py-1.5" : "py-2";
  const text = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(o => !o); } }}
        className={`flex items-center gap-2 w-full ${py} pl-3 pr-8 rounded-xl border ${text} transition-colors text-left
          ${disabled
            ? "border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
            : open
              ? "border-emerald-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer"
          }`}
      >
        {icon && <span className="text-gray-400 shrink-0">{icon}</span>}
        <span className={`flex-1 truncate ${!selected ? "text-gray-400" : ""}`}>
          {selected ? selected.label : placeholder}
        </span>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {selected && !disabled && (
            <span
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer p-0.5"
            >
              <X size={12} />
            </span>
          )}
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-[200px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-7 pr-3 py-1.5 text-xs rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:border-emerald-500 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Options list */}
          <ul className="max-h-52 overflow-y-auto py-1">
            {/* "All" / clear option */}
            <li>
              <button
                type="button"
                onClick={() => handleSelect("")}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors
                  ${!value
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-semibold"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                {!value && <Check size={12} />}
                <span className={!value ? "" : "pl-4"}>{placeholder}</span>
              </button>
            </li>

            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-xs text-center text-gray-400">
                No results for "{query}"
              </li>
            ) : (
              filtered.map(option => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors
                      ${value === option.value
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                  >
                    {value === option.value ? <Check size={12} className="shrink-0" /> : <span className="w-3 shrink-0" />}
                    <span className="truncate">{option.label}</span>
                  </button>
                </li>
              ))
            )}
          </ul>

          {/* Count footer */}
          {options.length > 5 && (
            <div className="px-3 py-1.5 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 text-right">
              {filtered.length} of {options.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
