
import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, Send, Sparkles, BrainCircuit, Loader2, 
  Image as ImageIcon, Zap, Type, ShoppingBag, BarChart2, 
  Clock, Palette, Layout, RefreshCw, ShieldCheck, Eye, 
  Trash2, Smartphone, Monitor, Layers, Wand2, ArrowRight,
  Cpu, Target, Activity, Terminal, Binary, Fingerprint, 
  Scan, Radio, Orbit, Settings2, ChevronDown, PlusCircle,
  Globe, UploadCloud, Link as LinkIcon, Heart, Wand, Move,
  Eraser, MousePointer2, AlignJustify, Video, Film, Tv, CloudLightning,
  MonitorCheck, Crosshair, AlertTriangle, ShieldAlert, Building2,
  Radiation, Terminal as TerminalIcon, FlaskConical, Ghost, Skull,
  FileText, Megaphone, Newspaper, ShoppingCart, ZapOff, Ghost as GhostIcon,
  History, BadgeCheck, UserCircle, Hexagon, BoxSelect, Droplets, Contrast,
  Square, Wind, Zap as ZapIcon, Cpu as CpuIcon, Waves, Scan as ScanIcon,
  Mic, Eye as EyeIcon, Radio as RadarIcon, Share2
} from 'lucide-react';
import { Story, Profile, StoryContentType, CTAActionType } from '../../lib/types';
import { MOCK_ITEMS } from '../../lib/constants';
import { enhanceStory, generateCreativeStoryStyle } from '../../lib/gemini';

interface StoryComposerProps {
  currentUser: Profile;
  onBack: () => void;
  onSave: (story: Story) => void;
  initialItemId?: string;
}

const IDENTITY_PRESETS = [
  { id: 'nexus', label: 'Core Tech', icon: <Building2 size={14}/>, context: 'Standard WMS Update', colors: { bg: '#0f172a', text: '#ffffff' }, font: 'Montserrat', animation: 'slide', fx: 'none' },
  { id: 'market', label: 'Flash Sale', icon: <Zap size={14}/>, context: 'Active Marketplace', colors: { bg: '#ff0055', text: '#ffffff' }, font: 'Orbitron', animation: 'neon', fx: 'rgbpulse' },
  { id: 'blog', label: 'Field Log', icon: <Newspaper size={14}/>, context: 'Operational Narrative', colors: { bg: '#f8fafc', text: '#0f172a' }, font: 'Montserrat', animation: 'subtitle', fx: 'kenburns' },
  { id: 'ad', label: 'Asset Promo', icon: <Megaphone size={14}/>, context: 'Premium Promotion', colors: { bg: '#0052FF', text: '#ffffff' }, font: 'michroma', animation: 'zoom', fx: 'drift' },
  { id: 'urgent', label: 'Grid Alert', icon: <ShieldAlert size={14}/>, context: 'Priority Comms', colors: { bg: '#fbbf24', text: '#000000' }, font: 'pressstart', animation: 'glitch', fx: 'crt' },
  { id: 'minimal', label: 'Clean Hub', icon: <GhostIcon size={14}/>, context: 'Aesthetic Focus', colors: { bg: '#ffffff', text: '#64748b' }, font: 'Syncopate', animation: 'fade', fx: 'none' },
  { id: 'cyber', label: 'Ghost Grid', icon: <Binary size={14}/>, context: 'Subterranean Logistics', colors: { bg: '#000000', text: '#00ffcc' }, font: 'Rajdhani', animation: 'hologram', fx: 'matrix' },
  { id: 'classic', label: 'Legacy Sync', icon: <History size={14}/>, context: 'Archive Data', colors: { bg: '#334155', text: '#e2e8f0' }, font: 'pressstart', animation: 'typewriter', fx: 'crt' },
  { id: 'blueprint', label: 'Spec Draft', icon: <Layers size={14}/>, context: 'Technical Blueprint', colors: { bg: '#1e3a8a', text: '#ffffff' }, font: 'majormono', animation: 'reveal', fx: 'none' },
  { id: 'luxe', label: 'Premium S', icon: <Sparkles size={14}/>, context: 'High-Value Transit', colors: { bg: '#1c1917', text: '#fde047' }, font: 'Montserrat', animation: 'glow', fx: 'kenburns' },
];

const USER_BLOCK_STYLES = [
  { id: 'standard', label: 'Glass', icon: <Droplets size={12}/> },
  { id: 'glitch', label: 'Glitch', icon: <ZapIcon size={12}/> },
  { id: 'phantom', label: 'Ghost', icon: <Ghost size={12}/> },
  { id: 'scanner', label: 'Scan', icon: <ScanIcon size={12}/> },
  { id: 'plasma', label: 'Liquid', icon: <Waves size={12}/> },
  { id: 'radar', label: 'Ping', icon: <RadarIcon size={12}/> },
  { id: 'aurora', label: 'Atmosphere', icon: <Wind size={12}/> },
  { id: 'monochrome', label: 'Ink', icon: <Contrast size={12}/> },
  { id: 'tactical', label: 'Tactic', icon: <Target size={12}/> },
  { id: 'terminal', label: 'Code', icon: <TerminalIcon size={12}/> },
  { id: 'prismatic', label: 'Prism', icon: <Sparkles size={12}/> },
  { id: 'brutalist', label: 'Raw', icon: <Square size={12}/> }
];

