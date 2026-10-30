import React from 'react';
import { Clock } from 'lucide-react';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string; // HH:mm
  onChange: (value: string) => void;
  className?: string;
}

const pad = (value: string | number) => String(value).padStart(2, '0');

const hoursOptions: DropdownOption[] = Array.from({ length: 24 }, (_, index) => ({
  value: pad(index),
  label: pad(index),
}));

const minutesOptions: DropdownOption[] = Array.from({ length: 60 }, (_, index) => ({
  value: pad(index),
  label: pad(index),
}));

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, className = '' }) => {
  const [rawHours, rawMinutes] = value.split(':');
  const hours = pad(Number.isFinite(Number(rawHours)) ? rawHours : 7);
  const minutes = pad(Number.isFinite(Number(rawMinutes)) ? rawMinutes : 30);

  const setHours = (nextHours: string) => onChange(`${nextHours}:${minutes}`);
  const setMinutes = (nextMinutes: string) => onChange(`${hours}:${nextMinutes}`);

  return (
    <div role="group" aria-label="Thời gian" className={cn('flex items-center gap-1.5', className)}>
      <Clock size={14} aria-hidden="true" className="shrink-0 text-ink-muted" />
      <Dropdown
        options={hoursOptions}
        value={hours}
        onChange={setHours}
        ariaLabel="Giờ"
        minWidth="min-w-[76px]"
        className="w-[76px]"
      />
      <span className="text-ink-muted" aria-hidden="true">
        :
      </span>
      <Dropdown
        options={minutesOptions}
        value={minutes}
        onChange={setMinutes}
        ariaLabel="Phút"
        minWidth="min-w-[76px]"
        className="w-[76px]"
      />
    </div>
  );
};
