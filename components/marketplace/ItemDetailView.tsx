
import React from 'react';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck, Clock, Info, Heart, Share2, Star, Box, Package, ArrowUpRight, Globe, Layers, Cpu, Calendar, Activity, QrCode, User, Building2, Zap, ShieldAlert, Sparkles } from 'lucide-react';
import { Item, Batch } from '../../lib/types';
import { MOCK_BATCHES } from '../../lib/constants';

interface ItemDetailViewProps {
  item: Item;
  onBack: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  onNavigateStore: (userId: string) => void;
  onCreateStory?: () => void;
}

const ItemDetailView: React.FC<ItemDetailViewProps> = ({ 
  item, 
  onBack, 
  onToggleFavorite, 
  isFavorite,
  onNavigateStore,
  onCreateStory
}) => {
  // Filter batches specifically for this item
  const itemBatches = MOCK_BATCHES.filter(b => b.item_id === item.id);

  return (
    <div className="animate-fade-in pb-32">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-[#0052FF] font-black text-[10px] uppercase tracking-widest mb-10 transition-all group"
      >
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Return to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Visual Assets Area */}
        <div className="lg:col-span-7 space-y-8">
           <div className="relative aspect-square md:aspect-video lg:aspect-square bg-white rounded-sm border border-slate-100 shadow-xl group ring-1 ring-slate-100/30 overflow-hidden">
              <img src={item.image_url} alt={item.title} className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute top-8 right-8 flex flex-col gap-4">
                 <button 
                   onClick={() => onToggleFavorite(item.id)}
                   className="p-4 bg-white/70 backdrop-blur-xl rounded-sm border border-white/40 shadow-xl hover:bg-white transition-all active:scale-90"
                 >
                   <Heart size={20} fill={isFavorite ? '#EF4444' : 'none'} className={isFavorite ? 'text-red-500' : 'text-slate-700'} />
                 </button>
                 <button className="p-4 bg-white/70 backdrop-blur-xl rounded-sm border border-white/40 shadow-xl hover:bg-white transition-all">
                   <Share2 size={20} className="text-slate-700" />
                 </button>
              </div>
              {item.is_featured && (
                <div className="absolute bottom-8 left-8 px-6 py-2.5 bg-[#0052FF] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-sm shadow-2xl">
                   Verified Distribution Node
                </div>
              )}
           </div>

           {/* Technical Specs Grid */}
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Condition', val: item.condition.replace('_', ' '), icon: <ShieldCheck size={16} /> },
                { label: 'Asset Code', val: item.inventory_number.split('-')[0], icon: <Layers size={16} /> },
                { label: 'Batch Sync', val: itemBatches.length > 0 ? 'Active' : 'N/A', icon: <Clock size={16} /> },
                { label: 'Network', val: 'Nexus-RU', icon: <Globe size={16} /> },
              ].map(spec => (
                <div key={spec.label} className="bg-white p-5 rounded-sm border border-slate-100 shadow-sm flex flex-col gap-3">
                   <div className="text-[#0052FF]">{spec.icon}</div>
                   <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{spec.label}</p>
                      <p className="text-xs font-black text-slate-700 uppercase mt-1">{spec.val}</p>
                   </div>
                </div>
              ))}
           </div>

           {/* BATCH INVENTORY SECTION */}
           <div className="bg-slate-50 border border-slate-100 rounded-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-white/50 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <QrCode size={20} className="text-blue-600" />
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest">Serialized Lot Inventory</h3>
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase">{itemBatches.length} Active Lots</span>
              </div>
              
              <div className="divide-y divide-slate-100">
                 {itemBatches.length > 0 ? itemBatches.map(batch => (
                    <div key={batch.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white transition-colors group">
                       <div className="flex items-center gap-5">
                          <div className="w-10 h-10 bg-white border border-slate-200 rounded-sm flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                             <Package size={18} />
                          </div>
                          <div>
                             <p className="font-mono text-sm font-black text-slate-700 tracking-tighter">{batch.batch_number}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Production Origin: {batch.production_date}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-12">
                          <div className="text-center">
                             <p className="text-sm font-black text-slate-700">{batch.current_quantity}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Units Available</p>
                          </div>
                          
                          <div className="hidden md:block">
                             <p className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm border ${
                               batch.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                             }`}>
                                {batch.status}
                             </p>
                          </div>
                          
                          <div className="text-right min-w-[80px]">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry</p>
                             <p className={`text-[11px] font-bold ${new Date(batch.expiry_date) < new Date() ? 'text-red-500' : 'text-slate-700'}`}>
                                {batch.expiry_date}
                             </p>
                          </div>
                       </div>
                    </div>
                 )) : (
                    <div className="p-12 text-center">
                       <Activity size={32} className="mx-auto text-slate-200 mb-4" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Serialized Batches Registered for this SKU</p>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Intelligence & Procurement Area */}
        <div className="lg:col-span-5 space-y-10">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-[#0052FF] uppercase tracking-[0.3em] bg-blue-50 px-3 py-1 rounded-sm">Industrial Grade</span>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-100 px-3 py-1 rounded-sm">Traceable SKU</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-700 leading-[1.1] tracking-tighter">
                {item.title}
              </h1>
              <div className="flex items-end gap-3 pt-4">
                 <p className="text-5xl font-medium text-slate-800 tracking-tight">{item.price.toLocaleString()} ₽</p>
                 <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">RUB / Unit</p>
              </div>
           </div>

           <div className="p-8 bg-slate-900 rounded-sm text-white space-y-4 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex justify-between items-center relative z-10">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Available Stock</p>
                    <p className="text-2xl font-black">{item.available_quantity} <span className="text-xs text-slate-500">Units</span></p>
                 </div>
                 <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-sm border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[9px] font-black uppercase tracking-widest">In Stock</span>
                 </div>
              </div>

              <div className="space-y-4 relative z-10 pt-4">
                 <button className="w-full py-6 bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-sm font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-3">
                    <ShoppingCart size={18} /> Initialize Procurement
                 </button>
                 <button 
                  onClick={onCreateStory}
                  className="w-full py-6 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 text-white border border-blue-500/30 rounded-sm font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 group"
                 >
                    <Sparkles size={18} className="text-blue-400 group-hover:rotate-12 transition-transform" /> Promote on Grid
                 </button>
                 <button className="w-full py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-sm font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3">
                    Inquire Availability
                 </button>
              </div>
           </div>

           {/* Seller Node Identity Block */}
           <div 
             onClick={() => onNavigateStore(item.seller_name || '')}
             className="bg-white rounded-sm border border-slate-100 hover:border-blue-200 transition-all cursor-pointer shadow-sm group overflow-hidden"
           >
              <div className="p-6 flex items-center gap-6 border-b border-slate-50 bg-slate-50/30">
                 <div className="relative shrink-0">
                    <img src={`https://picsum.photos/seed/${item.seller_name}/100/100`} className="w-16 h-16 rounded-sm grayscale group-hover:grayscale-0 transition-all" />
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white shadow-sm ${
                      item.seller_type === 'enterprise' ? 'bg-blue-600 text-white' : 'bg-amber-50 text-white'
                    }`}>
                      {item.seller_type === 'enterprise' ? <Building2 size={10} /> : <User size={10} />}
                    </div>
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                       <h4 className="font-black text-slate-700 text-sm truncate">{item.seller_name}</h4>
                       <ShieldCheck size={14} className="text-[#0052FF] shrink-0" />
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                       <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                         item.seller_type === 'enterprise' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                       }`}>
                         {item.seller_type === 'enterprise' ? 'Enterprise Entity' : 'Independent Node'}
                       </span>
                       <div className="flex items-center gap-1 text-amber-500">
                          <Star size={10} fill="currentColor" />
                          <span className="text-[10px] font-black text-slate-500">{item.seller_rating} Rating</span>
                       </div>
                    </div>
                 </div>
                 <ArrowUpRight size={20} className="text-slate-300 group-hover:text-[#0052FF] transition-colors shrink-0" />
              </div>

              {/* Integrity Matrix */}
              <div className="p-6 grid grid-cols-3 gap-6">
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                       <ShieldAlert size={10} /> Reliability
                    </p>
                    <div className="h-1 bg-slate-100 rounded-full w-full overflow-hidden">
                       <div className="bg-blue-600 h-full" style={{ width: `${item.seller_metrics?.reliability || 90}%` }}></div>
                    </div>
                    <p className="text-[9px] font-black text-slate-700 mt-1.5">{item.seller_metrics?.reliability || 90}%</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                       <Truck size={10} /> Speed
                    </p>
                    <div className="h-1 bg-slate-100 rounded-full w-full overflow-hidden">
                       <div className="bg-blue-600 h-full" style={{ width: `${item.seller_metrics?.delivery_speed || 85}%` }}></div>
                    </div>
                    <p className="text-[9px] font-black text-slate-700 mt-1.5">{item.seller_metrics?.delivery_speed || 85}%</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                       <Zap size={10} /> Trust
                    </p>
                    <div className="h-1 bg-slate-100 rounded-full w-full overflow-hidden">
                       <div className="bg-blue-600 h-full" style={{ width: `${item.seller_metrics?.integrity_score || 95}%` }}></div>
                    </div>
                    <p className="text-[9px] font-black text-slate-700 mt-1.5">{item.seller_metrics?.integrity_score || 95}%</p>
                 </div>
              </div>
           </div>

           {/* Descriptive Segment */}
           <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-700 uppercase tracking-[0.3em] flex items-center gap-2">
                 <Info size={16} className="text-[#0052FF]" /> Intelligence Summary
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                 {item.description || `This high-performance industrial asset (SKU: ${item.inventory_number}) has been verified through the Nexus neural logistics grid. Detailed testing confirms compliance with grade ${item.condition.toUpperCase()} standards. Immediate dispatch available.`}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailView;
