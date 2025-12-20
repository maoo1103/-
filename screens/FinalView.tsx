import React, { useRef, useState } from 'react';
import { CakeConfig } from '../types';
import { Repeat, Download, Link, Share2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';

interface FinalViewProps {
  config: CakeConfig;
  onRestart: () => void;
}

// Fixed Background Component replicating the Clow/Sakura Card style
const SakuraCardBackground = () => (
    <div className="absolute inset-0 w-full h-full bg-[#fdebf3] overflow-hidden pointer-events-none select-none">
        {/* Main Frame Border */}
        <div className="absolute inset-3 border-[3px] border-[#ff9eb5] rounded-xl z-10" />
        <div className="absolute inset-5 border-[1px] border-[#ffb7c5] rounded-lg z-10" />

        {/* Top Wings & Star Emblem */}
        <div className="absolute top-6 left-0 w-full flex justify-center z-20">
            <svg width="300" height="120" viewBox="0 0 300 120" className="drop-shadow-sm">
                {/* Wings Left */}
                <path d="M 110 50 C 90 40, 60 20, 20 20 C 40 50, 60 60, 100 70" fill="white" stroke="#ff9eb5" strokeWidth="2" />
                <path d="M 100 70 C 80 80, 50 90, 20 100 C 50 90, 80 80, 105 75" fill="white" stroke="#ff9eb5" strokeWidth="2" />
                
                {/* Wings Right */}
                <path d="M 190 50 C 210 40, 240 20, 280 20 C 260 50, 240 60, 200 70" fill="white" stroke="#ff9eb5" strokeWidth="2" />
                <path d="M 200 70 C 220 80, 250 90, 280 100 C 250 90, 220 80, 195 75" fill="white" stroke="#ff9eb5" strokeWidth="2" />

                {/* Center Circle */}
                <circle cx="150" cy="60" r="35" fill="#fce7f3" stroke="#eab308" strokeWidth="3" />
                
                {/* Star */}
                <path d="M 150 35 L 158 52 L 177 52 L 162 64 L 168 82 L 150 72 L 132 82 L 138 64 L 123 52 L 142 52 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
            </svg>
        </div>

        {/* Bottom Kero-chan / Mascot Placeholder Area */}
        {/* Abstract representation of the floral/mascot area at bottom */}
        <div className="absolute bottom-0 w-full h-1/3 opacity-30">
             <svg viewBox="0 0 340 200" className="w-full h-full text-pink-300 fill-current">
                 <path d="M0,200 L0,100 C 50,150 100,80 170,120 C 240,160 290,100 340,100 L340,200 Z" />
                 <circle cx="50" cy="150" r="20" className="text-pink-200" />
                 <circle cx="290" cy="180" r="30" className="text-pink-200" />
                 <circle cx="170" cy="160" r="15" className="text-pink-200" />
             </svg>
        </div>
        
        {/* Floating Petals Overlay */}
        <div className="absolute inset-0 z-0">
             <svg width="100%" height="100%">
                 <pattern id="petal-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                     <path d="M20 20 Q30 5 40 20 T60 20" stroke="#ffc4d6" fill="none" opacity="0.5"/>
                     <circle cx="80" cy="80" r="2" fill="#ffb7c5" opacity="0.6" />
                 </pattern>
                 <rect width="100%" height="100%" fill="url(#petal-pattern)" />
             </svg>
        </div>
    </div>
);

export const FinalView: React.FC<FinalViewProps> = ({ config, onRestart }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleSaveImage = async () => {
     const target = cardRef.current;
     if (target) {
         setIsSaving(true);
         try {
             await new Promise(resolve => setTimeout(resolve, 500));
             const canvas = await html2canvas(target, {
                 scale: 3, 
                 backgroundColor: null,
                 useCORS: true,
                 allowTaint: true
             });
             const link = document.createElement('a');
             link.download = `WishVerse_Card_${Date.now()}.png`;
             link.href = canvas.toDataURL('image/png');
             link.click();
         } catch (e) {
             console.error("Save failed", e);
             alert("保存失败，请截图保存！");
         }
         setIsSaving(false);
         setShowShareMenu(false);
     }
  };

  const handleCopyLink = () => {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
          alert("链接已复制！");
      }).catch(() => {
          alert("复制失败");
      });
      setShowShareMenu(false);
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#fde4e8] flex flex-col items-center justify-center font-serif">
      
      {/* App Background (Blurred/Abstract to focus on card) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-50">
          <div className="w-[120vw] h-[120vw] border-[1px] border-pink-300/30 rounded-full animate-[spin_60s_linear_infinite]" />
      </div>

      {/* CARD CONTAINER (Single Side) */}
      <div 
        ref={cardRef}
        className="relative w-[340px] h-[640px] shadow-2xl overflow-hidden rounded-2xl flex-shrink-0 bg-[#ffc4d6]"
      >
          {/* 1. Background Layer: Replaced with Fixed Sakura Background as requested */}
          <SakuraCardBackground />

          {/* 2. Content Layer - Layout Strictly Preserved */}
          {/* pt-28 ensures we don't cover the 'wings' at the top of the Clow Card frame */}
          <div className="relative z-10 w-full h-full flex flex-col items-center pt-28 px-4">
              
              {/* Cake Photo */}
              {/* Width: 85%, White Border, Rounded Rectangle */}
              <div className="w-[85%] aspect-[4/5] bg-white rounded-2xl overflow-hidden border-[6px] border-white shadow-lg shrink-0 relative z-20">
                  <img 
                    src={config.imageUrl} 
                    alt="Magic Cake" 
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
              </div>

              {/* Blessing Text */}
              {/* Below cake, 2rem (mt-8) spacing */}
              {config.message && (
                  <div className="mt-8 w-[85%] bg-white/60 backdrop-blur-md rounded-xl p-4 text-center shadow-sm border border-white/40">
                      <p 
                        className="text-pink-600 font-bold text-lg font-zen leading-relaxed tracking-wide break-words"
                        style={{ textShadow: '0 0 2px rgba(255,255,255,0.8)' }}
                      >
                          {config.message}
                      </p>
                  </div>
              )}
          </div>
      </div>

      {/* BUTTONS LAYER (Fixed at bottom of screen) */}
      <div className="absolute bottom-10 left-0 w-full px-10 flex justify-between items-end z-50 pointer-events-none">
          {/* Left: Back Button - Circle, White BG, Pink Icon */}
          <motion.button 
             whileTap={{ scale: 0.9 }}
             onClick={onRestart}
             className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(236,72,153,0.3)] text-pink-500 border border-pink-100 pointer-events-auto hover:bg-white transition-colors"
          >
              <Repeat size={24} />
          </motion.button>

          {/* Right: Share Button & Menu */}
          <div className="flex flex-col items-end gap-4 pointer-events-auto">
             <AnimatePresence>
                {showShareMenu && (
                    <motion.div
                       initial={{ opacity: 0, y: 10, scale: 0.8 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, y: 10, scale: 0.8 }}
                       className="flex flex-col gap-3 min-w-[140px] mb-2"
                    >
                         <button 
                            onClick={handleSaveImage}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-white text-pink-600 px-4 py-3 rounded-xl shadow-lg border border-pink-100 hover:bg-pink-50 transition w-full font-zen font-bold"
                         >
                            {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Download size={16} />}
                            <span>保存图片</span>
                         </button>

                         <button 
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 bg-white text-pink-600 px-4 py-3 rounded-xl shadow-lg border border-pink-100 hover:bg-pink-50 transition w-full font-zen font-bold"
                         >
                            <Link size={16} />
                            <span>复制链接</span>
                         </button>
                    </motion.div>
                )}
             </AnimatePresence>

             {/* Share Button - Oval, Pink BG, White Text */}
             <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowShareMenu(!showShareMenu)}
                className={`h-14 px-8 rounded-full flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(236,72,153,0.4)] font-bold text-lg tracking-widest transition-colors ${showShareMenu ? 'bg-pink-600 text-white' : 'bg-[#f472b6] text-white'} pointer-events-auto`}
             >
                 <Share2 size={20} />
                 <span className="font-zen">分享</span>
             </motion.button>
          </div>
      </div>

    </div>
  );
};