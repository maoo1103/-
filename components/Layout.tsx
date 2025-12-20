import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative w-full h-screen overflow-hidden bg-[#fde4e8] text-slate-800 ${className}`}>
      
      {/* Background Layer: Sakura Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff0f5] via-[#fde4e8] to-[#fbcfe8] opacity-100" />
      
      {/* Magic Circle / Decorative Background Element */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg viewBox="0 0 100 100" className="w-[150vmax] h-[150vmax] animate-[spin_60s_linear_infinite]">
             <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-pink-600" />
             <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-pink-500" />
             <path d="M50 2 L52 10 L60 12 L52 14 L50 22 L48 14 L40 12 L48 10 Z" fill="currentColor" className="text-pink-400 opacity-50" />
             {/* Simple geometric representation of a magic array */}
             <path d="M50 50 L90 50 M50 50 L10 50 M50 50 L50 90 M50 50 L50 10" stroke="currentColor" strokeWidth="0.2" className="text-pink-400" />
             <path d="M50 50 L80 80 M50 50 L20 20 M50 50 L20 80 M50 50 L80 20" stroke="currentColor" strokeWidth="0.2" className="text-pink-400" />
          </svg>
      </div>

      {/* Floating Sakura Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
              <motion.div
                  key={i}
                  className="absolute text-pink-300/60"
                  initial={{ 
                      x: Math.random() * window.innerWidth, 
                      y: -20, 
                      rotate: 0,
                      scale: Math.random() * 0.5 + 0.5
                  }}
                  animate={{ 
                      y: window.innerHeight + 20, 
                      x: `calc(${Math.random() * 100}vw + ${(Math.random() - 0.5) * 200}px)`,
                      rotate: 360 
                  }}
                  transition={{ 
                      duration: Math.random() * 10 + 10, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: Math.random() * 10
                  }}
              >
                  {/* SVG Petal Shape */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C12 2 14 6 18 6C22 6 22 10 22 10C22 12 20 16 16 18C12 20 12 22 12 22C12 22 12 20 8 18C4 16 2 12 2 10C2 10 2 6 6 6C10 6 12 2 12 2Z" />
                  </svg>
              </motion.div>
          ))}
      </div>

      {/* Soft Light Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-pink-200/20 mix-blend-screen pointer-events-none" />

      {/* Content Container */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="relative z-10 w-full h-full text-slate-700 font-medium"
      >
        {children}
      </motion.div>
    </div>
  );
};