const ITEM_CARD_STYLES = [
  { id: 'standard', label: 'Nexus Pro' },
  { id: 'cyber', label: 'Neon Edge' },
  { id: 'hazard', label: 'Alert Bar' },
  { id: 'blueprint', label: 'Grid Spec' },
  { id: 'luxury', label: 'Gold Trim' },
  { id: 'minimal', label: 'Floating' },
  { id: 'terminal', label: 'CRT Data' },
  { id: 'liquid', label: 'Gradient' },
  { id: 'flash', label: 'Pulse' },
  { id: 'deep', label: 'Shadow' }
];

const FONTS = [
  { id: 'Montserrat', label: 'Montserrat' },
  { id: 'Orbitron', label: 'Orbitron' },
  { id: 'Rajdhani', label: 'Rajdhani' },
  { id: 'Syncopate', label: 'Syncopate' },
  { id: 'majormono', label: 'Major Mono' },
  { id: 'michroma', label: 'Michroma' },
  { id: 'pressstart', label: '8-Bit Retro' }
];

const ANIMATIONS = [
  { id: 'fade', label: 'Neural Fade' },
  { id: 'slide', label: 'Kinetic Slide' },
  { id: 'glow', label: 'Pulse Glow' },
  { id: 'zoom', label: 'Spatial Zoom' },
  { id: 'glitch', label: 'Cyber Glitch' },
  { id: 'hologram', label: 'Holo-Projection' },
  { id: 'neon', label: 'Neon Flare' },
  { id: 'subtitle', label: 'Cinematic wide' },
  { id: 'typewriter', label: 'Protocol Type' },
  { id: 'reveal', label: 'Sector Reveal' }
];

const BG_EFFECTS = [
  { id: 'none', label: 'Clean' },
  { id: 'kenburns', label: 'Ken Burns Zoom' },
  { id: 'crt', label: 'CRT Terminal' },
  { id: 'drift', label: 'Parallax Drift' },
  { id: 'matrix', label: 'Digital Rain' },
  { id: 'rgbpulse', label: 'RGB Pulse' }
] as const;

const AI_STAGES = [
  "Mapping Contextual Vectors...",
  "Calibrating Neural Color Space...",
  "Optimizing Reading Flow...",
  "Synthesizing Visual Identity...",
  "Deploying Creative Archetype..."
];

