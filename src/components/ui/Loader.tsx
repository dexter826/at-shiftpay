import React from 'react';

const Loader = ({ fullScreen = true }: { fullScreen?: boolean }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={
        fullScreen
          ? 'fixed inset-0 z-[9999] flex min-h-dvh flex-col items-center justify-center gap-2 bg-canvas pt-safe pr-safe pb-safe pl-safe [transform:translateZ(0)]'
          : 'relative flex h-full w-full flex-col items-center justify-center gap-2 py-8 pt-safe pr-safe pb-safe pl-safe [transform:translateZ(0)]'
      }
    >
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-accent"
      />
      <span className="font-mono text-mono-label text-ink-muted">Đang tải</span>
    </div>
  );
};

export default Loader;
