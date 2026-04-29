
import React, { useState } from 'react';
import { 
  Heart, Truck, Package, Cpu, Hammer, 
  Box, Star, ChevronRight, X, LayoutGrid, List, SlidersHorizontal, Tag, 
  RotateCcw, Check, Target, User, Building2, Activity, ShieldAlert, Layers, Zap,
  ExternalLink, ShoppingBag, ShieldCheck, MapPin, BadgeCheck, Search, Filter, 
  ArrowUpDown, CheckCircle2, DollarSign, XCircle, ChevronDown, Plus, Sparkles
} from 'lucide-react';
import { MOCK_CATEGORIES, MOCK_STORIES, MOCK_PROFILES } from '../lib/constants';
import { Item, Category, Story } from '../lib/types';
import { useMarketplace, FilterState } from '../hooks/use-marketplace';
import StoryPlayer from './marketplace/StoryPlayer';

interface MarketplaceViewProps {
  onNavigateStore?: (userId: string) => void;
  onNavigateItem?: (itemId: string) => void;
  onAddStory?: () => void; // Handler for adding a new story
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
  onlyFavorites?: boolean;
  mkt?: any; 
  mktSearchOverride?: string;
}

const CategoryIcon: React.FC<{ category: Partial<Category>; className?: string; size?: number }> = ({ category, className, size = 20 }) => {
  const name = category.icon_name;
  switch (name) {
    case 'Cpu': return <Cpu className={className} size={size} />;
    case 'Hammer': return <Hammer className={className} size={size} />;
    case 'RotateCcw': return <RotateCcw className={className} size={size} />;
    case 'Zap': return <Zap className={className} size={size} />;
    case 'Box': return <Box className={className} size={size} />;
    case 'Activity': return <Activity className={className} size={size} />;
    case 'Layers': return <Layers className={className} size={size} />;
    case 'ShieldAlert': return <ShieldAlert className={className} size={size} />;
    default: return <Tag className={className} size={size} />;
  }
};