const StoryComposer: React.FC<StoryComposerProps> = ({ currentUser, onBack, onSave, initialItemId }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isStyleAiLoading, setIsStyleAiLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  
  const [formData, setFormData] = useState<Partial<Story>>({
    title: '',
    content_type: 'image',
    content_text: '',
    media_urls: [],
    background_color: '#0f172a',
    text_color: '#ffffff',
    font_family: 'Montserrat',
    animation_effect: 'slide',
    bg_effect: 'none',
    show_grain: true,
    auto_scroll: false,
    scroll_speed: 15,
    duration_seconds: 43200,
    allow_replies: true,
    call_to_action_type: 'view_item',
    call_to_action_text: 'Procure Asset',
    linked_item_id: initialItemId || '',
    tags: [],
    status: 'draft',
    card_style: 'nexus',
    item_card_style: 'standard',
    user_block_style: 'standard'
  });

  const selectedItem = MOCK_ITEMS.find(i => i.id === formData.linked_item_id);

  useEffect(() => {
    if (selectedItem) {
      setFormData(prev => ({ 
        ...prev, 
        title: selectedItem.title,
        media_urls: prev.media_urls?.length === 0 ? [selectedItem.image_url || ''] : prev.media_urls
      }));
    }
  }, [formData.linked_item_id, selectedItem]);

  const applyPreset = (presetId: string) => {
    const preset = IDENTITY_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    setFormData(prev => ({
      ...prev,
      card_style: presetId,
      background_color: preset.colors.bg,
      text_color: preset.colors.text,
      font_family: preset.font,
      animation_effect: preset.animation,
      bg_effect: preset.fx as any
    }));
  };

  const handleMagicStyle = async () => {
    setIsStyleAiLoading(true);
    setLoadingStage(0);
    
    const stageInterval = setInterval(() => {
      setLoadingStage(prev => (prev + 1) % AI_STAGES.length);
    }, 1200);

    try {
      const style = await generateCreativeStoryStyle(formData.content_text || '', selectedItem?.title);
      setFormData(prev => ({
        ...prev,
        title: style.title || prev.title,
        content_text: style.content_text || prev.content_text,
        background_color: style.background_color || prev.background_color,
        text_color: style.text_color || prev.text_color,
        font_family: style.font_family || prev.font_family,
        animation_effect: style.animation_effect || prev.animation_effect,
        bg_effect: style.bg_effect || (BG_EFFECTS[Math.floor(Math.random() * BG_EFFECTS.length)].id as Story['bg_effect']),
        card_style: 'custom'
      }));
      await new Promise(r => setTimeout(r, 1000));
    } finally {
      clearInterval(stageInterval);
      setIsStyleAiLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Verify: Purge all active creative buffers?')) {
      setFormData({
        ...formData,
        title: '',
        content_text: '',
        media_urls: [],
        bg_effect: 'none',
        show_grain: true,
        tags: [],
        linked_item_id: '',
        card_style: 'nexus',
        item_card_style: 'standard',
        user_block_style: 'standard',
        auto_scroll: false
      });
    }
  };

  const handleEnhance = async () => {
    if (!formData.content_text) {
        alert("Log narrative context first.");
        return;
    }
    setIsAiLoading(true);
    try {
      const result = await enhanceStory(formData.content_text);
      if (result) {
        setFormData(prev => ({
          ...prev,
          title: result.title || prev.title,
          content_text: result.content || prev.content_text,
          tags: result.suggested_tags || prev.tags
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCommit = () => {
    const newStory: Story = {
      ...formData as Story,
      id: `s-${Date.now()}`,
      user_id: currentUser.id,
      user_full_name: currentUser.full_name,
      user_avatar: currentUser.avatar_url || '',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + (formData.duration_seconds || 86400) * 1000).toISOString(),
      view_count: 0,
      reply_count: 0,
      share_count: 0,
      swipe_up_count: 0,
      poll_vote_count: 0,
      status: 'active',
      requires_moderation: false,
      moderation_status: 'approved',
      is_highlight: false,
      has_sound: false,
      allow_sharing: true,
      show_view_count: true,
      tags: formData.tags || [],
      mentions: [],
      hashtags: []
    };
    onSave(newStory);
  };

  const headlineLimit = 40;

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex flex-col font-roboto animate-fade-in overflow-x-hidden selection:bg-blue-100 selection:text-blue-900 text-slate-800 relative z-[200]">
      
      {/* 1. Header Navigation */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-10 flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold text-sm"
        >
          <ChevronLeft size={18} />
          Cancel
        </button>
        <div className="flex gap-4">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-400 rounded-full text-[11px] font-black uppercase tracking-widest hover:text-red-500 hover:border-red-200 transition-all shadow-sm active:scale-95"
          >
            <Eraser size={14} /> Reset Buffer
          </button>
          <button 
            onClick={handleMagicStyle}
            disabled={isStyleAiLoading}
            className="flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95 disabled:opacity-50 group"
          >
            {isStyleAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} className="text-yellow-400 group-hover:rotate-12 transition-transform" />}
            Alchemy AI
          </button>
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-12 justify-center items-start pb-20">
        
        {/* --- LEFT: FORM SECTION --- */}
        <div className="w-full lg:w-[540px] bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 md:p-10 space-y-8 animate-scale-up h-auto overflow-visible">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlusCircle size={28} className="text-blue-600 fill-blue-50" />
                <h2 className="text-2xl font-black tracking-tight text-slate-900 font-montserrat">NEXUS STUDIO</h2>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={handleEnhance} 
                   className="text-[10px] font-black text-blue-600 uppercase flex items-center gap-1.5 hover:underline disabled:opacity-50" 
                   disabled={isAiLoading}
                 >
                   {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Neural Polish
                 </button>
              </div>
           </div>

           {/* Field: Image Upload */}
           <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Deployment Visual</label>
              <div className="relative aspect-[16/9] bg-white border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer overflow-hidden">
                {formData.media_urls?.[0] ? (
                  <>
                    <img src={formData.media_urls[0]} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <button onClick={(e) => { e.stopPropagation(); setFormData({...formData, media_urls: []}); }} className="p-3 bg-white rounded-full text-red-500 shadow-xl"><Trash2 size={20}/></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 group-hover:text-blue-600 transition-colors">
                      <ImageIcon size={32} />
                    </div>
                    <p className="text-sm font-bold text-slate-800">Drop hub visual here</p>
                    <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-widest">9:16 vertical mapping active</p>
                  </>
                )}
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFormData({...formData, media_urls: [URL.createObjectURL(file)]});
                }} />
              </div>
           </div>

           {/* HYPER COMPACT Identity Block Style Picker */}
           <div className="space-y-3">
              <div className="flex items-center justify-between ml-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <UserCircle size={14} className="text-[#0052FF]" /> Identity Live HUD
                 </label>
                 <span className="text-[8px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Neural v3</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 px-1 -mx-1 snap-x">
                 {USER_BLOCK_STYLES.map(style => (
                   <button 
                     key={style.id}
                     onClick={() => setFormData({...formData, user_block_style: style.id})}
                     className={`flex flex-col items-center gap-1.5 shrink-0 px-2.5 py-3 rounded-xl border transition-all snap-start min-w-[54px] ${
                       formData.user_block_style === style.id 
                       ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20 scale-110 z-10' 
                       : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-slate-50'
                     }`}
                     title={style.label}
                   >
                     <div className={`transition-all ${formData.user_block_style === style.id ? 'text-white' : 'text-slate-400'}`}>
                        {style.icon}
                     </div>
                     <span className="text-[7px] font-black uppercase tracking-tighter text-center">{style.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           {/* Identity Presets Matrix */}
           <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Palette size={14} className="text-blue-500" /> Color Preset Matrix
              </label>
              <div className="grid grid-cols-5 gap-3">
                 {IDENTITY_PRESETS.map(style => (
                   <button 
                     key={style.id}
                     onClick={() => applyPreset(style.id)}
                     className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all relative group ${
                       formData.card_style === style.id 
                       ? 'border-blue-500 bg-blue-50 shadow-lg scale-105 ring-2 ring-blue-500/20' 
                       : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-200'
                     }`}
                     title={style.context}
                   >
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center shadow-sm"
                        style={{ backgroundColor: style.colors.bg, color: style.colors.text }}
                      >
                         {style.icon}
                      </div>
                      <span className="text-[7px] font-black uppercase text-center leading-tight px-1">{style.label}</span>
                      {formData.card_style === style.id && <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>}
                   </button>
                 ))}
              </div>
           </div>

           {/* Item Card Preset Matrix */}
           <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <ShoppingCart size={14} className="text-[#0052FF]" /> Asset Card Identity
              </label>
              <div className="grid grid-cols-5 gap-3">
                 {ITEM_CARD_STYLES.map(style => (
                   <button 
                     key={style.id}
                     onClick={() => setFormData({...formData, item_card_style: style.id})}
                     className={`aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center gap-1.5 ${
                       formData.item_card_style === style.id 
                       ? 'border-blue-600 bg-blue-50 shadow-lg scale-105' 
                       : 'border-slate-100 bg-slate-50 hover:bg-white'
                     }`}
                   >
                      <div className={`w-8 h-4 rounded-sm shadow-inner card-thumb-${style.id}`}></div>
                      <span className="text-[7px] font-black uppercase text-center">{style.label}</span>
                   </button>
                 ))}
              </div>
           </div>

           {/* Style Suite Panel */}
           <div className="space-y-6 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <MonitorCheck size={14} className="text-blue-500" /> Kinetic Attributes
                </h3>
                <div className="flex gap-2">
                   <button 
                     onClick={() => setFormData({...formData, auto_scroll: !formData.auto_scroll})}
                     className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${formData.auto_scroll ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-400'}`}
                   >Long Read Scroll</button>
                   <button 
                     onClick={() => setFormData({...formData, show_grain: !formData.show_grain})}
                     className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${formData.show_grain ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400'}`}
                   >Film Grain</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Typography Node</p>
                    <select 
                      value={formData.font_family}
                      onChange={e => setFormData({...formData, font_family: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:border-blue-500 transition-colors shadow-sm"
                    >
                      {FONTS.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Reveal Protocol</p>
                    <select 
                      value={formData.animation_effect}
                      onChange={e => setFormData({...formData, animation_effect: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-3 text-[10px] font-black uppercase tracking-widest outline-none appearance-none cursor-pointer focus:border-blue-500 transition-colors shadow-sm"
                    >
                      {ANIMATIONS.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
                    </select>
                </div>
                {formData.auto_scroll && (
                  <div className="md:col-span-2 space-y-2 animate-fade-in">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Scroll Velocity: {formData.scroll_speed}s cycle</p>
                     <input 
                       type="range" min="5" max="40" step="5"
                       value={formData.scroll_speed}
                       onChange={e => setFormData({...formData, scroll_speed: Number(e.target.value)})}
                       className="w-full accent-blue-600"
                     />
                  </div>
                )}
              </div>
           </div>

           {/* Content Fields */}
           <div className="space-y-6">
              <div className="space-y-3">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Global Headline</label>
                 <input 
                   type="text" 
                   value={formData.title}
                   onChange={(e) => setFormData({...formData, title: e.target.value.slice(0, headlineLimit)})}
                   placeholder="Input punchy headline..."
                   className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/[0.03] focus:bg-white transition-all placeholder:text-slate-300"
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Deployment Context</label>
                 <textarea 
                   value={formData.content_text}
                   onChange={(e) => setFormData({...formData, content_text: e.target.value})}
                   placeholder="Log spatial data for this deployment..."
                   className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none h-32 resize-none focus:ring-4 focus:ring-blue-500/[0.03] focus:bg-white transition-all placeholder:text-slate-300 leading-relaxed"
                 />
              </div>

              <div className="space-y-3">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                   <LinkIcon size={14} className="text-slate-400" /> Map to Neural SKU
                 </label>
                 <select 
                   value={formData.linked_item_id || ''}
                   onChange={(e) => setFormData({...formData, linked_item_id: e.target.value})}
                   className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none appearance-none cursor-pointer focus:bg-white transition-all text-slate-700"
                 >
                   <option value="">No Active Link</option>
                   {MOCK_ITEMS.map(i => <option key={i.id} value={i.id}>{i.title} [{i.inventory_number}]</option>)}
                 </select>
              </div>
           </div>

           {/* Publish Sector */}
           <div className="pt-4 border-t border-slate-50 flex flex-col gap-4">
              <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-1">
                {[
                  { label: '6hour', val: 21600 },
                  { label: '12hour', val: 43200 },
                  { label: '48hours', val: 172800 }
                ].map(opt => (
                  <button 
                    key={opt.val}
                    onClick={() => setFormData({...formData, duration_seconds: opt.val})}
                    className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.duration_seconds === opt.val 
                      ? 'bg-blue-600 text-white shadow-xl' 
                      : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleCommit}
                className="w-full py-6 bg-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
              >
                 <Globe size={20} className="group-hover:rotate-12 transition-transform" />
                 Publish
              </button>
           </div>
        </div>

        {/* --- RIGHT: PREVIEW SECTION --- */}
        <div className="w-full lg:w-[440px] flex flex-col items-center lg:sticky lg:top-10">
           <div className="flex items-center gap-2 mb-8 text-slate-500 font-bold text-sm uppercase tracking-widest font-ui">
              <Eye size={18} className="text-blue-500" /> Spatial Projection
           </div>

           {/* DEVICE FRAME */}
           <div 
             className={`w-[320px] aspect-[9/18.5] bg-[#020617] rounded-[3.5rem] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.5)] border-[12px] border-[#1e293b] overflow-hidden relative flex flex-col ring-1 ring-white/10 group/device style-preset-${formData.card_style}`}
           >
              
              {/* Content viewport */}
              <div 
                className={`flex-1 relative flex items-center justify-center overflow-hidden transition-colors duration-1000 bg-effect-${formData.bg_effect}`} 
                style={{ backgroundColor: formData.media_urls?.[0] ? 'transparent' : formData.background_color }}
              >
                 {formData.media_urls?.[0] ? (
                    <img src={formData.media_urls[0]} className={`absolute inset-0 w-full h-full object-cover animate-fade-in transition-all grayscale-[10%] bg-img-${formData.bg_effect}`} />
                 ) : (
                    <div className="flex flex-col items-center gap-4 animate-pulse opacity-20 text-white">
                       <ImageIcon size={48} />
                       <p className="text-[10px] font-black uppercase tracking-[0.3em]">No Visual Signal</p>
                    </div>
                 )}

                 {/* System Overlays */}
                 <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none z-10"></div>
                 {formData.show_grain && <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-[grain_0.2s_steps(4)_infinite]"></div>}
                 {formData.bg_effect === 'crt' && <div className="absolute inset-0 pointer-events-none z-20 crt-lines"></div>}
                 {formData.bg_effect === 'matrix' && <div className="absolute inset-0 pointer-events-none z-20 matrix-effect opacity-30"></div>}
                 
                 <div className="absolute inset-0 border-[30px] border-transparent shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] pointer-events-none z-10"></div>

                 {/* Profile Identity Block (REFACTORED LIVE VERSIONS) */}
                 <div className={`user-block-container user-block-style-${formData.user_block_style}`}>
                    <div className="user-block-background"></div>
                    <div className="user-block-inner">
                       <div className="user-block-avatar-frame">
                          <img src={currentUser.avatar_url} className="user-block-avatar" />
                          <div className="user-block-avatar-ring"></div>
                          <div className="user-block-live-fx"></div>
                       </div>
                       <div className="user-block-info">
                          <div className="user-block-title-row">
                             <p className="user-block-name">{currentUser.full_name}</p>
                             <div className="user-block-verification">
                                <BadgeCheck size={10} strokeWidth={3} />
                             </div>
                          </div>
                          <div className="user-block-subtitle-container">
                             <p className="user-block-subtitle">Authorized operator</p>
                             <div className="user-block-pulse-dot"></div>
                          </div>
                       </div>
                    </div>
                    <div className="user-block-accent"></div>
                    <div className="user-block-scanline"></div>
                 </div>

                 {/* Foreground Content */}
                 <div className="relative z-30 w-full px-8 text-left mt-auto pb-32">
                    <h3 
                      className={`font-black leading-tight uppercase tracking-tighter mb-4 animation-${formData.animation_effect} fx-text-${formData.animation_effect}`} 
                      style={{ 
                        color: formData.text_color, 
                        fontFamily: formData.font_family === 'pressstart' ? '"Press Start 2P"' : formData.font_family === 'majormono' ? '"Major Mono Display"' : formData.font_family === 'michroma' ? 'Michroma' : formData.font_family,
                        fontSize: formData.font_family === 'pressstart' ? '12px' : formData.font_family === 'majormono' ? '18px' : '26px'
                      }}
                    >
                       {formData.title || 'INITIALIZING...'}
                    </h3>
                    
                    <div className={`relative min-h-[40px] max-h-[160px] overflow-hidden ${formData.auto_scroll ? 'mask-gradient' : ''}`}>
                       <p 
                         className={`text-[13px] font-medium leading-relaxed opacity-90 animation-${formData.animation_effect} fx-text-${formData.animation_effect} ${formData.auto_scroll ? 'animate-crawl-scroll' : 'line-clamp-4'}`}
                         style={{ 
                           color: formData.text_color, 
                           fontFamily: formData.font_family === 'pressstart' ? '"Press Start 2P"' : 'inherit',
                           fontSize: formData.font_family === 'pressstart' ? '10px' : '13px',
                           animationDuration: `${formData.scroll_speed}s`
                         }}
                       >
                          {formData.content_text || 'Establishing neural link with distribution node RU-01...'}
                          {formData.auto_scroll && <><br/><br/>{formData.content_text}</>}
                       </p>
                    </div>

                    {/* DYNAMIC LINKED ITEM CARD */}
                    {formData.linked_item_id && selectedItem && (
                       <div className={`mt-8 relative group/card animate-slide-up item-card-style-${formData.item_card_style}`}>
                          <div className="card-shadow-element"></div>
                          
                          <div className="card-main-container">
                             <div className="card-scan-line" />
                             
                             <div className="flex items-center gap-4 min-w-0 relative z-10">
                                <div className="card-visual-wrapper">
                                   <img src={selectedItem.image_url} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                   <div className="card-badge-row">
                                      <div className="card-pulse-dot"></div>
                                      <p className="card-badge-text">CORE ASSET</p>
                                   </div>
                                   <h4 className="card-title">{selectedItem.title}</h4>
                                   <div className="card-price-row">
                                      <p className="card-price-value">{selectedItem.price.toLocaleString()}</p>
                                      <p className="card-price-currency">RUB</p>
                                   </div>
                                </div>
                             </div>
                             
                             <div className="card-action-button">
                                <ArrowRight size={18} strokeWidth={3} />
                             </div>
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Interaction Simulator */}
                 <div className="absolute bottom-8 left-0 w-full px-8 z-40 flex items-center gap-4">
                    <div className="flex-1 h-14 bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-full px-6 flex items-center shadow-inner group-hover/device:bg-white/[0.08] transition-all">
                       <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">SYNC REPLY...</span>
                    </div>
                    <div className="w-14 h-14 bg-white/[0.05] backdrop-blur-3xl border border-white/10 rounded-full flex items-center justify-center text-white/40 shadow-xl group-hover/device:text-red-500 transition-all">
                       <Heart size={26} />
                    </div>
                 </div>
              </div>
           </div>

           {/* Diagnostics */}
           <div className="mt-12 grid grid-cols-1 gap-3 w-64 opacity-50 pb-12">
              <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 <span>Grid Persistence</span>
                 <span className="text-slate-800 tracking-tighter">BUFFER READY</span>
              </div>
              <div className="w-full h-[3px] bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-600 w-full"></div>
              </div>
           </div>
        </div>
      </div>

      {/* --- NEURAL SYNTHESIS OVERLAY --- */}
      {isStyleAiLoading && (
        <div className="fixed inset-0 z-[1000] bg-[#020617]/80 backdrop-blur-3xl flex items-center justify-center animate-fade-in">
           <div className="bg-[#0f172a] p-16 rounded-[4rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] border border-white/10 flex flex-col items-center gap-12 animate-scale-up ring-1 ring-white/15 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-50"></div>
              <div className="relative">
                 <div className="w-40 h-40 rounded-[3rem] bg-blue-50/5 flex items-center justify-center overflow-hidden shadow-inner border border-blue-500/20">
                    <CloudLightning size={88} className="text-blue-500 animate-pulse" />
                    <div className="absolute inset-0 bg-blue-500/10 animate-[ping_3s_linear_infinite] rounded-full"></div>
                 </div>
              </div>
              <div className="text-center space-y-4 relative z-10">
                 <p className="text-[18px] font-black uppercase tracking-[0.8em] text-white">IDENTITY_SYNC</p>
                 <div className="flex flex-col items-center gap-3">
                   <p className="text-[12px] text-blue-400 font-black uppercase tracking-[0.3em] animate-bounce min-h-[1.5em]">
                     {AI_STAGES[loadingStage]}
                   </p>
                   <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden mt-4 shadow-inner">
                      <div className="h-full bg-blue-500 w-1/2 animate-[loading_2s_ease-in-out_infinite] shadow-[0_0_15px_#3b82f6]"></div>
                   </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes grain { 0% { background-position: 0 0; } 100% { background-position: 100% 100%; } }
        @keyframes crawl-scroll { 0% { transform: translateY(100%); } 100% { transform: translateY(-120%); } }
        @keyframes kenburns { 0% { transform: scale(1) translateY(0); } 100% { transform: scale(1.3) translateY(-5%); } }
        @keyframes drift { 0% { transform: translate(-2%, -2%); } 50% { transform: translate(2%, 2%); } 100% { transform: translate(-2%, -2%); } }
        @keyframes flicker { 0%, 100% { opacity: 1; } 50% { opacity: 0.95; } 80% { opacity: 0.98; } }
        @keyframes holo-glow { 0% { filter: drop-shadow(0 0 5px cyan); transform: translateX(0); } 50% { filter: drop-shadow(0 0 15px cyan); transform: translateX(1px); } 100% { filter: drop-shadow(0 0 5px cyan); transform: translateX(0); } }
        @keyframes neon-pulse { 0%, 100% { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #0052FF; } 50% { text-shadow: 0 0 2px #fff, 0 0 5px #fff, 0 0 10px #0052FF; } }
        @keyframes scan-line { 0% { top: 0%; } 100% { top: 100%; } }
        @keyframes matrix-scroll { from { background-position: 0 0; } to { background-position: 0 1000px; } }
        @keyframes rgb-pulse { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        @keyframes edge-glow { 0%, 100% { border-color: rgba(255,255,255,0.1); } 50% { border-color: rgba(0,82,255,1); } }
        @keyframes prism { 0% { border-image-source: linear-gradient(0deg, #ff0055, #0052FF, #00ffff); } 100% { border-image-source: linear-gradient(360deg, #ff0055, #0052FF, #00ffff); } }
        @keyframes glitch-anim { 0% { clip-path: inset(80% 0 0 0); transform: translate(-5px, -3px); } 10% { clip-path: inset(10% 0 85% 0); transform: translate(5px, 3px); } 20% { clip-path: inset(80% 0 0 0); transform: translate(-5px, -3px); } 100% { clip-path: inset(80% 0 0 0); transform: translate(-5px, -3px); } }
        @keyframes radar-pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(3); opacity: 0; } }

        .bg-img-kenburns { animation: kenburns 30s ease-in-out infinite alternate; }
        .bg-img-drift { animation: drift 20s linear infinite; }
        .bg-effect-crt { animation: flicker 0.15s infinite; filter: contrast(1.1) brightness(1.2) sepia(0.2); }
        .crt-lines { background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03)); background-size: 100% 3px, 3px 100%; }
        .matrix-effect { background-image: linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px); background-size: 20px 20px; animation: matrix-scroll 20s linear infinite; }
        .bg-effect-rgbpulse { animation: rgb-pulse 10s linear infinite; }

        .fx-text-hologram { animation: holo-glow 2s infinite ease-in-out; }
        .fx-text-neon { animation: neon-pulse 1.5s infinite; }
        .animation-glitch { animation: glitch-anim 0.2s infinite linear alternate-reverse; }

        /* REFACTORED USER IDENTITY BLOCKS */
        .user-block-container {
          position: absolute;
          top: 3rem;
          left: 0;
          width: 100%;
          padding: 0 2rem;
          z-index: 50;
          display: flex;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .user-block-inner { display: flex; align-items: center; gap: 0.75rem; position: relative; z-index: 10; }
        .user-block-avatar-frame { position: relative; width: 2.5rem; height: 2.5rem; border-radius: 9999px; overflow: hidden; flex-shrink: 0; z-index: 20; }
        .user-block-avatar { width: 100%; height: 100%; object-fit: cover; }
        .user-block-name { font-size: 12px; font-weight: 900; color: white; letter-spacing: -0.025em; line-height: 1; }
        .user-block-subtitle { font-size: 8px; font-weight: 700; color: #3b82f6; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 2px; }
        .user-block-verification { color: #3b82f6; }
        .user-block-title-row { display: flex; align-items: center; gap: 0.25rem; }
        .user-block-subtitle-container { display: flex; align-items: center; gap: 0.5rem; }
        .user-block-pulse-dot { width: 4px; height: 4px; background: #10b981; border-radius: 9999px; animation: pulse 2s infinite; }

        /* Style: Standard Glass */
        .user-block-style-standard .user-block-background { position: absolute; inset: -0.5rem; background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; }
        .user-block-style-standard .user-block-inner { padding: 0.25rem; }

        /* Style: Glitch (LIVE) */
        .user-block-style-glitch .user-block-avatar-frame { animation: glitch-anim 0.5s infinite; filter: hue-rotate(90deg); }
        .user-block-style-glitch .user-block-name { text-shadow: 2px 0 #ff0055, -2px 0 #00ffff; }

        /* Style: Scanner (LIVE) */
        .user-block-style-scanner .user-block-scanline { position: absolute; top: 0; left: 0; width: 100%; height: 2px; background: #ff0000; box-shadow: 0 0 15px #ff0000; animation: scan-line 2s linear infinite; z-index: 30; }
        .user-block-style-scanner .user-block-avatar-frame { border: 1px solid rgba(255,0,0,0.3); }

        /* Style: Phantom (LIVE) */
        .user-block-style-phantom .user-block-background { position: absolute; inset: 0; border: 1px solid rgba(255,255,255,0.2); border-radius: 1rem; animation: edge-glow 4s infinite; }
        .user-block-style-phantom .user-block-avatar-frame { opacity: 0.7; mix-blend-mode: overlay; }

        /* Style: Plasma (LIVE) */
        .user-block-style-plasma .user-block-background { position: absolute; inset: 0; background: linear-gradient(135deg, #0052FF, #ff0055, #00ffff); background-size: 400% 400%; animation: rgb-pulse 10s infinite; border-radius: 3rem; opacity: 0.2; }
        .user-block-style-plasma .user-block-avatar-frame { ring: 2px solid #00ffff; ring-offset: 2px; ring-offset-color: transparent; }

        /* Style: Radar (LIVE) */
        .user-block-style-radar .user-block-live-fx::after { content: ''; position: absolute; inset: 0; border: 2px solid #3b82f6; border-radius: 9999px; animation: radar-pulse 2s infinite; pointer-events: none; }
        .user-block-style-radar .user-block-avatar-frame { border: 2px solid #3b82f6; }

        /* Style: Aurora (LIVE) */
        .user-block-style-aurora .user-block-background { position: absolute; inset: -2rem; background: radial-gradient(circle at center, rgba(0,255,150,0.1), transparent 70%); animation: drift 10s infinite; }
        .user-block-style-aurora .user-block-name { color: #00ffcc; text-shadow: 0 0 10px #00ffcc; }

        /* Style: Monochrome */
        .user-block-style-monochrome .user-block-inner { background: white; padding: 0.75rem 1.5rem; border-radius: 0; }
        .user-block-style-monochrome .user-block-name { color: black; font-weight: 900; }
        .user-block-style-monochrome .user-block-avatar-frame { filter: grayscale(1) contrast(1.5); border-radius: 0; border: 2px solid black; }

        /* Style: Tactical */
        .user-block-style-tactical .user-block-inner { background: #1a1a1a; padding: 0.75rem; border-left: 4px solid #fbbf24; clip-path: polygon(0 0, 100% 0, 100% 80%, 90% 100%, 0 100%); }
        .user-block-style-tactical .user-block-name { font-family: 'Rajdhani', sans-serif; color: #fbbf24; text-transform: uppercase; }

        /* Style: Terminal */
        .user-block-style-terminal .user-block-inner { background: #000; border: 1px solid #4ade80; padding: 0.5rem; }
        .user-block-style-terminal .user-block-name { font-family: 'Press Start 2P', cursive; font-size: 8px; color: #4ade80; }
        .user-block-style-terminal .user-block-avatar-frame { border-radius: 0; filter: grayscale(1) sepia(1) hue-rotate(90deg); }

        /* Style: Prismatic */
        .user-block-style-prismatic .user-block-background { position: absolute; inset: 0; border: 3px solid; border-image-slice: 1; border-image-source: linear-gradient(45deg, #ff0055, #0052FF, #00ffff); animation: prism 3s linear infinite; }
        .user-block-style-prismatic .user-block-inner { padding: 0.5rem; }

        /* Style: Brutalist */
        .user-block-style-brutalist { top: 0; padding: 0; }
        .user-block-style-brutalist .user-block-inner { background: #000; border-bottom: 8px solid #fff; border-right: 8px solid #fff; padding: 1.5rem; width: 100%; }
        .user-block-style-brutalist .user-block-name { font-size: 18px; font-family: 'Syncopate', sans-serif; }

        /* Card Thumbnails for Card Styles */
        .card-thumb-standard { background: #3b82f6; border: 1px solid #ffffff44; }
        .card-thumb-cyber { background: #000; border: 2px solid #00ffff; box-shadow: 0 0 5px #00ffff88; }
        .card-thumb-hazard { background: #fbbf24; background-image: repeating-linear-gradient(45deg, #000 0, #000 5px, transparent 5px, transparent 10px); }
        .card-thumb-blueprint { background: #1e3a8a; border: 1px dashed #ffffff88; }
        .card-thumb-luxury { background: #1c1917; border-left: 4px solid #fde047; }
        .card-thumb-minimal { background: #ffffff22; backdrop-filter: blur(4px); border: 1px solid #ffffff66; }
        .card-thumb-terminal { background: #000; border-top: 2px solid #4ade80; }
        .card-thumb-liquid { background: linear-gradient(90deg, #ff0055, #0052FF); }
        .card-thumb-flash { background: #fff; box-shadow: 0 0 10px #3b82f6; }
        .card-thumb-deep { background: #0f172a; box-shadow: inset 0 0 10px #000; }

        /* ITEM CARD ENGINE */
        .card-main-container { position: relative; background: rgba(0,0,0,0.7); backdrop-filter: blur(24px); border-radius: 2.25rem; border: 1px solid rgba(255,255,255,0.2); padding: 1.25rem; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); overflow: hidden; }
        .card-shadow-element { position: absolute; inset: -0.25rem; border-radius: 2.5rem; blur: 10px; opacity: 0.5; transition: opacity 0.7s; }
        .card-scan-line { position: absolute; inset: 0; width: 100%; height: 1px; background: rgba(255,255,255,0.05); top: 50%; pointer-events: none; animation: scan-line 4s linear infinite; }
        .card-visual-wrapper { width: 4rem; height: 4rem; background: #1e293b; border-radius: 1rem; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; }
        .card-badge-row { display: flex; align-items: center; gap: 0.375rem; margin-bottom: 0.375rem; }
        .card-pulse-dot { width: 0.375rem; height: 0.375rem; border-radius: 9999px; background: #22d3ee; animation: pulse 2s infinite; }
        .card-badge-text { font-size: 9px; font-weight: 900; color: #22d3ee; text-transform: uppercase; letter-spacing: 0.2em; }
        .card-title { font-size: 11px; font-weight: 900; color: #fff; line-height: 1.2; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
        .card-price-row { display: flex; align-items: baseline; gap: 0.25rem; margin-top: 0.375rem; }
        .card-price-value { font-size: 15px; font-weight: 900; color: #fff; letter-spacing: -0.05em; }
        .card-price-currency { font-size: 8px; font-weight: 900; color: #94a3b8; text-transform: uppercase; }
        .card-action-button { padding: 0.875rem; background: linear-gradient(to bottom right, #2563eb, #4338ca); color: #fff; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(37,99,235,0.3); }

        .item-card-style-standard .card-shadow-element { background: linear-gradient(to right, #2563eb, #6366f1, #06b6d4); }
        .item-card-style-cyber .card-main-container { border: 2px solid #00ffff; background: rgba(0,0,0,0.9); }
        .item-card-style-cyber .card-action-button { background: #00ffff; color: #000; }
        .item-card-style-hazard .card-main-container { border-top: 6px solid #fbbf24; border-radius: 1rem; background: #111; }
        .item-card-style-blueprint .card-main-container { background: #1e3a8a; border: 1px dashed rgba(255,255,255,0.5); }
        .item-card-style-luxury .card-main-container { border: 1px solid #fde047; background: linear-gradient(to bottom, #1c1917, #000); border-radius: 0; }
        .item-card-style-minimal .card-main-container { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.4); backdrop-filter: blur(40px); }
        .item-card-style-terminal .card-main-container { background: #050505; border: 1px solid #4ade80; border-radius: 0.5rem; }
        .item-card-style-terminal .card-title, .item-card-style-terminal .card-price-value, .item-card-style-terminal .card-badge-text { color: #4ade80; font-family: 'Press Start 2P', cursive; font-size: 8px; }
        .item-card-style-liquid .card-main-container { background: linear-gradient(135deg, rgba(255,0,85,0.2), rgba(0,82,255,0.2)); border: none; }
        .item-card-style-flash .card-main-container { background: #fff; }
        .item-card-style-flash .card-title, .item-card-style-flash .card-price-value, .item-card-style-flash .card-badge-text { color: #000; }
        .item-card-style-deep .card-main-container { background: #000; box-shadow: inset 0 0 40px rgba(255,255,255,0.1); border: 1px solid #222; }

        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default StoryComposer;
