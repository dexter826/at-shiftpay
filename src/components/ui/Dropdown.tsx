import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ChevronIcon from '@/components/ui/icons/ChevronIcon';
import SimpleCheckedIcon from '@/components/ui/icons/SimpleCheckedIcon';
import MagnifierIcon from '@/components/ui/icons/MagnifierIcon';
import XIcon from '@/components/ui/icons/XIcon';
import { AnimatedIconHandle } from '@/components/ui/icons/types';
import { focusRingClasses, focusRingOnSurfaceClasses } from '@/lib/utils';
import { DURATION_BASE, DURATION_FAST, EASE_STANDARD } from '@/lib/motion';

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
  const prefersReducedMotion = useReducedMotion();
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
        aria-expanded={isOpen}
        className={`w-full h-full flex items-center gap-2 px-3 py-2 bg-surface-2 border border-line rounded-sm text-body-sm text-ink-soft hover:border-ink-muted focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-fast ease-standard ${focusRingClasses} ${minWidth}`}
      >
        {icon && <span className="text-ink-muted">{icon}</span>}
        <span className="flex-1 text-left truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : DURATION_BASE,
            ease: EASE_STANDARD,
          }}
        >
          <ChevronIcon ref={chevronRef} size={16} className="text-ink-muted" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-sm z-50 flex flex-col overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: prefersReducedMotion ? 0 : DURATION_FAST,
              ease: EASE_STANDARD,
            }}
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
                    className={`w-full h-10 pl-8 pr-12 bg-surface-2 border border-line rounded-sm text-label font-medium text-ink-soft placeholder:text-ink-muted transition-colors duration-fast ease-standard focus:outline-none ${focusRingOnSurfaceClasses}`}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      onMouseEnter={() => xIconRef.current?.startAnimation()}
                      onMouseLeave={() => xIconRef.current?.stopAnimation()}
                      aria-label="Xoá tìm kiếm"
                      className={`absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-sm text-ink-muted hover:bg-surface hover:text-ink transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}`}
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
                    className={`w-full px-3 py-2.5 text-left text-body-sm transition-all duration-fast ease-standard hover:brightness-110 ${value === option.value ? `bg-surface-2 text-ink font-medium` : `text-ink-soft`}`}
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
                <div className={`px-3 py-4 text-center text-label text-ink-muted`}>
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
