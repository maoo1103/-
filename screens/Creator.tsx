import React, { useState, useRef } from 'react';
import { CakeConfig } from '../types';
import { generateCakeImage } from '../services/geminiService';
import { Wand2, ArrowLeft, Image as ImageIcon, X, Heart, Loader2, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreatorProps {
  onBack: () => void;
  onFinish: (config: CakeConfig) => void;
}

// Custom Sakura Star Button Component
const SakuraButton = ({ onClick, disabled, children, className = "" }: any) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`relative group w-16 h-16 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:grayscale ${className}`}
  >
     {/* Wings */}
     <svg className="absolute -left-6 top-1 w-8 h-8 text-white drop-shadow-md group-hover:-rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12C22 12 20 6 14 4C10 3 4 8 4 8C4 8 8 10 10 12C12 14 12 18 10 20C8 22 8 22 8 22C12 21 16 18 18 16C20 14 22 12 22 12Z" />
     </svg>
     <svg className="absolute -right-6 top-1 w-8 h-8 text-white drop-shadow-md transform scale-x-[-1] group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12C22 12 20 6 14 4C10 3 4 8 4 8C4 8 8 10 10 12C12 14 12 18 10 20C8 22 8 22 8 22C12 21 16 18 18 16C20 14 22 12 22 12Z" />
     </svg>
     
     {/* Pink Ring */}
     <div className="absolute inset-0 bg-[#fce7f3] border-[4px] border-[#f472b6] rounded-full shadow-lg flex items-center justify-center">
        {/* Yellow Star Background */}
        <div className="absolute inset-0 flex items-center justify-center">
           <svg viewBox="0 0 24 24" className="w-12 h-12 text-[#fbbf24] drop-shadow-sm" fill="currentColor">
               <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#d97706" strokeWidth="0.5" />
           </svg>
        </div>
     </div>
     
     {/* Icon Content */}
     <div className="relative z-10 text-[#be185d]">
         {children}
     </div>
  </button>
);

// New Background Component for the Wish/Card Step (Fallback)
const SakuraCardInputStyle = () => (
    <div className="absolute inset-0 w-full h-full bg-[#ffc4d6] overflow-hidden pointer-events-none select-none rounded-[20px]">
         {/* Pink Gradient Background - Made more vibrant */}
         <div className="absolute inset-0 bg-gradient-to-br from-[#ffe4e1] via-[#ffc4d6] to-[#ff9eb5] opacity-100" />

         {/* Rotating Magic Circle Container */}
         <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-[180%] h-[100%] aspect-square flex items-center justify-center">
                 {/* Increased glow and ensured yellow color */}
                 <div className="w-full h-full animate-[spin_30s_linear_infinite] opacity-70">
                     <svg viewBox="0 0 500 500" className="w-full h-full text-[#fcd34d] drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]">
                        <defs>
                            <filter id="glow-magic" x="-20%" y="-20%" width="140%" height="140%">
                               <feGaussianBlur stdDeviation="4" result="blur" />
                               <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        
                        <g filter="url(#glow-magic)">
                             {/* Outer Rings */}
                             <circle cx="250" cy="250" r="240" fill="none" stroke="currentColor" strokeWidth="3" />
                             <circle cx="250" cy="250" r="225" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="20 15" />
                             <circle cx="250" cy="250" r="210" fill="none" stroke="currentColor" strokeWidth="2" />
                             
                             {/* Geometric Star Pattern */}
                             <g opacity="0.9">
                                <rect x="140" y="140" width="220" height="220" fill="none" stroke="currentColor" strokeWidth="3" transform="rotate(45 250 250)" />
                                <rect x="140" y="140" width="220" height="220" fill="none" stroke="currentColor" strokeWidth="3" />
                             </g>
                             
                             {/* Hexagram Elements */}
                             <path d="M250 30 L440 360 L60 360 Z" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.8" />
                             <path d="M250 470 L60 140 L440 140 Z" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.8" />

                             {/* Center Details */}
                             <circle cx="250" cy="250" r="60" fill="none" stroke="currentColor" strokeWidth="4" />
                             <circle cx="250" cy="250" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                             <path d="M250 190 L250 310 M190 250 L310 250" stroke="currentColor" strokeWidth="2" />
                             
                             {/* Planetary Symbols / Dots */}
                             <circle cx="250" cy="20" r="10" fill="currentColor" />
                             <circle cx="250" cy="480" r="10" fill="currentColor" />
                             <circle cx="20" cy="250" r="10" fill="currentColor" />
                             <circle cx="480" cy="250" r="10" fill="currentColor" />
                        </g>
                     </svg>
                 </div>
             </div>
         </div>
         
         {/* Subtle Sparkles Overlay */}
         <div className="absolute inset-0 opacity-60">
             <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse shadow-[0_0_5px_white]"></div>
             <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-yellow-200 rounded-full animate-pulse delay-75 shadow-[0_0_5px_yellow]"></div>
             <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-150"></div>
         </div>
    </div>
);

