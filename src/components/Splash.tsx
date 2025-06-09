import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedPediaPredict');
    if (hasVisited) {
      navigate('/dashboard', { replace: true });
      return;
    }

    setShowSplash(true); // Show splash only if not visited before
    sessionStorage.setItem('hasVisitedPediaPredict', 'true'); // Mark as visited

    const timer = setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 2000); // 2 seconds

    return () => clearTimeout(timer); // Cleanup timer
  }, [navigate]);

  if (!showSplash) {
    return null; // Don't render anything if not showing splash
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center bg-[#FAFAFA] z-[9999] pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-48 h-48 mb-8" // Adjusted size for animation
        >
          {/* Simple health-themed SVG. Replace with a more complex one if needed. */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
              fill="#3F51B5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.path
              d="M9 12L11 14L15 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
            />
          </svg>
        </motion.div>

        <motion.p
          className="font-poppins text-lg text-[#3F51B5]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          PediaPredict AI
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default Splash; 