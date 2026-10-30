import React, { useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

const SPLASHSCREEN_DURATION = 800;
const REDUCED_MOTION_DURATION = 300;

interface SplashscreenProps {
  onComplete: () => void;
}

export const Splashscreen: React.FC<SplashscreenProps> = ({ onComplete }) => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(
      onComplete,
      prefersReducedMotion ? REDUCED_MOTION_DURATION : SPLASHSCREEN_DURATION
    );
    return () => clearTimeout(timer);
  }, [onComplete, prefersReducedMotion]);

  return (
    <div
      role="status"
      aria-label="Đang mở ShiftPay"
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-5 bg-brand px-6"
    >
      <img
        src="/brand/lockup-white.svg"
        alt="ShiftPay"
        className="w-[250px] max-w-[70%] object-contain"
      />
      <span className="font-mono text-mono-label text-on-brand/90">
        Quản lý ca làm &amp; tính lương
      </span>
    </div>
  );
};
