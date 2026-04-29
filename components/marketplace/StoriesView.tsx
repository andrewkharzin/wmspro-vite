
import React from 'react';
import { Quote, MessageSquare, ChevronLeft, Star, ExternalLink, ArrowRight, BookOpen, Library, Eye, Activity } from 'lucide-react';
import { MOCK_STORIES } from '../../lib/constants';

interface StoriesViewProps {
  onBack: () => void;
  onNavigateStore: (userId: string) => void;
}

const StoriesView: React.FC<StoriesViewProps> = ({ onBack, onNavigateStore }) => {
  return (
    <div className="animate-fade-in pb-32 px-4 md:px-0 font-opensans">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
           <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest mb-6 transition-all group">
             <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
             Return to Grid
           </button>
           <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase font-montserrat">Nexus<span className="text-blue-600">Chronicles</span></h1>
           <p className="text-slate-400 text-lg max-w-2xl font-medium">
             Deployment logs and technical narratives from the world's most efficient logistics nodes.
           </p>
        </div>
        <div className="hidden lg:flex flex-col items-end">
           <div className="flex -space-x-4 mb-3">
              {/* Fix: use user_avatar instead of avatar_url */}
              {MOCK_STORIES.slice(0, 5).map(s => (
                <img key={s.id} src={s.user_avatar} className="w-12 h-12 rounded-full border-4 border-white shadow-lg object-cover" />
              ))}
              <div className="w-12 h-12 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-lg">
                +24k
              </div>
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Community Nodes</p>
        </div>
      </div>

      {/* Hero Featured Story */}
      <div className="mb-20 group relative rounded-[3.5rem] overflow-hidden bg-slate-900 aspect-[21/9] flex items-center p-12 md:p-24 shadow-2xl border border-white/5">
         <img src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[4000ms]" />
         <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
         
         <div className="relative z-10 max-w-2xl space-y-6">
            <div className="flex items-center gap-3">
               <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20">Featured Milestone</span>
               <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1.5"><Activity size={12}/> Neural Verified</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter uppercase font-montserrat">Solving the Last-Mile Grid with Neural Staging.</h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed italic">"How the deployment of Nexus Core at the Saint Petersburg hub reduced cross-docking latency by 84% in 48 hours."</p>
            <button className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl active:scale-95 flex items-center gap-3">
               Analyze Case Study <ArrowRight size={18} />
            </button>
         </div>
      </div>

      {/* Community Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {MOCK_STORIES.map((story) => (
          <div 
            key={story.id} 
            className="group bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full overflow-hidden"
          >
            <div className="p-8 pb-4 flex items-center gap-5">
              {/* Fix: use user_avatar instead of avatar_url, user_full_name instead of full_name */}
              <img 
                src={story.user_avatar} 
                className="w-14 h-14 rounded-2xl object-cover border-4 border-slate-50 shadow-md group-hover:rotate-6 transition-transform" 
                alt={story.user_full_name} 
              />
              <div className="min-w-0">
                <h3 className="font-black text-slate-900 leading-tight truncate">{story.user_full_name}</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">Verified Enterprise Node</p>
              </div>
            </div>

            <div className="px-8 py-6 space-y-4 flex-1">
               <div className="flex items-center gap-3 text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">
                  <Library size={12} /> Case Study • {new Date(story.created_at).toLocaleDateString()}
               </div>
               {/* Fix: use content_text instead of content */}
               <p className="text-slate-700 text-lg leading-relaxed font-medium line-clamp-4">
                 "{story.content_text}"
               </p>
            </div>

            <div className="px-8 pb-8 space-y-6">
              <div className="flex flex-wrap gap-2">
                {story.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4 text-slate-300 font-black text-[10px] uppercase tracking-widest">
                   <span className="flex items-center gap-1.5"><Eye size={12}/> 1.2k</span>
                   <span className="flex items-center gap-1.5"><Star size={12}/> 4.9</span>
                </div>
                <button 
                  onClick={() => onNavigateStore(story.user_full_name || '')}
                  className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-xl active:scale-90"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Community CTA */}
      <div className="mt-32 rounded-[4rem] bg-slate-950 p-16 md:p-32 text-center text-white relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent opacity-50"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full group-hover:bg-blue-600/30 transition-all duration-700"></div>
        
        <div className="relative z-10 space-y-10">
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center mx-auto shadow-2xl backdrop-blur-xl mb-8">
             <MessageSquare size={48} className="text-blue-500" />
          </div>
          <h2 className="text-4xl md:text-7xl font-black mb-4 tracking-tighter uppercase font-montserrat">Join the Nexus<br/><span className="text-blue-600">Intelligence</span> Core.</h2>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">
            Share your deployment logs to optimize the global logistics matrix. Higher engagement boosts your network authority.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
             <button className="px-12 py-6 bg-blue-600 text-white font-black rounded-2xl hover:bg-[#0052FF] transition-all shadow-2xl shadow-blue-500/30 uppercase text-xs tracking-widest active:scale-95">
                Register Deployment Log
             </button>
             <button className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase text-xs tracking-widest">
                Browse Global Specs
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoriesView;
