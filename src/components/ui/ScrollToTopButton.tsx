import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

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
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className={`fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 p-3 rounded-full shadow-2xl border border-accent/20 transition-all active:scale-90 bg-accent text-on-accent hover:bg-accent/90 hover:shadow-accent/40`}
          title="Cuộn lên đầu trang"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default memo(ScrollToTopButton);