const MarketplaceView: React.FC<MarketplaceViewProps> = ({ 
  onNavigateStore, 
  onNavigateItem,
  onAddStory,
  favorites = [], 
  onToggleFavorite,
  onlyFavorites = false,
  mkt: mktProp,
  mktSearchOverride = ''
}) => {
  const mktInternal = useMarketplace(mktSearchOverride);
  const mkt = mktProp || mktInternal;
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const displayItems = onlyFavorites 
    ? mkt.listings.filter((item: Item) => favorites.includes(item.id))
    : mkt.listings;

  const handleToggleCondition = (condition: string) => {
    const current = mkt.filters.conditions;
    const next = current.includes(condition) 
      ? current.filter((c: string) => c !== condition) 
      : [...current, condition];
    mkt.updateFilters({ conditions: next });
  };

  const handleToggleSellerType = (type: string) => {
    const current = mkt.filters.sellerTypes;
    const next = current.includes(type) 
      ? current.filter((t: string) => t !== type) 
      : [...current, type];
    mkt.updateFilters({ sellerTypes: next });
  };

  const activeFilterCount = (mkt.filters.conditions.length) + 
                            (mkt.filters.sellerTypes.length) + 
                            (mkt.filters.minRating > 0 ? 1 : 0) + 
                            (mkt.filters.priceRange[0] > 0 || mkt.filters.priceRange[1] < 1000000 ? 1 : 0);

  return (
    <div className="flex flex-col gap-6 px-4 md:px-6 animate-fade-in relative font-opensans bg-slate-50/30 min-h-screen">
      
      {/* Nexus Stories Carousel */}
      {!onlyFavorites && (
        <div className="pt-4 overflow-hidden">
           <div className="flex items-center justify-between px-2 mb-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] font-ui flex items-center gap-2">
                <Sparkles size={12} className="text-blue-500" /> Active Sync Logs
              </h3>
              <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Global View</button>
           </div>
           <div className="flex items-center gap-6 overflow-x-auto no-scrollbar pb-2 px-2">
              <button 
                onClick={onAddStory}
                className="flex flex-col items-center gap-2 group shrink-0"
              >
                 <div className="w-20 h-20 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500 transition-all">
                    <Plus size={28} />
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-500">Add Story</span>
              </button>
              
              {MOCK_STORIES.map((story, idx) => (
                <button 
                  key={story.id} 
                  onClick={() => setSelectedStoryIndex(idx)}
                  className="flex flex-col items-center gap-2 group shrink-0"
                >
                   <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-blue-600 via-[#0052FF] to-indigo-400 shadow-xl group-hover:scale-105 transition-transform duration-500">
                      <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden shadow-inner bg-slate-900">
                         <img src={story.user_avatar} className="w-full h-full object-cover" />
                      </div>
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-slate-700 max-w-[80px] truncate">{story.user_full_name}</span>
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Category Ribbon */}
      {!onlyFavorites && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] font-ui flex items-center gap-2">
               <Target size={12} className="text-blue-500" /> Sector Matrix
             </h3>
             <div className="flex items-center gap-4">
               <button onClick={mkt.resetAllFilters} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                  Full Reset
               </button>
             </div>
          </div>
          
          <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-2 px-2 scroll-smooth">
             <button 
               onClick={() => mkt.setCategoryFilter('all')}
               className={`group relative min-w-[140px] h-20 rounded-2xl border transition-all flex items-center px-4 overflow-hidden shrink-0 ${
                 mkt.categoryFilter === 'all' 
                  ? 'bg-slate-900 border-slate-900 shadow-xl scale-[1.02]' 
                  : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
               }`}
             >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${mkt.categoryFilter === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 text-slate-400 group-hover:text-blue-50'}`}>
                   <LayoutGrid size={18} strokeWidth={2.5} />
                </div>
                <div className="ml-3 relative z-10">
                   <h4 className={`text-[10px] font-black uppercase tracking-widest font-ui leading-none ${mkt.categoryFilter === 'all' ? 'text-white' : 'text-slate-700'}`}>All Nodes</h4>
                   <p className={`text-[8px] font-bold uppercase mt-1 tracking-widest ${mkt.categoryFilter === 'all' ? 'text-blue-400' : 'text-slate-400'}`}>Full Sync</p>
                </div>
             </button>

             {MOCK_CATEGORIES.filter(c => !c.parent_id).map((cat) => {
               const isActive = mkt.categoryFilter === cat.id;
               return (
                 <button 
                   key={cat.id} 
                   onClick={() => mkt.setCategoryFilter(isActive ? 'all' : cat.id)}
                   className={`group relative min-w-[180px] h-20 rounded-2xl border transition-all flex items-center px-4 overflow-hidden shrink-0 ${
                     isActive 
                      ? 'bg-white border-blue-600 shadow-xl scale-[1.02] ring-1 ring-blue-500/20' 
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                   }`}
                 >
                    <div className="absolute top-0 right-0 w-24 h-full pointer-events-none opacity-10 transition-opacity group-hover:opacity-30 overflow-hidden">
                       <img src={cat.custom_icon_url} className="w-full h-full object-cover grayscale brightness-50" alt="" />
                       <div className="absolute inset-0 bg-gradient-to-l from-white via-white/50 to-transparent" />
                    </div>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative z-10 ${isActive ? 'bg-blue-600 text-white shadow-blue-500/30 shadow-lg' : 'bg-slate-50 text-slate-400 group-hover:text-blue-500'}`}>
                       <CategoryIcon category={cat} size={18} />
                    </div>
                    <div className="ml-3 relative z-10 text-left">
                       <h4 className={`text-[10px] font-black uppercase tracking-widest font-ui leading-none ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>{cat.name}</h4>
                       <p className={`text-[8px] font-black uppercase mt-1 tracking-widest ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{cat.items_count} SKUs</p>
                    </div>
                 </button>
               );
             })}
          </div>
        </div>
      )}

      {/* Main Viewport Container */}
      <div className="flex flex-col gap-6 w-full">
        
        {/* Controls Bar & Global Filter Toggle */}
        <div className="bg-white/70 backdrop-blur-3xl rounded-[2rem] border border-white p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 shadow-sm sticky top-[100px] z-40">
           <div className="flex items-center gap-4 flex-1">
              <button 
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                  isFilterPanelOpen || activeFilterCount > 0 
                  ? 'bg-blue-600 text-white shadow-blue-500/20' 
                  : 'bg-slate-950 text-white shadow-slate-900/10'
                }`}
              >
                 <SlidersHorizontal size={18} />
                 {isFilterPanelOpen ? 'Close Matrix' : 'Filter Matrix'}
                 {activeFilterCount > 0 && (
                   <span className="ml-2 w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center text-[9px]">
                      {activeFilterCount}
                   </span>
                 )}
              </button>

              <div className="relative flex-1 max-w-xl group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} strokeWidth={2.5} />
                 <input 
                   type="text" 
                   placeholder="Neural search matrix..." 
                   value={mkt.searchQuery}
                   onChange={(e) => mkt.setSearchQuery(e.target.value)}
                   className="w-full bg-slate-100/50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:ring-[10px] focus:ring-blue-500/[0.03] focus:bg-white transition-all shadow-inner"
                 />
              </div>
           </div>

           <div className="flex items-center gap-3 self-end lg:self-auto">
              <div className="flex items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-200/40">
                 {[
                   { id: 'newest', label: 'Default', icon: <Activity size={14}/> },
                   { id: 'price-asc', label: 'Lowest RUB', icon: <ArrowUpDown size={14}/> },
                   { id: 'rating', label: 'Top Rated', icon: <Star size={14}/> }
                 ].map(sort => (
                   <button 
                     key={sort.id}
                     onClick={() => mkt.updateFilters({ sortBy: sort.id as any })}
                     className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       mkt.filters.sortBy === sort.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                     }`}
                   >
                      {sort.icon} {sort.label}
                   </button>
                 ))}
              </div>

              <div className="w-px h-6 bg-slate-200/50 hidden md:block"></div>

              <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-200/40">
                 <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                   <LayoutGrid size={18} />
                 </button>
                 <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                   <List size={18} />
                 </button>
              </div>
           </div>
        </div>

        {/* ULTIMATE HORIZONTAL FILTER PANEL (Push down drawer) */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isFilterPanelOpen ? 'max-h-[600px] opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'
          }`}
        >
           <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] border border-white p-10 shadow-2xl shadow-slate-200/40 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              {/* Price Range Segment */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 text-[#0052FF]">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center"><DollarSign size={18} strokeWidth={3} /></div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Price Matrix</h4>
                 </div>
                 <div className="flex flex-col gap-4">
                    <div className="flex gap-4">
                       <div className="flex-1 space-y-2">
                          <p className="text-[9px] font-black text-slate-400 uppercase ml-1">Min RUB</p>
                          <input 
                            type="number" 
                            value={mkt.filters.priceRange[0]} 
                            onChange={(e) => mkt.updateFilters({ priceRange: [Number(e.target.value), mkt.filters.priceRange[1]] })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold outline-none focus:ring-[10px] focus:ring-blue-500/5 focus:bg-white transition-all" 
                          />
                       </div>
                       <div className="flex-1 space-y-2">
                          <p className="text-[9px] font-black text-slate-400 uppercase ml-1">Max RUB</p>
                          <input 
                            type="number" 
                            value={mkt.filters.priceRange[1]} 
                            onChange={(e) => mkt.updateFilters({ priceRange: [mkt.filters.priceRange[0], Number(e.target.value)] })}
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs font-bold outline-none focus:ring-[10px] focus:ring-blue-500/5 focus:bg-white transition-all" 
                          />
                       </div>
                    </div>
                    <div className="flex justify-between px-1">
                       {[0, 50000, 200000].map(val => (
                         <button 
                           key={val} 
                           onClick={() => mkt.updateFilters({ priceRange: [val, mkt.filters.priceRange[1]] })}
                           className="text-[9px] font-black text-blue-500 hover:underline uppercase"
                         >
                           {val === 0 ? 'Reset' : `>${val/1000}k`}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Condition Matrix Segment */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 text-emerald-500">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center"><ShieldCheck size={18} strokeWidth={3} /></div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Asset Condition</h4>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'new', label: 'Brand New' },
                      { id: 'used_good', label: 'Refurbished' },
                      { id: 'used_fair', label: 'Field Tested' }
                    ].map(cond => (
                      <button 
                        key={cond.id}
                        onClick={() => handleToggleCondition(cond.id)}
                        className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                          mkt.filters.conditions.includes(cond.id) 
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-500/5 scale-105' 
                          : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-emerald-200 hover:bg-white'
                        }`}
                      >
                         {cond.label}
                         {mkt.filters.conditions.includes(cond.id) && <Check size={12} strokeWidth={4} />}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Rating Scaler Segment */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 text-amber-500">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center"><Star size={18} strokeWidth={3} /></div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Min. Trust Score</h4>
                 </div>
                 <div className="bg-slate-50 p-1.5 rounded-2xl border border-slate-100 flex items-center gap-1">
                    {[0, 3, 4, 4.5].map(rating => (
                      <button 
                        key={rating}
                        onClick={() => mkt.updateFilters({ minRating: rating })}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${
                          mkt.filters.minRating === rating 
                          ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20 scale-105' 
                          : 'text-slate-400 hover:bg-white hover:text-slate-600'
                        }`}
                      >
                         {rating === 0 ? 'ANY' : `${rating}+`}
                      </button>
                    ))}
                 </div>
                 <div className="flex items-center gap-2 justify-center">
                    <div className="flex -space-x-1.5">
                       {[1,2,3,4,5].map(i => <Star key={i} size={10} className={`${i <= Math.ceil(mkt.filters.minRating || 5) ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />)}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase">Trust Index</span>
                 </div>
              </div>

              {/* Node Authority Segment */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 text-indigo-500">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center"><Building2 size={18} strokeWidth={3} /></div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em]">Node Authority</h4>
                 </div>
                 <div className="flex flex-col gap-3">
                    {[
                      { id: 'enterprise', label: 'Verified Enterprise', icon: <ShieldCheck size={14}/> },
                      { id: 'individual', label: 'Independent Node', icon: <User size={14}/> }
                    ].map(type => (
                      <button 
                        key={type.id}
                        onClick={() => handleToggleSellerType(type.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          mkt.filters.sellerTypes.includes(type.id) 
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-lg shadow-indigo-500/5' 
                          : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-indigo-200 hover:bg-white'
                        }`}
                      >
                         <div className="flex items-center gap-3">
                            {type.icon}
                            <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                         </div>
                         {mkt.filters.sellerTypes.includes(type.id) && <CheckCircle2 size={16} className="text-indigo-500" />}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Listings Body */}
        <div className="space-y-8 pb-32">
           
           {/* Active Filter Chips */}
           {activeFilterCount > 0 && (
             <div className="flex flex-wrap items-center gap-3 px-2 animate-fade-in">
                <div className="flex items-center gap-2 mr-2">
                   <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600"><Filter size={12} /></div>
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Refinement:</span>
                </div>
                {mkt.filters.conditions.map((c: string) => (
                  <button 
                    key={c}
                    onClick={() => handleToggleCondition(c)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-red-300 hover:text-red-500 transition-all shadow-sm group"
                  >
                     Condition: {c.replace('_', ' ')}
                     <X size={10} className="group-hover:rotate-90 transition-transform" />
                  </button>
                ))}
                {mkt.filters.sellerTypes.map((t: string) => (
                  <button 
                    key={t}
                    onClick={() => handleToggleSellerType(t)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-red-300 hover:text-red-500 transition-all shadow-sm group"
                  >
                     Type: {t}
                     <X size={10} className="group-hover:rotate-90 transition-transform" />
                  </button>
                ))}
                {mkt.filters.minRating > 0 && (
                  <button 
                    onClick={() => mkt.updateFilters({ minRating: 0 })}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-red-300 hover:text-red-500 transition-all shadow-sm group"
                  >
                     Rating: {mkt.filters.minRating}+
                     <X size={10} className="group-hover:rotate-90 transition-transform" />
                  </button>
                )}
                {(mkt.filters.priceRange[0] > 0 || mkt.filters.priceRange[1] < 1000000) && (
                  <button 
                    onClick={() => mkt.updateFilters({ priceRange: [0, 1000000] })}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-red-300 hover:text-red-500 transition-all shadow-sm group"
                  >
                     Price: {mkt.filters.priceRange[0].toLocaleString()} - {mkt.filters.priceRange[1].toLocaleString()}
                     <X size={10} className="group-hover:rotate-90 transition-transform" />
                  </button>
                )}
                <button onClick={mkt.resetAllFilters} className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] hover:underline ml-2">Clear Matrix</button>
             </div>
           )}

           {/* Listings Grid */}
           <div className={viewMode === 'grid' 
             ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
             : "flex flex-col gap-6"
           }>
             {displayItems.map((item: Item) => (
               <div key={item.id} className={`group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col ${viewMode === 'list' ? 'md:flex-row' : ''}`}>
                 <div className={`relative overflow-hidden cursor-pointer ${viewMode === 'list' ? 'md:w-80 h-72' : 'aspect-square'}`} onClick={() => onNavigateItem?.(item.id)}>
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none"></div>
                    <button onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(item.id); }} className="absolute top-5 right-5 p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl hover:bg-white transition-all active:scale-90 z-20">
                      <Heart size={20} fill={favorites.includes(item.id) ? '#EF4444' : 'none'} className={favorites.includes(item.id) ? 'text-red-500' : 'text-slate-500'} strokeWidth={2.5} />
                    </button>
                    <div className="absolute bottom-5 left-5 px-3 py-1.5 bg-slate-900/40 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                       {item.condition.replace('_', ' ')}
                    </div>
                 </div>

                 <div className={`p-8 flex flex-col flex-1 ${viewMode === 'list' ? 'justify-between' : ''}`}>
                    <div className="flex items-center justify-between mb-5">
                       <div className="flex items-center gap-3 cursor-pointer group/seller" onClick={() => onNavigateStore?.(item.seller_name || '')}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover/seller:scale-110 ${item.seller_type === 'enterprise' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-amber-50 shadow-amber-500/20'}`}>
                             {item.seller_type === 'enterprise' ? <Building2 size={18} /> : <User size={18} />}
                          </div>
                          <div className="min-w-0">
                             <p className="text-[11px] font-black text-slate-600 truncate leading-none uppercase tracking-tight group-hover/seller:text-blue-600 transition-colors">{item.seller_name}</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{item.seller_type === 'enterprise' ? 'Verified Node' : 'Independent'}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-xl border border-slate-100/50">
                         <Star size={14} className="text-amber-400 fill-current" />
                         <span className="text-xl font-black text-slate-600 font-ui leading-none tracking-tighter">{item.seller_rating?.toFixed(1) || '4.5'}</span>
                       </div>
                    </div>

                    <div onClick={() => onNavigateItem?.(item.id)} className="cursor-pointer space-y-3">
                       <h4 className="text-lg font-black text-slate-600 line-clamp-2 leading-[1.3] tracking-tight group-hover:text-blue-600 transition-colors font-montserrat">{item.title}</h4>
                       <div className="flex items-end gap-1.5 pt-1">
                         <span className="text-3xl font-black text-slate-700 tracking-tight font-roboto">{item.price.toLocaleString()} ₽</span>
                       </div>
                    </div>
                    
                    <div className="mt-8 flex gap-3">
                       <button onClick={() => onNavigateItem?.(item.id)} className="flex-1 py-4 bg-slate-800 text-white rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest hover:bg-[#0052FF] transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2">
                          <ShoppingBag size={16} /> Procure Asset
                       </button>
                       <button className="p-4 bg-slate-50 text-slate-400 border border-slate-100 rounded-[1.25rem] hover:bg-white hover:text-blue-600 transition-all group/btn shadow-sm">
                         <ExternalLink size={18} className="group-hover/btn:scale-110 transition-transform" />
                       </button>
                    </div>
                 </div>
               </div>
             ))}
             {displayItems.length === 0 && (
               <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                     <XCircle size={48} strokeWidth={1} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">No assets match matrix coordinates</h3>
                    <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">Try widening your price range or clearing condition filters to expand the search results.</p>
                  </div>
                  <button onClick={mkt.resetAllFilters} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">Reset All Filters</button>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && (
        <StoryPlayer 
          stories={MOCK_STORIES} 
          initialIndex={selectedStoryIndex} 
          onClose={() => setSelectedStoryIndex(null)}
          onNavigateStore={onNavigateStore || (() => {})}
          currentUser={MOCK_PROFILES[0]}
        />
      )}
    </div>
  );
};

export default MarketplaceView;
