import React, { useState, lazy, Suspense, useEffect, useRef, useMemo, useCallback } from 'react';
import { DollarSign, Package, AlertTriangle, Activity, Calendar, Zap, TrendingUp, ShoppingBag, ChevronRight, Globe, LayoutGrid, List, Search, SlidersHorizontal, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';
import { useInventory } from '../hooks/use-inventory';
import { InventoryHealth } from './dashboard/InventoryHealth';
import { useTranslation, Language } from '../lib/i18n';

const data = [
  { name: 'Mon', stock: 4200, flow: 2100 },
  { name: 'Tue', stock: 3800, flow: 2800 },
  { name: 'Wed', stock: 5400, flow: 3200 },
  { name: 'Thu', stock: 3100, flow: 2900 },
  { name: 'Fri', stock: 2400, flow: 4100 },
  { name: 'Sat', stock: 2900, flow: 1900 },
  { name: 'Sun', stock: 3800, flow: 2200 },
];

// Lazy load heavy components
const AreaChart = lazy(() => import('recharts').then(mod => ({ default: mod.AreaChart })));
const Area = lazy(() => import('recharts').then(mod => ({ default: mod.Area })));
const XAxis = lazy(() => import('recharts').then(mod => ({ default: mod.XAxis })));
const YAxis = lazy(() => import('recharts').then(mod => ({ default: mod.YAxis })));
const CartesianGrid = lazy(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })));
const Tooltip = lazy(() => import('recharts').then(mod => ({ default: mod.Tooltip })));
const ResponsiveContainer = lazy(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })));

// Memoized stat cards to prevent unnecessary re-renders
const StatCard = React.memo(({ icon: Icon, title, value, subtitle, iconColor = "text-blue-400" }) => (
  <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-6 rounded-sm hover:bg-white/10 transition-all">
    <div className="flex justify-between items-start mb-4">
      <Icon className={iconColor} size={24} />
      {subtitle}
    </div>
    <p className="text-3xl font-black text-white">{value}</p>
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mt-1">{title}</p>
  </div>
));

// Virtualized grid component for better performance
const VirtualizedGrid = React.memo(({ items, viewMode, onNavigateMarketplace, t }) => {
  const [visibleItems, setVisibleItems] = useState(12);
  const observerRef = useRef();

  const lastItemRef = useCallback(node => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisibleItems(prev => Math.min(prev + 12, items.length));
      }
    });
    if (node) observerRef.current.observe(node);
  }, [items.length]);

  const displayedItems = useMemo(() => items.slice(0, visibleItems), [items, visibleItems]);

  return (
    <div className={viewMode === 'grid'
      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 pb-20"
      : "flex flex-col gap-6 pb-20"
    }>
      {displayedItems.map((item, index) => (
        <InventoryItem
          key={item.id}
          item={item}
          viewMode={viewMode}
          onNavigate={onNavigateMarketplace}
          t={t}
          ref={index === displayedItems.length - 1 ? lastItemRef : null}
        />
      ))}
    </div>
  );
});