export const Creator: React.FC<CreatorProps> = ({ onBack, onFinish }) => {
  const [step, setStep] = useState<'generate' | 'preview' | 'card'>('generate');
  
  // State
  const [cakeImage, setCakeImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Card Flow
  const [cardMessage, setCardMessage] = useState('');
  const [isCardClosing, setIsCardClosing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt && !uploadedImage && !cakeImage) return;
    setIsGenerating(true);
    
    let referenceImage = cakeImage;
    let isRefinement = !!cakeImage && !uploadedImage; 

    if (uploadedImage) {
        referenceImage = uploadedImage;
        isRefinement = false;
    }

    const generatedImage = await generateCakeImage(prompt, referenceImage || undefined, isRefinement);
    
    if (generatedImage) {
        setCakeImage(generatedImage);
        // Do not clear uploadedImage so we can use it as background in final view
        // setUploadedImage(null); 
        setPrompt(''); 
        setStep('preview');
    } else {
        alert("魔法失效了，请重试！");
    }
    setIsGenerating(false);
  };

  const handleSaveCard = () => {
      if(!cardMessage.trim()) return;
      setIsCardClosing(true);
      
      setTimeout(() => {
          onFinish({ 
              imageUrl: cakeImage!, 
              prompt: prompt,
              message: cardMessage,
              originalImage: uploadedImage || undefined // Pass the uploaded image
          });
      }, 800);
  };

  return (
    <div className="flex flex-col h-full relative">
      
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-50 p-4 flex justify-between items-center pointer-events-none">
        <div className="pointer-events-auto">
             <button onClick={onBack} className="p-2 bg-white/40 backdrop-blur-md rounded-full hover:bg-white/60 text-pink-600 transition shadow-sm border border-pink-200">
                <ArrowLeft size={20} />
            </button>
        </div>
      </div>

      {/* Main Canvas Area (2D Image) */}
      <div className="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden p-6 pb-32 z-10">
        {isGenerating ? (
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-200 blur-2xl opacity-40 rounded-full animate-pulse"></div>
                    <Star className="animate-spin text-yellow-400" size={64} fill="currentColor" />
                </div>
                <p className="text-pink-600 font-bold animate-pulse tracking-widest uppercase text-xl mt-4 font-quentin">
                    Magic Generating...
                </p>
            </div>
        ) : cakeImage ? (
            <div className="relative w-full max-w-md h-[60vh]">
                 <motion.img 
                    initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    src={cakeImage} 
                    alt="Generated Cake" 
                    className="w-full h-full object-contain drop-shadow-2xl select-none"
                    draggable={false}
                 />
            </div>
        ) : (
            <div className="text-center opacity-80 px-8 text-pink-700">
                <Heart size={64} className="mx-auto mb-4 text-pink-300 animate-pulse" fill="currentColor" />
                <p className="text-3xl font-bold tracking-wide text-pink-500 font-quentin">Summon Cake</p>
                <p className="text-lg mt-2 text-pink-400 font-zen">上传图片，开始制作魔法蛋糕吧~</p>
                {uploadedImage && <p className="text-lg mt-2 text-pink-600 font-bold bg-white/50 px-2 py-1 rounded-lg inline-block font-zen">(参考图已就绪)</p>}
            </div>
        )}
      </div>

      {/* CONTROLS */}
      {step !== 'card' && (
        <div className="absolute bottom-0 w-full bg-white/60 backdrop-blur-xl rounded-t-[30px] p-6 shadow-[0_-10px_40px_rgba(255,182,193,0.3)] border-t border-pink-200 z-50">
             {/* Uploaded Reference Preview - Only show if not yet generated or if generated but want to show source */}
             {uploadedImage && !cakeImage && (
                 <div className="relative w-16 h-16 mb-2 rounded-lg overflow-hidden border-2 border-pink-200 shadow-sm mx-auto sm:mx-0">
                     <img src={uploadedImage} alt="Ref" className="w-full h-full object-cover" />
                     <button 
                        onClick={() => { setUploadedImage(null); }}
                        className="absolute top-0 right-0 bg-pink-500 text-white p-0.5 rounded-bl"
                     >
                         <X size={12}/>
                     </button>
                 </div>
             )}

             <div className="flex gap-4 items-center justify-center">
                 {/* Upload Button */}
                 <div className="flex flex-col items-center">
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                    />
                    <SakuraButton onClick={() => fileInputRef.current?.click()} title="上传参考图">
                        <ImageIcon size={20} strokeWidth={2.5} />
                    </SakuraButton>
                 </div>

                 {/* Text Input */}
                 <div className="flex-1">
                     <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="描述你的魔法蛋糕（例如：'粉色翅膀和星星'）..."
                        className="w-full bg-white border-2 border-pink-200 rounded-xl px-4 py-3 text-lg text-pink-700 focus:ring-2 focus:ring-pink-400 outline-none resize-none h-16 placeholder:text-pink-300 font-zen"
                     />
                 </div>
                 
                 {/* Generate Button */}
                 <div className="flex flex-col items-center">
                     <SakuraButton 
                        onClick={handleGenerate}
                        disabled={isGenerating || (!prompt && !uploadedImage)}
                     >
                        {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} strokeWidth={2.5} />}
                     </SakuraButton>
                 </div>
             </div>

             {/* Action Buttons if cake exists */}
             {cakeImage && !isGenerating && (
                 <div className="flex justify-center mt-4 border-t border-pink-200 pt-4">
                     <button 
                        onClick={() => setStep('card')}
                        className="px-8 py-3 bg-pink-500 text-white rounded-full shadow-lg font-bold text-xl flex items-center gap-2 hover:bg-pink-600 transition tracking-widest font-quentin"
                     >
                         <span className="font-zen">编写库洛牌</span> <ArrowLeft className="rotate-180" size={16}/>
                     </button>
                 </div>
             )}
        </div>
      )}

      {/* STEP 3: CARD OVERLAY - WRITING THE WISH (UPDATED LAYOUT) */}
      <AnimatePresence>
        {step === 'card' && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] bg-pink-900/60 backdrop-blur-md flex items-center justify-center p-4"
            >
                <motion.div 
                    initial={{ rotateY: -90, scale: 0.8 }}
                    animate={isCardClosing ? { rotateY: 90, scale: 0.5, opacity: 0 } : { rotateY: 0, scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="relative w-full max-w-[340px] aspect-[9/16] rounded-[20px] shadow-2xl overflow-hidden border-[6px] border-[#ffc4d6]"
                    style={{ 
                        boxShadow: '0 0 50px rgba(255, 196, 214, 0.4)'
                    }}
                >
                     {/* 1. Background Layer: Always use Sakura/Magic Circle background */}
                     <SakuraCardInputStyle />

                     {/* 2. Text Input Area (Top) - PRESERVED LAYOUT */}
                     <div className="relative z-10 w-full px-6 pt-16 flex justify-center">
                         {/* Rounded Rectangle Container */}
                         <div className="w-full h-[180px] bg-white/70 backdrop-blur-md border border-pink-300 rounded-lg p-5 shadow-sm relative">
                             <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-pink-300 opacity-50"></div>
                             <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-pink-300 opacity-50"></div>
                             
                             <textarea 
                                className="w-full h-full bg-transparent resize-none outline-none text-lg text-slate-800 text-center placeholder:text-pink-400/60 leading-relaxed font-zen"
                                placeholder="在这里写下你的祝福..."
                                value={cardMessage}
                                onChange={(e) => setCardMessage(e.target.value)}
                                autoFocus
                            />
                         </div>
                     </div>

                     {/* 3. Bottom Controls (Fixed at bottom corners) - PRESERVED LAYOUT */}
                     <div className="absolute bottom-8 left-0 w-full px-8 flex justify-between items-end z-20">
                         {/* Back Button */}
                         <button 
                            onClick={() => setStep('generate')}
                            className="text-[#d46a6a]/80 hover:text-[#d46a6a] text-sm font-bold uppercase tracking-wider font-zen bg-white/40 px-3 py-1 rounded-full backdrop-blur-sm"
                        >
                            返回
                        </button>

                        {/* Seal Button */}
                        <button 
                            onClick={handleSaveCard}
                            disabled={!cardMessage}
                            className="bg-[#ffc4d6] text-[#c05b6b] px-6 py-2 rounded-full text-lg font-bold shadow-lg hover:bg-[#ffb7c5] disabled:opacity-50 flex items-center gap-2 font-zen border-2 border-[#ff9eb5]"
                        >
                            <Sparkles size={16} /> 封印
                        </button>
                     </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};