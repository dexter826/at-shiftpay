import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import { useReducedMotion } from 'framer-motion';
import splashScreenAnimation from '@/assets/splashscreen.json';

const SPLASHSCREEN_DURATION = 2000;
const REDUCED_MOTION_DURATION = 600;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas">
      <div className="w-full max-w-md px-4 flex justify-center">
        {prefersReducedMotion ? (
          <img src="/logo_text.png" alt="ShiftPay" className="h-10 object-contain" />
        ) : (
          <Lottie animationData={splashScreenAnimation} loop={false} autoplay />
        )}
      </div>
    </div>
  );
};
