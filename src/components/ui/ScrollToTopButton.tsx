import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { focusRingClasses } from '@/lib/utils';

interface ScrollToTopButtonProps {
  activeTab: string;
}

const ENABLED_TABS = ['dashboard', 'employees', 'payroll', 'locations'];

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ activeTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 400);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isVisible = isScrolled && ENABLED_TABS.includes(activeTab);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className={`fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 flex h-12 w-12 items-center justify-center rounded-md border border-accent bg-accent text-on-accent transition-all duration-fast ease-standard hover:brightness-110 active:scale-90 ${focusRingClasses}`}
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default memo(ScrollToTopButton);
