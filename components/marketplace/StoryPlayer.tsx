
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, MessageSquare, Send, Heart, Share2, ShoppingBag, Eye, Star, Info, Zap, ShieldCheck, BadgeCheck, Signal, Wifi, Battery, Gauge, Disc, HardDrive } from 'lucide-react';
import { Story, Profile } from '../../lib/types';

interface StoryPlayerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onNavigateStore: (userId: string) => void;
  currentUser: Profile;
}

const StoryPlayer: React.FC<StoryPlayerProps> = ({ stories, initialIndex, onClose, onNavigateStore, currentUser }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [tickerTime, setTickerTime] = useState(new Date());
  
  const story = stories[currentIndex];
  const duration = (story.duration_seconds || 5) * 1000;
  
  useEffect(() => {
    const timer = setInterval(() => setTickerTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [currentIndex, isPaused, duration]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-[600] bg-slate-950 flex items-center justify-center p-0 md:p-6 animate-fade-in font-opensans">
      {/* Background Reflection */}
      <div className="absolute inset-0 z-0">
         <img src={story.media_urls[0]} className="w-full h-full object-cover blur-3xl opacity-30" alt="" />
         <div className="absolute inset-0 bg-slate-950/90"></div>
      </div>

      {/* OMNI-GRID NEURAL CHASSIS */}
      <div className={`relative w-full max-w-lg h-full md:max-h-[92vh] aspect-[9/19] bg-[#0f172a] rounded-none md:rounded-[4.5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] border-none md:border-[6px] border-[#1e293b] overflow-hidden flex flex-col z-10 radiant-edge`}>
         
         <div className="flex-1 relative flex flex-col overflow-hidden bg-black md:rounded-[3.8rem]">
            
            <div className={`flex-1 relative flex flex-col overflow-hidden bg-effect-${story.bg_effect}`}>
               {story.content_type === 'text' ? (
                  <div className="flex-1 flex items-center justify-center p-12 text-center" style={{ backgroundColor: story.background_color, color: story.text_color }}>
                     <p className="text-4xl font-black leading-tight tracking-tight uppercase" style={{ fontFamily: story.font_family }}>{story.content_text}</p>
                  </div>
               ) : (
                  <img src={story.media_urls[0]} className="absolute inset-0 w-full h-full object-cover opacity-95 transition-all duration-[2000ms]" alt="" />
               )}

               <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/95 z-10 pointer-events-none"></div>

               {/* Navigation Overlay (Top) */}
               <div className="absolute top-8 left-0 w-full px-10 z-[60]">
                  <div className="flex gap-1.5 mb-10">
                     {stories.map((_, idx) => (
                        <div key={idx} className="h-[2.5px] flex-1 bg-white/20 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500 transition-all duration-100 ease-linear shadow-[0_0_8px_#3b82f6]" style={{ width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' }} />
                        </div>
                     ))}
                  </div>

                  <div className="flex justify-between items-center opacity-60">
                     <div className="flex flex-col">
                        <span className="text-[7px] font-black text-blue-500 uppercase tracking-widest leading-none">Sync Status</span>
                        <span className="text-[9px] font-black text-white mt-1 uppercase tracking-[0.3em]">Protocol_Active</span>
                     </div>
                     <div className="flex items-center gap-4 text-white">
                        <Signal size={14} />
                        <Wifi size={14} />
                        <Battery size={16} className="rotate-90" />
                     </div>
                  </div>
               </div>

               {/* SPATIAL IDENTITY HUD */}
               <div className={`hud-projection pos-${story.user_block_position || 'top-left'} hud-style-${story.user_block_style || 'standard'} cursor-pointer group`} onClick={() => onNavigateStore(story.user_id)}>
                 <div className="hud-content">
                    <div className="hud-avatar-shield">
                       <img src={story.user_avatar} className="hud-avatar" alt="" />
                       <div className="hud-avatar-scanner"></div>
                    </div>
                    <div className="hud-text-sector">
                       <div className="hud-name-row">
                          <p className="hud-user-name">{story.user_full_name}</p>
                          <BadgeCheck size={12} className="hud-verify-glyph" />
                       </div>
                       <p className="hud-node-label">Authorized Terminal</p>
                    </div>
                 </div>
               </div>

               {/* ASSET DATA */}
               <div className="absolute bottom-36 left-0 w-full px-10 z-50">
                  <div className="flex flex-col">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="h-[2px] w-8 bg-blue-500"></div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.5em]">LOG_INTEL</span>
                     </div>
                     <p className="text-2xl font-black text-white leading-tight uppercase tracking-tighter line-clamp-3" style={{ fontFamily: story.font_family }}>{story.title || 'NO_TITLE'}</p>
                  </div>
               </div>
            </div>

            {/* Interaction Regions */}
            <div className="absolute inset-0 flex z-20">
               <div className="flex-1 cursor-pointer" onClick={handlePrev}></div>
               <div className="flex-1 cursor-pointer" onMouseDown={() => setIsPaused(true)} onMouseUp={() => setIsPaused(false)} onTouchStart={() => setIsPaused(true)} onTouchEnd={() => setIsPaused(false)}></div>
               <div className="flex-1 cursor-pointer" onClick={handleNext}></div>
            </div>

            {/* Bottom Controls */}
            <div className="p-10 bg-gradient-to-t from-black via-black/90 to-transparent z-40">
               {story.linked_item_id && (
                  <button className="w-full mb-8 py-5 bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all">
                     <ShoppingBag size={20} /> Procure Asset_SKU
                  </button>
               )}
               <div className="flex items-center gap-5">
                  <input type="text" placeholder="Sync protocol response..." className="flex-1 bg-white/5 border border-white/10 rounded-full py-4 px-8 text-xs font-black text-white placeholder:text-white/20 outline-none focus:bg-white/10 transition-all" />
                  <button className="p-4 bg-white/5 rounded-full text-white hover:bg-rose-500/20 hover:text-rose-500 transition-all"><Heart size={24} strokeWidth={2.5} /></button>
               </div>
               <div className="mt-8 flex items-center justify-between opacity-30">
                  <p className="text-[8px] font-black text-white uppercase tracking-[0.4em]">Grid Latency: 12ms</p>
                  <p className="text-[8px] font-black text-white uppercase tracking-[0.4em]">{tickerTime.toLocaleTimeString([], {hour12:false})}</p>
               </div>
            </div>
         </div>

         <button onClick={onClose} className="absolute top-10 right-10 p-3 bg-black/40 hover:bg-black/60 rounded-2xl text-white transition-all backdrop-blur-xl border border-white/10 z-[100] shadow-2xl">
            <X size={24} />
         </button>
      </div>

      <style>{`
        .radiant-edge { box-shadow: 0 0 60px rgba(0, 82, 255, 0.15), inset 0 0 30px rgba(0, 82, 255, 0.05); }
        .hud-projection { position: absolute; z-index: 50; display: flex; transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: auto; padding: 2.5rem; width: auto; }
        .pos-top-left { top: 4.5rem; left: 0; }
        .pos-top-center { top: 4.5rem; left: 50%; transform: translateX(-50%); }
        .pos-top-right { top: 4.5rem; right: 0; }
        .pos-mid-left { top: 35%; left: 0; }
        .pos-mid-right { top: 35%; right: 0; }
        .pos-bottom-left { bottom: 9.5rem; left: 0; }
        .pos-bottom-center { bottom: 9.5rem; left: 50%; transform: translateX(-50%); }
        .pos-bottom-right { bottom: 9.5rem; right: 0; }

        .hud-content { display: flex; align-items: center; gap: 1.25rem; padding: 1.15rem 1.65rem; border-radius: 2.5rem; background: rgba(0,0,0,0.6); backdrop-filter: blur(50px) saturate(160%); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 30px 60px -15px rgba(0,0,0,0.8); }
        .hud-avatar-shield { position: relative; width: 3.5rem; height: 3.5rem; border-radius: 1.25rem; overflow: hidden; flex-shrink: 0; border: 1.5px solid rgba(255,255,255,0.3); }
        .hud-avatar { width: 100%; height: 100%; object-fit: cover; }
        .hud-avatar-scanner { position: absolute; inset: 0; background: linear-gradient(transparent, rgba(59, 130, 246, 0.4), transparent); background-size: 100% 4px; animation: scan-line 2.5s linear infinite; }
        .hud-user-name { font-size: 15px; font-weight: 900; color: white; letter-spacing: -0.01em; line-height: 1; }
        .hud-node-label { font-size: 9px; font-weight: 800; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.15em; opacity: 0.8; }
        .hud-verified-glyph { color: #3b82f6; }

        @keyframes scan-line { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
      `}</style>
    </div>
  );
};

export default StoryPlayer;
