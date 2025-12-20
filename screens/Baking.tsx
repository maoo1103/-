import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CakeConfig } from '../types';
import { Sparkles } from 'lucide-react';

interface BakingProps {
  config: CakeConfig;
  onFinished: () => void;
}

export const Baking: React.FC<BakingProps> = ({ config, onFinished }) => {
  const [progress, setProgress] = useState(0);

  const playMagicalSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        // Magical chime sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.5); 
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1.5);
        osc.start();
        osc.stop(ctx.currentTime + 1.5);
    } catch(e) {
        console.error("Audio play failed", e);
    }
  };

  useEffect(() => {
    const duration = 3000;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const p = Math.min(currentStep / steps, 1);
      setProgress(p);

      if (p >= 1) {
        clearInterval(timer);
        playMagicalSound();
        setTimeout(onFinished, 1000);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onFinished]);

  return (
    <div className="w-full h-full bg-[#fde4e8] relative overflow-hidden flex items-center justify-center font-chinese">
      
      {/* Magic Circle Background Spinning */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-0"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
          <div className="w-[500px] h-[500px] border-[2px] border-pink-300 rounded-full opacity-30 flex items-center justify-center">
             <div className="w-[300px] h-[300px] border-[2px] border-pink-300 rounded-full"></div>
             <div className="absolute w-full h-[2px] bg-pink-300 rotate-45"></div>
             <div className="absolute w-full h-[2px] bg-pink-300 -rotate-45"></div>
          </div>
      </motion.div>
      
      {/* Magic Casting UI */}
      <div className="absolute top-20 w-full text-center z-20">
         <motion.h2 
            className="text-pink-500 font-bold text-3xl tracking-widest uppercase"
            animate={{ scale: [1, 1.1, 1], textShadow: "0px 0px 10px #ffb7c5" }}
            transition={{ repeat: Infinity, duration: 2 }}
         >
            封印解除...
         </motion.h2>
      </div>

      {/* Central Image Sealing Animation */}
      <div className="relative w-80 h-80 z-10 flex items-center justify-center">
          {config.imageUrl && (
            <motion.div
                initial={{ scale: 0.5, rotate: 180, opacity: 0 }}
                animate={{ 
                    scale: 1, 
                    rotate: 0, 
                    opacity: 1,
                    filter: `brightness(${1 + (1-progress)}) contrast(${1 + (1-progress)*0.5})`
                }}
                transition={{ duration: 2 }}
                className="relative"
            >
                <img 
                    src={config.imageUrl}
                    className="w-full h-full object-contain drop-shadow-2xl"
                />
                
                {/* Sparkles Erupting */}
                <div className="absolute inset-0 flex items-center justify-center">
                     <motion.div 
                        animate={{ scale: [1, 1.5, 2], opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="text-yellow-400"
                     >
                         <Sparkles size={64} />
                     </motion.div>
                </div>
            </motion.div>
          )}
      </div>
      
      {/* Pink Flash overlay */}
      <motion.div 
         className="absolute inset-0 bg-white pointer-events-none z-50"
         initial={{ opacity: 0 }}
         animate={{ opacity: progress === 1 ? [0, 1, 0] : 0 }}
         transition={{ duration: 0.5 }}
      />

    </div>
  );
};
