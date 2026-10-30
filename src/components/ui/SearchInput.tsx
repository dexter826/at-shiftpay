import React from 'react';
import { Search, X } from 'lucide-react';
import { focusRingClasses } from '@/lib/utils';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  containerClassName?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  onClear,
  containerClassName = '',
  value,
  onChange,
  className = '',
  ...props
}) => {
  const hasValue = value && String(value).length > 0;

  const handleClear = () => {
    if (onClear) onClear();
  };

  return (
    <div className={`relative ${containerClassName}`}>
      <Search
        size={16}
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none ${props.disabled ? 'opacity-60' : ''}`}
      />
      <input
        value={value}
        onChange={onChange}
        className={`w-full pl-9 pr-10 h-10 bg-surface-2 border border-line rounded-sm text-body-sm text-ink placeholder:text-ink-muted transition-colors duration-fast ease-standard hover:border-ink-muted focus:outline-none ${focusRingClasses} disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {hasValue && (
        <button
          type="button"
          onClick={handleClear}
          disabled={props.disabled}
          aria-label="Xoá tìm kiếm"
          className={`absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-sm text-ink-muted transition-colors duration-fast ease-standard hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed ${focusRingClasses}`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
