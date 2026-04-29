
import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Globe, Lock, Eye, Sparkles, 
  BrainCircuit, Loader2, Image as ImageIcon, ChevronLeft, 
  Send, ListChecks, CheckCircle2, ShieldCheck, Activity, X,
  BarChart3, Calendar, Clock, ShoppingCart, MessageCircle, Share2,
  TrendingUp, TrendingDown, Layers, Zap
} from 'lucide-react';
import { Story, Profile, StoryContentType, CTAActionType } from '../../lib/types';
import { MOCK_STORIES, MOCK_HIGHLIGHTS } from '../../lib/constants';
import { enhanceStory, generateStoryArt, analyzeStoryPerformance, generateProductStory } from '../../lib/gemini';
import StoryComposer from './StoryComposer';

interface StoryManagerViewProps {
  currentUser: Profile;
  onBack: () => void;
}

const StoryManagerView: React.FC<StoryManagerViewProps> = ({ currentUser, onBack }) => {
  const [stories, setStories] = useState<Story[]>(
    MOCK_STORIES.filter(s => s.user_id === currentUser.id)
  );
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'highlights' | 'analytics'>('active');

  const handleSaveNewStory = (newStory: Story) => {
    setStories([newStory, ...stories]);
    setIsComposerOpen(false);
  };

  // If composer is open, we take over the entire content area
  if (isComposerOpen) {
    return <StoryComposer currentUser={currentUser} onBack={() => setIsComposerOpen(false)} onSave={handleSaveNewStory} />;
  }

  return (
    <div className="animate-fade-in space-y-10 pb-32 font-opensans px-6 md:px-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm group">
               <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase font-montserrat">Nexus Studio</h2>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Authoring terminal for distribution logs</p>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/50">
               {[
                 { id: 'active', label: 'Live Logs', icon: <Activity size={14}/> },
                 { id: 'highlights', label: 'Highlights', icon: <Layers size={14}/> },
                 { id: 'analytics', label: 'Intelligence', icon: <BarChart3 size={14}/> }
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'active' && tab.id === 'active' || activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                 >
                   {tab.icon} {tab.label}
                 </button>
               ))}
            </div>
            <button 
              onClick={() => setIsComposerOpen(true)}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#0052FF] transition-all shadow-xl shadow-blue-500/20 flex items-center gap-3 active:scale-95 group"
            >
              <Plus size={18} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" /> Provision New Log
            </button>
         </div>
      </div>

      {activeTab === 'active' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
          {stories.map(story => (
            <div key={story.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
               <div className="relative aspect-[9/12] overflow-hidden bg-slate-900">
                  {story.media_urls.length > 0 ? (
                    <img src={story.media_urls[0]} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms]" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 text-center" style={{ backgroundColor: story.background_color }}>
                      <p className="text-white font-black uppercase text-lg leading-tight">{story.content_text}</p>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                     <p className="text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                       <Clock size={10} className="text-emerald-400" /> Live
                     </p>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                     <div className="flex justify-between items-end text-white">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Views</p>
                           <p className="text-xl font-black">{story.view_count.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-4 text-[9px] font-black uppercase opacity-60">
                           <span className="flex items-center gap-1"><MessageCircle size={10}/> {story.reply_count}</span>
                           <span className="flex items-center gap-1"><Share2 size={10}/> {story.share_count}</span>
                        </div>
                     </div>
                  </div>
               </div>
               <div className="p-6 pt-8 space-y-4 flex-1">
                  <h3 className="text-sm font-black text-slate-800 line-clamp-1 leading-tight uppercase tracking-tight">{story.title}</h3>
                  <div className="flex flex-wrap gap-1.5">
                     {story.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest rounded-sm border border-slate-100">{tag}</span>
                     ))}
                  </div>
               </div>
               <div className="p-6 pt-0 flex gap-2">
                  <button className="flex-1 py-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white border border-slate-100 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest">Analytics</button>
                  <button className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white border border-slate-100 rounded-xl transition-all"><Trash2 size={16}/></button>
               </div>
            </div>
          ))}
          <button 
            onClick={() => setIsComposerOpen(true)}
            className="aspect-[9/12] rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-blue-400 flex flex-col items-center justify-center text-slate-300 hover:text-blue-500 transition-all group bg-white/40 shadow-inner"
          >
             <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus size={32} strokeWidth={2.5} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">Add Record</p>
          </button>
        </div>
      )}

      {activeTab === 'analytics' && (
         <div className="space-y-12 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {[
                 { label: 'Total Sync Impressions', val: '245.2k', change: '+12%', icon: <Eye />, color: 'blue' },
                 { label: 'Asset Procurement Starts', val: '1.2k', change: '+8%', icon: <ShoppingCart />, color: 'emerald' },
                 { label: 'Avg Pulse Duration', val: '6.4s', change: '-2%', icon: <Clock />, color: 'amber' },
                 { label: 'Network Shares', val: '840', change: '+24%', icon: <Share2 />, color: 'indigo' }
               ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                     <div className="flex justify-between items-start mb-4">
                        <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>{stat.icon}</div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.change}</span>
                     </div>
                     <p className="text-3xl font-black text-slate-950 tracking-tighter">{stat.val}</p>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
               ))}
            </div>

            <div className="bg-slate-950 p-12 rounded-[3.5rem] text-white relative overflow-hidden border border-white/5">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
               <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                  <div className="w-24 h-24 bg-blue-600/20 rounded-[2.5rem] border border-blue-500/30 flex items-center justify-center shrink-0">
                     <BrainCircuit size={48} className="text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-4">
                     <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-blue-400" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Neural Performance Audit</h4>
                     </div>
                     <p className="text-2xl font-medium leading-relaxed italic">"Sync logs linked to <span className="text-blue-400 font-bold">Industrial Grade</span> assets are seeing an 84% higher procurement conversion rate this week. Recommend highlighting the <span className="text-white font-bold underline">Morning Hub Calibration</span> log for maximal network authority."</p>
                  </div>
                  <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                     Execute Strategy <Zap size={18} />
                  </button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default StoryManagerView;
