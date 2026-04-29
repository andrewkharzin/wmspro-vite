
import React from 'react';
// Added Search and ShoppingCart to imports from lucide-react
import { ChevronLeft, MapPin, Star, ShieldCheck, Mail, MessageSquare, Package, TrendingUp, Info, ExternalLink, Grid, List, Search, ShoppingCart } from 'lucide-react';
import { MOCK_ITEMS, MOCK_PROFILES } from '../../lib/constants';

interface StoreUserViewProps {
  userId: string;
  onBack: () => void;
}

const StoreUserView: React.FC<StoreUserViewProps> = ({ userId, onBack }) => {
  // We mock a user based on the ID/Name passed
  const userItems = MOCK_ITEMS.filter(item => item.seller_name === userId || userId === 'MegaTools Ltd');
  const userProfile = MOCK_PROFILES.find(p => p.full_name === userId) || {
    id: "u-mock",
    full_name: userId,
    role: "seller",
    avatar_url: `https://picsum.photos/seed/${userId}/200/200`,
    email: `${userId.toLowerCase().replace(' ', '')}@industrial.com`,
    subscription_tier: "enterprise",
    status: "active",
    last_active: "Active now"
  };

  return (
    <div className="animate-fade-in pb-20">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold text-sm mb-8 transition-colors"
      >
        <ChevronLeft size={20} />
        Back to Results
      </button>

      {/* Profile Header */}
      <div className="relative mb-12">
        <div className="h-64 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden shadow-xl">
           <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center"></div>
        </div>

        <div className="max-w-[1400px] mx-auto px-12 -mt-20 relative z-10 flex flex-col md:flex-row items-end gap-8">
          <img 
            src={userProfile.avatar_url || `https://picsum.photos/seed/${userId}/200/200`} 
            className="w-40 h-40 rounded-[2.5rem] border-8 border-white shadow-2xl bg-white" 
            alt={userProfile.full_name} 
          />
          <div className="pb-4 flex-1">
            <div className="flex items-center gap-3 mb-2">
               <h1 className="text-4xl font-black text-slate-900 tracking-tight">{userProfile.full_name}</h1>
               <div className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-blue-500/20">
                  <ShieldCheck size={14} /> Verified Enterprise
               </div>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500">
               <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  Industrial Hub North, RU
               </div>
               <div className="flex items-center gap-2">
                  <Star size={16} className="text-amber-500 fill-current" />
                  4.9 Rating (1.2K Sales)
               </div>
               <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-500" />
                  98% Delivery Rate
               </div>
            </div>
          </div>
          <div className="pb-4 flex gap-3">
             <button className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm">
                Follow Store
             </button>
             <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                Message Seller
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                 <Info size={18} className="text-blue-600" />
                 About Seller
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                 Primary supplier of industrial grade hardware and manufacturing equipment since 2018. Specializing in surplus optimization and verified logistics.
              </p>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase">Member Since</span>
                    <span className="font-black text-slate-900">May 2021</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase">Response Time</span>
                    <span className="font-black text-slate-900">&lt; 1 hour</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-bold uppercase">Status</span>
                    <span className="font-black text-emerald-600 uppercase">Live Now</span>
                 </div>
              </div>
           </div>

           <div className="bg-blue-600 p-8 rounded-3xl text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 text-white/10 group-hover:scale-110 transition-transform duration-700">
                 <Star size={120} fill="currentColor" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest mb-2 text-blue-100">Top Rated Seller</h4>
              <p className="text-lg font-bold mb-6">Consistently high marks for quality and shipping speed.</p>
              <button className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30 transition-colors">
                 View Feedback
              </button>
           </div>
        </div>

        {/* Store Listings */}
        <div className="lg:col-span-3">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                 <h2 className="text-2xl font-black text-slate-900">Product Catalog</h2>
                 <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">{userItems.length} Items</span>
              </div>
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                       type="text" 
                       placeholder="Search store..." 
                       className="pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
                 <div className="flex border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <button className="p-2 bg-blue-50 text-blue-600"><Grid size={18} /></button>
                    <button className="p-2 bg-white text-slate-400 hover:bg-slate-50 border-l border-slate-100"><List size={18} /></button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {userItems.map(item => (
                <div key={item.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden">
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                     <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                     <h3 className="font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors text-lg line-clamp-2">{item.title}</h3>
                     
                     <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Unit Price</span>
                          <span className="text-2xl font-black text-slate-900">${item.price.toLocaleString()}</span>
                        </div>
                        <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg active:scale-95">
                           <ShoppingCart size={20} />
                        </button>
                     </div>
                  </div>
                </div>
              ))}
              {userItems.length === 0 && (
                 <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
                    <Package size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No active listings from this seller found in current view.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StoreUserView;
