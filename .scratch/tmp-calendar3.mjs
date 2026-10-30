import { readFileSync, writeFileSync } from 'node:fs';

const files = [
  'src/app/routes/calendar.tsx',
  'src/features/calendar/components/CalendarDay.tsx',
  'src/features/calendar/components/CalendarGrid.tsx',
  'src/features/calendar/components/CalendarHeader.tsx',
  'src/features/calendar/components/CalendarSidebar.tsx',
  'src/features/calendar/components/EmployeeAssignmentList.tsx',
  'src/features/calendar/components/EventDetailModal.tsx',
  'src/features/calendar/components/EventModal.tsx',
];

const R = (s, a, b, tag) => {
  if (!s.includes(a)) console.log(`MISS ${tag ?? ''} ${a.slice(0, 55)}`);
  return s.split(a).join(b);
};

for (const file of files) {
  let s = readFileSync(file, 'utf8');
  const before = s;

  // global scale + motion + token fixes
  s = s.replace(/\brounded\b(?!-)/g, 'rounded-xs');
  s = s.split('text-xs').join('text-label');
  s = s.split('text-sm').join('text-body-sm');
  s = s.replace(/transition-colors(?! duration-fast)/g, 'transition-colors duration-fast ease-standard');
  s = s.replace(/transition-all(?! duration-fast)/g, 'transition-all duration-fast ease-standard');
  s = R(s, 'hover:bg-line', 'hover:bg-surface-2', file);
  s = R(s, 'hover:border-accent/50', 'hover:border-ink-muted', file);

  if (file.endsWith('CalendarHeader.tsx')) {
    if (!s.includes("from '@/lib/utils'")) {
      const lines = s.split('\n');
      lines.splice(1, 0, "import { focusRingOnSurfaceClasses } from '@/lib/utils';");
      s = lines.join('\n');
    }
    s = R(s, 'hover:bg-surface-2 transition-colors duration-fast ease-standard mr-1 flex items-center gap-1', 'hover:bg-surface-2 transition-colors duration-fast ease-standard mr-1 flex items-center gap-1 ${focusRingOnSurfaceClasses}', file);
    s = R(s, 'hover:bg-surface-2 rounded-sm transition-colors duration-fast ease-standard', 'hover:bg-surface-2 rounded-sm transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}', file);
    s = R(s, 'px-2.5 py-1.5 text-label font-medium rounded-xs border border-line', 'min-h-10 px-3 text-label font-medium rounded-sm border border-line', file);
    s = R(s, 'p-2 text-ink-muted hover:bg-surface-2 rounded-xs transition-colors', 'flex h-10 w-10 items-center justify-center text-ink-muted hover:bg-surface-2 rounded-sm transition-colors', file);
    s = R(s, 'h-9 w-9 flex items-center justify-center hover:bg-surface-2 rounded-xs transition-colors duration-fast ease-standard text-accent-ink', 'flex h-10 w-10 items-center justify-center hover:bg-surface-2 rounded-sm transition-colors duration-fast ease-standard text-accent-ink', file);
    s = R(s, 'title="Quản lý địa điểm"', 'aria-label="Quản lý địa điểm"', file);
    s = R(s, '<button\n          onClick={onGoToToday}', '<button\n          type="button"\n          onClick={onGoToToday}', file);
    s = R(s, '<button\n          onClick={onPrevMonth}', '<button\n          type="button"\n          onClick={onPrevMonth}', file);
    s = R(s, '<button\n          onClick={onNextMonth}', '<button\n          type="button"\n          onClick={onNextMonth}', file);
    s = R(s, '<button\n            onClick={onNavigateToReviews}', '<button\n            type="button"\n            onClick={onNavigateToReviews}', file);
  }

  if (file.endsWith('CalendarSidebar.tsx')) {
    s = R(s, 'p-2 rounded-sm bg-accent hover:bg-accent/90 text-on-accent transition-all duration-fast ease-standard active:scale-95', 'flex h-10 w-10 items-center justify-center rounded-sm bg-accent hover:bg-accent/90 text-on-accent transition-all duration-fast ease-standard active:scale-95 ${focusRingOnSurfaceClasses}', file);
    s = R(s, 'p-2 rounded-sm text-ink-muted hover:text-accent-ink hover:bg-surface-2 transition-colors duration-fast ease-standard', 'flex h-10 w-10 items-center justify-center rounded-sm text-ink-muted hover:text-accent-ink hover:bg-surface transition-colors duration-fast ease-standard', file);
    s = R(s, 'p-2 rounded-sm text-ink-muted hover:text-danger hover:bg-danger/10 transition-colors duration-fast ease-standard', 'flex h-10 w-10 items-center justify-center rounded-sm text-ink-muted hover:text-danger hover:bg-danger/10 transition-colors duration-fast ease-standard', file);
    s = R(s, "'bg-surface-2 text-accent-ink'", "'bg-surface text-ink-soft'", file);
    s = R(s, '<button\n              onClick={onAddEvent}', '<button\n              type="button"\n              aria-label="Thêm sự kiện"\n              onClick={onAddEvent}', file);
    s = R(s, 'onClick={() => onEditEvent(evt)}', 'type="button"\n                              onClick={() => onEditEvent(evt)}', file);
    s = R(s, 'onClick={() => onDeleteEvent(evt.id)}', 'type="button"\n                              onClick={() => onDeleteEvent(evt.id)}', file);
  }

  if (file.endsWith('CalendarDay.tsx')) {
    s = R(s, 'w-4 h-4 rounded-xs flex items-center justify-center text-label font-semibold', 'min-w-4 h-4 px-1 rounded-xs flex items-center justify-center text-label leading-none font-semibold', file);
  }

  if (file.endsWith('EventDetailModal.tsx')) {
    s = R(s, 'text-2xl font-black text-accent-ink', 'text-data font-semibold tabular-nums text-ink', file);
    s = R(s, 'className={`p-3.5 bg-surface-2 border border-line rounded-sm flex items-center justify-between`}', 'className="p-3.5 bg-surface-2 border border-line rounded-sm flex items-center justify-between"', file);
  }

  if (file.endsWith('EventModal.tsx')) {
    if (!s.includes("from '@/lib/utils'")) {
      const lines = s.split('\n');
      lines.splice(1, 0, "import { focusRingOnSurfaceClasses } from '@/lib/utils';");
      s = lines.join('\n');
    } else {
      s = s.replace(
        "import { cn } from '@/lib/utils';",
        "import { cn, focusRingOnSurfaceClasses } from '@/lib/utils';"
      );
    }
    s = R(s, 'gap-2 transition-colors duration-fast ease-standard', 'gap-2 transition-colors duration-fast ease-standard ${focusRingOnSurfaceClasses}', file);
    s = R(s, 'p-2.5 rounded-sm border text-body-sm font-medium flex items-center justify-center gap-2 transition-colors', 'p-2.5 min-h-10 rounded-sm border text-body-sm font-medium flex items-center justify-center gap-2 transition-colors', file);
    s = R(s, 'border-accent/50 bg-accent/10 text-accent-ink', 'border-ink-muted bg-surface-2 text-ink', file);
    s = R(
      s,
      'className={`block text-label mb-1.5 ${\n                theme === \'dark\' ? \'text-ink-muted\' : \'text-ink-muted\'\n              }`}',
      'className="block text-label mb-1.5 text-ink-muted"',
      file
    );
  }

  if (file.endsWith('EmployeeAssignmentList.tsx')) {
    s = R(s, 'hover:bg-accent/5', 'hover:bg-surface-2', file);
    s = R(s, "isSelected ? 'bg-accent/10' : ''", "isSelected ? 'bg-surface-2' : ''", file);
  }

  if (s !== before) writeFileSync(file, s);
}
console.log('done');
