import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, id }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <label
      htmlFor={inputId}
      className="flex min-h-10 items-center gap-2.5 py-1.5 cursor-pointer select-none"
    >
      <div className="relative">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={`w-4 h-4 rounded-xs border transition-colors duration-fast hover:border-accent/60 ${
            checked ? 'bg-accent border-accent' : 'border-line bg-transparent'
          } peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas`}
        >
          {checked && (
            <Check size={12} className="text-on-accent absolute inset-0 m-auto" strokeWidth={3} />
          )}
        </div>
      </div>
      {label && <span className="text-label text-ink-muted">{label}</span>}
    </label>
  );
};

export default Checkbox;