// Individual inventory item component for better memoization
const InventoryItem = React.memo(React.forwardRef(({ item, viewMode, onNavigate, t }, ref) => (
  <div ref={ref} className={`group bg-white rounded-sm border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col ${viewMode === 'list' ? 'md:flex-row p-4 gap-8' : ''}`}>
    <div
      className={`relative overflow-hidden bg-slate-50 rounded-sm cursor-pointer ring-inset ring-1 ring-slate-100 ${viewMode === 'list' ? 'w-48 h-48 shrink-0' : 'aspect-square'}`}
      onClick={() => onNavigate?.(item.id)}
    >
      <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="bg-white px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest text-blue-600 shadow-xl border border-white">View Detail</div>
      </div>
      <img
        src={item.image_url}
        alt={item.title}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90"
        loading="lazy"
        width="400"
        height="400"
        decoding="async"
      />
      <div className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md rounded-sm border border-white/40 opacity-0 group-hover:opacity-100 transition-all z-20">
        <ArrowUpRight size={18} className="text-white" />
      </div>
    </div>

    <div className={`flex flex-col p-6 flex-1 ${viewMode === 'list' ? 'py-2 justify-between' : ''}`}>
      <div onClick={() => onNavigate?.(item.id)} className="cursor-pointer">
        <h4 className="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">{item.title}</h4>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-xl font-medium text-slate-800 tracking-tight">{item.price.toLocaleString()} ₽</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">RUB</span>
        </div>
      </div>

      {viewMode === 'list' && (
        <p className="text-xs text-slate-500 leading-relaxed font-medium line-clamp-2 max-w-2xl mt-4">Verified logistics SKU: {item.inventory_number}. Current status marked as {item.status.toUpperCase()}.</p>
      )}

      <div className={`mt-6 pt-4 border-t border-slate-50 flex items-center justify-between ${viewMode === 'list' ? 'md:border-none md:pt-0 md:mt-0' : ''}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-emerald-50' : 'bg-amber-50'}`}></span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.status}</span>
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock: {item.available_quantity}</span>
      </div>
    </div>

    {viewMode === 'list' && (
      <div className="flex items-center px-4">
        <button onClick={() => onNavigate?.(item.id)} className="px-8 py-3 bg-slate-800 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
          {t.manage_sku}
        </button>
      </div>
    )}
  </div>
)));

