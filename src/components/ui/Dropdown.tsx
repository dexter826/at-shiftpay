import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { cn, focusRingClasses, focusRingOnSurfaceClasses } from '@/lib/utils';

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
  ariaLabel?: string;
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
  ariaLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    const term = searchTerm.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(term));
  }, [options, searchable, searchTerm]);

  const currentIndex =
    filteredOptions.length === 0 ? -1 : Math.min(activeIndex, filteredOptions.length - 1);
  const activeId = currentIndex >= 0 ? `${listboxId}-option-${currentIndex}` : undefined;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setSearchTerm('');
      const index = options.findIndex((option) => option.value === value);
      setActiveIndex(index >= 0 ? index : 0);
    }
  };

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      if (searchable) inputRef.current?.focus();
      else listRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [isOpen, searchable]);

  useEffect(() => {
    if (!isOpen || currentIndex < 0) return;
    optionRefs.current[currentIndex]?.scrollIntoView({ block: 'nearest' });
  }, [currentIndex, isOpen]);

  const selectOption = (option: DropdownOption) => {
    onChange(option.value);
    close();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen) return;
    const length = filteredOptions.length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (length) setActiveIndex((currentIndex + 1) % length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (length) setActiveIndex((currentIndex - 1 + length) % length);
        break;
      case 'Home':
        event.preventDefault();
        if (length) setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        if (length) setActiveIndex(length - 1);
        break;
      case 'Enter':
        event.preventDefault();
        if (currentIndex >= 0) selectOption(filteredOptions[currentIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        close();
        break;
      case 'Tab':
        close();
        break;
      default:
        break;
    }
  };

  return (
    <PopoverPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <div className={cn('relative', className)}>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-haspopup="listbox"
            aria-label={ariaLabel}
            className={cn(
              'flex min-h-11 w-full items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-body-sm text-ink-soft transition-colors duration-fast ease-standard hover:border-line-strong',
              'disabled:cursor-not-allowed disabled:opacity-50',
              focusRingClasses,
              minWidth
            )}
          >
            {icon && <span className="text-ink-muted">{icon}</span>}
            <span className="flex-1 truncate text-left">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              size={16}
              aria-hidden="true"
              className={cn(
                'text-ink-muted transition-transform duration-fast ease-standard',
                isOpen && 'rotate-180'
              )}
            />
          </button>
        </PopoverPrimitive.Trigger>
      </div>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={8}
          onOpenAutoFocus={(event) => event.preventDefault()}
          className={cn(
            'z-[80] max-w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-sm border border-line bg-surface shadow-none data-[state=open]:animate-pop-in',
            'min-w-[var(--radix-popover-trigger-width)]',
            minWidth
          )}
        >
          {searchable && (
            <div className="border-b border-line p-2">
              <div className="relative">
                <Search
                  size={14}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-muted"
                />
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listboxId}
                  aria-autocomplete="list"
                  aria-activedescendant={activeId}
                  aria-label={ariaLabel ? `${ariaLabel} — tìm kiếm` : searchPlaceholder}
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    'h-11 w-full rounded-sm border border-line bg-surface px-3 pl-8 pr-10 text-base text-ink placeholder:text-ink-muted focus:outline-none',
                    focusRingOnSurfaceClasses
                  )}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setActiveIndex(0);
                      inputRef.current?.focus();
                    }}
                    aria-label="Xoá tìm kiếm"
                    className={cn(
                      'absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-sm text-ink-muted hover:text-ink',
                      focusRingOnSurfaceClasses
                    )}
                  >
                    <X size={13} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          )}

          <div
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel ?? placeholder}
            aria-activedescendant={searchable ? undefined : activeId}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
            className="max-h-[264px] overflow-y-auto scrollbar-thin focus:outline-none"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  id={`${listboxId}-option-${index}`}
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    'flex min-h-11 cursor-pointer items-center gap-2 px-3 py-2.5 text-body-sm text-ink-soft transition-colors duration-fast ease-standard',
                    index === currentIndex && 'bg-surface-2',
                    option.value === value && 'font-medium text-ink'
                  )}
                >
                  {option.icon && <span className="text-current">{option.icon}</span>}
                  <span className="flex-1 truncate">{option.label}</span>
                  {option.value === value && (
                    <Check size={14} aria-hidden="true" className="text-accent-ink" />
                  )}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-label text-ink-muted">
                Không tìm thấy kết quả
              </div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
