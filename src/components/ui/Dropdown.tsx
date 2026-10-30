import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChevronIcon from '@/components/ui/icons/ChevronIcon';
import SimpleCheckedIcon from '@/components/ui/icons/SimpleCheckedIcon';
import MagnifierIcon from '@/components/ui/icons/MagnifierIcon';
import XIcon from '@/components/ui/icons/XIcon';
import { AnimatedIconHandle } from '@/components/ui/icons/types';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  minWidth?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Chọn...',
  disabled = false,
  icon,
  className = '',
  minWidth = 'min-w-[120px]',
  searchable = false,
  searchPlaceholder = 'Tìm kiếm...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const chevronRef = useRef<AnimatedIconHandle>(null);
  const searchIconRef = useRef<AnimatedIconHandle>(null);
  const xIconRef = useRef<AnimatedIconHandle>(null);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
  }, []);

  // Đóng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  // Focus vào ô tìm kiếm khi mở
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, searchable]);

  // Đóng khi nhấn Esc
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeDropdown]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm, searchable]);

  const selectedOption = options.find((option) => option.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    closeDropdown();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => (isOpen ? closeDropdown() : setIsOpen(true))}
        onMouseEnter={() => chevronRef.current?.startAnimation()}
        onMouseLeave={() => chevronRef.current?.stopAnimation()}
        disabled={disabled}
        className={`w-full h-full flex items-center gap-2 px-3 py-2 bg-surface-2 border border-line rounded-lg text-sm text-ink-soft hover:border-accent/50 focus:outline-none focus:border-accent disabled:opacity-50 transition-colors ${minWidth}`}
      >
        {icon && <span className="text-ink-muted">{icon}</span>}
        <span className="flex-1 text-left truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronIcon ref={chevronRef} size={16} className="text-ink-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-lg shadow-lg z-50 flex flex-col overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {searchable && (
              <div className={`p-2 border-b border-line`}>
                <div
                  className="relative"
                  onMouseEnter={() => searchIconRef.current?.startAnimation()}
                  onMouseLeave={() => searchIconRef.current?.stopAnimation()}
                >
                  <MagnifierIcon
                    ref={searchIconRef}
                    size={14}
                    className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted`}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-8 pr-8 py-1.5 bg-surface-2 border border-line rounded-md text-xs text-ink-soft focus:outline-none focus:border-accent`}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      onMouseEnter={() => xIconRef.current?.startAnimation()}
                      onMouseLeave={() => xIconRef.current?.stopAnimation()}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-line text-ink-muted`}
                    >
                      <XIcon ref={xIconRef} size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto scrollbar-thin">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-3 py-2.5 text-left text-sm transition-colors hover:bg-accent/10 ${value === option.value ? `bg-accent/10 text-accent-ink font-medium` : `text-ink-soft`}`}
                  >
                    <div className="flex items-center gap-2 group/opt">
                      {option.icon && <span className="text-current">{option.icon}</span>}
                      <span className="flex-1 truncate">{option.label}</span>
                      {value === option.value && (
                        <SimpleCheckedIcon size={14} className="text-accent-ink" />
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className={`px-3 py-4 text-center text-xs text-ink-muted`}>
                  Không tìm thấy kết quả
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