const DashboardStats: React.FC<DashboardStatsProps> = ({ onNavigateMarketplace, lang = 'en' }) => {
  const t = useTranslation(lang as Language);
  const { stats, items } = useInventory();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChart, setShowChart] = useState(false);

  // Show chart after initial render to prioritize LCP
  useEffect(() => {
    const timer = requestIdleCallback(() => {
      setShowChart(true);
    }, { timeout: 2000 });

    return () => cancelIdleCallback(timer);
  }, []);

  const filteredLiveItems = useMemo(() =>
    items.slice(0, 50).filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    ), [items, searchQuery]
  );

  // Debounced search handler
  const handleSearch = useCallback((e) => {
    const timer = setTimeout(() => {
      setSearchQuery(e.target.value);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col animate-fade-in">

      {/* HERO SECTION - Optimized with will-change and reduced animations */}
      <section className="relative w-full bg-slate-950 py-12 md:py-16 px-6 md:px-12 overflow-hidden will-change-transform">
         <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
         </div>

         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12 max-w-[1800px] mx-auto">
            <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                   <div className="flex gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                   </div>
                   <span className="text-xs font-black uppercase tracking-[0.4em] text-blue-400">{t.network_secure}</span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter">
                   {t.hero_title_part1} <span className="text-blue-500">{t.hero_title_part2}</span> {t.hero_title_part3}
                </h1>
                <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed">
                   {t.hero_desc}
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                    <button className="bg-blue-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
                        {t.init_intake}
                    </button>
                    <button
                      onClick={() => onNavigateMarketplace?.()}
                      className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-8 md:px-10 py-4 md:py-5 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all flex items-center gap-3"
                    >
                        {t.procure_surplus} <ArrowUpRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full md:w-[420px]">
                <StatCard icon={TrendingUp} title={t.grid_value} value={`₽${(stats.totalValue / 1000).toFixed(0)}k`} subtitle={<span className="text-xs text-emerald-400 font-bold tracking-widest">RUB</span>} iconColor="text-emerald-400" />
                <StatCard icon={Package} title={t.active_skus} value={stats.totalItems} subtitle={<ArrowUpRight className="text-blue-400" size={14} />} />
                <StatCard icon={AlertTriangle} title={t.critical_zones} value={stats.lowStockCount} subtitle={<span className="w-2 h-2 rounded-full bg-red-500"></span>} iconColor="text-amber-400" />
                <StatCard icon={Activity} title={t.sync_uptime} value="99.8%" subtitle={<Zap className="text-purple-500" size={14} />} iconColor="text-purple-400" />
            </div>
         </div>
      </section>

      {/* MAIN DATA GRID */}
      <section className="px-6 md:px-12 py-8 md:py-12 bg-white flex flex-col gap-8 md:gap-12">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start max-w-[1800px] mx-auto w-full">
            <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h3 className="text-xl md:text-2xl font-black text-slate-700 tracking-tight">{t.throughput}</h3>
                        <p className="text-xs md:text-sm font-medium text-slate-400 mt-1">Live visualization of warehouse movement vs capacity</p>
                    </div>
                    <div className="flex bg-slate-100 p-1.5 rounded-sm border border-slate-200">
                        <button className="px-3 md:px-4 py-1.5 bg-white shadow-sm rounded-sm text-[10px] font-black uppercase tracking-widest text-blue-600 transition-all">{lang === 'ru' ? 'Неделя' : 'Weekly'}</button>
                        <button className="px-3 md:px-4 py-1.5 rounded-sm text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">{lang === 'ru' ? 'Месяц' : 'Monthly'}</button>
                    </div>
                </div>

                <div className="h-[350px] md:h-[400px] w-full bg-slate-50/50 rounded-sm p-4 md:p-8 border border-slate-100 relative">
                  {showChart ? (
                    <Suspense fallback={<div className="flex items-center justify-center h-full">Loading chart...</div>}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dy={20} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} dx={-20} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '4px', padding: '8px 12px' }}
                                itemStyle={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase' }}
                            />
                            <Area type="monotone" dataKey="stock" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" />
                            <Area type="monotone" dataKey="flow" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorFlow)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Suspense>
                  ) : (
                    <div className="flex items-center justify-center h-full animate-pulse bg-slate-100 rounded-sm">
                      <Activity className="text-slate-400" size={32} />
                    </div>
                  )}
                </div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-24">
                <InventoryHealth lowStock={stats.lowStockCount} moderationPending={4} />

                <div className="bg-slate-900 rounded-sm p-8 text-white shadow-xl relative overflow-hidden group border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Network Latency</h4>
                                <p className="text-2xl md:text-3xl font-black mt-2">24<span className="text-blue-500">ms</span></p>
                            </div>
                            <Globe size={24} className="text-blue-500" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>Optimization Protocol</span>
                                <span className="text-emerald-400">Active</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-500 w-[94%] h-full"></div>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-white/5 border border-white/10 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                           Download System Log
                        </button>
                    </div>
                </div>
            </div>
          </div>

          {/* LIVE ASSET FEED */}
          <div className="space-y-8 max-w-[1800px] mx-auto w-full pt-8 border-t border-slate-100">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                   <h3 className="text-xl md:text-2xl font-black text-slate-700 tracking-tight">{t.asset_stream}</h3>
                   <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-xs md:text-sm font-medium text-slate-400">Real-time inventory synchronization from all connected hubs</p>
                      <button
                        onClick={() => onNavigateMarketplace?.()}
                        className="text-[10px] font-black text-[#0052FF] uppercase tracking-widest hover:underline flex items-center gap-1"
                      >
                         {t.marketplace} <ChevronRight size={12} />
                      </button>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
                      <input
                        type="text"
                        placeholder={t.search_placeholder}
                        onChange={handleSearch}
                        className="bg-slate-50 border border-slate-100 rounded-sm py-2 pl-9 pr-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/5 transition-all w-40 focus:w-56"
                      />
                   </div>

                   <div className="flex bg-slate-100 p-1 rounded-sm border border-slate-200/50">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <LayoutGrid size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-sm transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        <List size={16} />
                      </button>
                   </div>
                </div>
             </div>

             <VirtualizedGrid
                items={filteredLiveItems}
                viewMode={viewMode}
                onNavigateMarketplace={onNavigateMarketplace}
                t={t}
             />
          </div>
      </section>
    </div>
  );
};

export default DashboardStats;