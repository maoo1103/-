
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Key, Settings } from 'lucide-react';
import { AppState } from '../types';

interface HomeProps {
  setAppState: (state: AppState) => void;
}

// 扩展 window 对象以支持 aistudio 接口
// Define AIStudio interface to match the expected global type in the environment
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio: AIStudio;
  }
}

const Petal: React.FC<{ delay: number }> = ({ delay }) => {
  const randomX = Math.random() * 100;
  const duration = 10 + Math.random() * 10;
  const scale = 0.5 + Math.random() * 0.8;
  
  return (
    <motion.div
      initial={{ top: '-10%', left: `${randomX}%`, rotate: 0, opacity: 0 }}
      animate={{ 
        top: '110%', 
        left: `${randomX + (Math.random() * 20 - 10)}%`, 
        rotate: 360 * 2,
        opacity: [0, 0.8, 0.8, 0]
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity, 
        delay: delay,
        ease: "linear" 
      }}
      className="absolute pointer-events-none z-0"
      style={{ scale }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-pink-300/60">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </motion.div>
  );
};

export const Home: React.FC<HomeProps> = ({ setAppState }) => {
  const [hasKey, setHasKey] = useState<boolean>(true);

  useEffect(() => {
    // 检查是否已选择 API Key
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleManageKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // 假设选择成功并更新状态
      setHasKey(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 relative font-serif overflow-hidden bg-[#fff1f2]">
       
       {/* Background Layer: Soft Pink Gradient */}
       <div className="absolute inset-0 bg-gradient-to-b from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3] z-0" />

       {/* Falling Petals Effect */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <Petal key={i} delay={i * 1.2} />
          ))}
       </div>

       {/* Key Management Button (Floating) */}
       <motion.button
         whileHover={{ scale: 1.1, rotate: 15 }}
         whileTap={{ scale: 0.9 }}
         onClick={handleManageKey}
         className="absolute top-6 right-6 z-50 p-3 bg-white/40 backdrop-blur-md rounded-full border border-pink-200 text-pink-500 shadow-sm hover:bg-white/60 transition-colors"
         title="修改密钥"
       >
         <Settings size={20} className={!hasKey ? "animate-pulse text-rose-500" : ""} />
       </motion.button>

       {/* Brand Header */}
       <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.5 }}
         className="absolute top-12 text-pink-400 tracking-[0.4em] uppercase text-2xl font-quentin z-20"
       >
         WishVerse
       </motion.div>

       <motion.div
         className="relative z-10 flex flex-col items-center gap-6 w-full max-w-md mt-10"
       >
         <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
                opacity: [0.7, 1, 0.7],
                y: 0,
            }}
            transition={{ 
                opacity: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                y: { duration: 1, ease: "easeOut" }
            }}
            className="text-2xl text-pink-500 font-medium tracking-[0.2em] font-zen drop-shadow-sm"
         >
            被封印的祝福——
         </motion.h2>

         <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ 
                opacity: 1,
                scale: 1,
            }}
            transition={{ 
                duration: 1.2, 
                delay: 0.3,
                type: "spring"
            }}
            className="text-4xl text-[#be185d] mb-12 drop-shadow-sm leading-relaxed font-zen font-bold tracking-wider"
         >
            以我生日之名请你显现
         </motion.h1>

         <div className="relative group mt-4 w-full flex flex-col items-center justify-center">
             {!hasKey && (
               <motion.p 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 className="text-rose-500 text-sm mb-4 font-zen font-bold"
               >
                 * 魔法源缺失，请先通过右上角配置密钥
               </motion.p>
             )}
             
             <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (!hasKey) {
                    handleManageKey();
                  } else {
                    setAppState(AppState.CREATOR);
                  }
                }}
                className={`relative overflow-hidden px-14 py-5 bg-gradient-to-r ${!hasKey ? 'from-slate-400 to-slate-500' : 'from-[#fb7185] to-[#f43f5e]'} text-white rounded-full shadow-[0_10px_30px_rgba(244,63,94,0.3)] border-2 border-white/30 flex items-center gap-3 z-30 transition-all duration-300`}
             >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <Key className="w-6 h-6 -rotate-45" strokeWidth={2.5} />
                <span className="text-xl font-bold tracking-[0.3em] relative z-10 font-zen">
                    {!hasKey ? '配置密钥' : '封印解除'}
                </span>
                <Sparkles className="w-5 h-5 text-yellow-200 animate-pulse" />
             </motion.button>
             
             {hasKey && (
               <p className="mt-4 text-xs text-pink-400 font-zen opacity-60">
                 API 密钥已就绪，魔力充盈中
               </p>
             )}
         </div>
       </motion.div>

       {/* Billing Info Link */}
       <div className="absolute bottom-6 z-20">
         <a 
           href="https://ai.google.dev/gemini-api/docs/billing" 
           target="_blank" 
           rel="noreferrer"
           className="text-xs text-pink-300 hover:text-pink-400 underline decoration-pink-200 transition-colors font-zen"
         >
           计费说明与密钥获取
         </a>
       </div>

       {/* Soft Bottom Glow */}
       <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-pink-200/40 to-transparent pointer-events-none" />
    </div>
  );
};
