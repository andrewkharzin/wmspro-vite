
import React, { useState, useEffect } from 'react';
import { 
  Search, Heart, Plus, MessageSquare, User, ShoppingCart, 
  SlidersHorizontal, ChevronLeft, Package, Check, Bell, 
  Home, Globe, Menu, X, ArrowRight, Truck, ShieldCheck,
  Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Cpu, 
  LayoutGrid, MessageCircle, ChevronDown, LogOut, Settings, 
  CreditCard, Database, Terminal, Zap, ShieldAlert, Sparkles, BookOpen, Library
} from 'lucide-react';
import MarketplaceView from './MarketplaceView';
import StoreUserView from './marketplace/StoreUserView';
import ItemDetailView from './marketplace/ItemDetailView';
import MessengerOverlay from './MessengerOverlay';
import StoriesView from './marketplace/StoriesView';
import StoryManagerView from './marketplace/StoryManagerView';
import StoryComposer from './marketplace/StoryComposer';
import { MOCK_ITEMS, MOCK_PROFILES, MOCK_CONVERSATIONS } from '../lib/constants';
import { Item, Profile, Story } from '../lib/types';
import { useMarketplace } from '../hooks/use-marketplace';

interface FullMarketplacePageProps {
  onExit: () => void;
}

type MarketView = 'discover' | 'favorites' | 'add' | 'messages' | 'profile' | 'store' | 'item-detail' | 'stories' | 'my-stories' | 'compose-story';

const FullMarketplacePage: React.FC<FullMarketplacePageProps> = ({ onExit }) => {
  const [view, setView] = useState<MarketView>('discover');
  const [prevView, setPrevView] = useState<MarketView>('discover');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [preSelectedItemId, setPreSelectedItemId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [messengerContext, setMessengerContext] = useState<'marketplace' | 'support'>('marketplace');
  
  const mkt = useMarketplace();
  const currentUser = MOCK_PROFILES[0];

  // Immersive mode hides standard header/footer for authoring tools
  const isImmersiveMode = view === 'my-stories' || view === 'compose-story';

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  };

  const navigateToStore = (userId: string) => {
    setSelectedUserId(userId);
    setPrevView(view);
    setView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setPrevView(view);
    setView('item-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startStoryForItem = (itemId: string) => {
    setPreSelectedItemId(itemId);
    changeView('compose-story');
  };

  const changeView = (newView: MarketView) => {
    if (newView !== 'compose-story') {
      setPreSelectedItemId(null);
    }
    setPrevView(view);
    setView(newView);
    setIsProfileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openMessenger = (context: 'marketplace' | 'support') => {
    setMessengerContext(context);
    setIsMessengerOpen(true);
  };

  const renderContent = () => {
    switch (view) {
      case 'discover':
        return (
          <MarketplaceView 
            mkt={mkt}
            onNavigateStore={navigateToStore} 
            onNavigateItem={navigateToItem} 
            onAddStory={() => changeView('compose-story')}
            favorites={favorites} 
            onToggleFavorite={toggleFavorite} 
          />
        );
      case 'favorites':
        return (
          <div className="animate-fade-in px-5 md:px-0 space-y-8 min-h-[60vh]">
            <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight font-montserrat uppercase">Saved Assets</h2>
            {favorites.length === 0 ? (
              <div className="py-24 text-center bg-white/40 backdrop-blur-md rounded-2xl border border-white shadow-sm">
                <Heart size={48} strokeWidth={1} className="mx-auto mb-4 text-slate-200" />
                <p className="text-slate-400 text-sm font-medium font-opensans uppercase tracking-widest">No items saved to grid yet</p>
                <button onClick={() => setView('discover')} className="mt-6 px-8 py-3 bg-[#0052FF] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#0041CC] transition-all font-ui">Start Exploring</button>
              </div>
            ) : (
              <MarketplaceView 
                mkt={mkt}
                onlyFavorites={true} 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite} 
                onNavigateStore={navigateToStore} 
                onNavigateItem={navigateToItem} 
                onAddStory={() => changeView('compose-story')}
              />
            )}
          </div>
        );
      case 'item-detail':
        const item = MOCK_ITEMS.find(i => i.id === selectedItemId);
        return item ? (
          <div className="px-5 md:px-0 min-h-[70vh]">
            <ItemDetailView 
                item={item} 
                onBack={() => setView(prevView === 'item-detail' ? 'discover' : prevView)} 
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
                onNavigateStore={navigateToStore}
                onCreateStory={() => startStoryForItem(item.id)}
            />
          </div>
        ) : null;
      case 'add':
        return (
          <div className="animate-scale-up px-5 md:px-0 pb-32 max-w-2xl mx-auto space-y-8 min-h-[70vh]">
            <div className="text-center">
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter font-montserrat uppercase">Global Asset Registration</h2>
              <p className="text-sm text-slate-400 font-medium mt-2 font-opensans uppercase tracking-widest">Inject your inventory into the Nexus neural supply grid.</p>
            </div>
            <div className="bg-white/90 backdrop-blur-3xl p-8 md:p-12 rounded-3xl border border-white shadow-2xl shadow-slate-200/20 space-y-8">
               <div className="aspect-video bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-[#0052FF] transition-all cursor-pointer group">
                  <Plus size={48} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-4 font-ui">Upload Visual Metadata</span>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 font-ui">Product Designation</label>
                    <input type="text" placeholder="e.g. Siemens S7-1200 Controller" className="w-full p-5 bg-slate-50/50 border border-slate-100 rounded-xl font-bold text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all font-opensans" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 font-ui">Market Price (RUB)</label>
                    <input type="number" placeholder="0.00" className="w-full p-5 bg-slate-50/50 border border-slate-100 rounded-xl font-bold text-sm outline-none font-roboto" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 font-ui">Logistics Grade</label>
                    <select className="w-full p-5 bg-slate-50/50 border border-slate-100 rounded-xl font-bold text-sm outline-none appearance-none cursor-pointer font-opensans">
                      <option>Industrial-S (New)</option>
                      <option>Refurbished-A</option>
                      <option>As-Is / Salvage</option>
                    </select>
                  </div>
                  <button className="md:col-span-2 py-6 bg-[#0052FF] text-white rounded-xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-[#0041CC] transition-all active:scale-95 font-ui">
                    Sync to Network
                  </button>
               </div>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="animate-fade-in px-5 md:px-0 max-w-5xl mx-auto space-y-8 min-h-[60vh]">
            <div className="flex items-center justify-between border-b border-slate-200 pb-6">
               <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight font-montserrat uppercase">Encrypted Neural Comms</h2>
               <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                  <ShieldCheck size={14} /> Protocols Secure
               </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               <div className="lg:col-span-4 space-y-3">
                  {MOCK_CONVERSATIONS.map((conv, i) => (
                    <div key={conv.id} onClick={() => openMessenger('marketplace')} className={`p-6 bg-white border rounded-2xl cursor-pointer transition-all hover:shadow-xl group relative overflow-hidden ${i === 0 ? 'border-blue-500 shadow-xl ring-1 ring-blue-500/20' : 'border-slate-100'}`}>
                       <div className="flex items-center gap-4 relative z-10">
                          <img src={conv.participants[1].avatar_url} className="w-12 h-12 rounded-xl object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-black text-slate-900 text-sm font-ui truncate">{conv.participants[1].full_name}</h4>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-ui">14:02</span>
                             </div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase truncate mb-2">{conv.subject}</p>
                             <p className="text-xs text-slate-500 truncate font-medium italic font-opensans">"{conv.last_message}"</p>
                          </div>
                          {conv.unread_count > 0 && <div className="w-2 h-2 bg-[#0052FF] rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>}
                       </div>
                    </div>
                  ))}
               </div>
               <div className="lg:col-span-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-20 text-center">
                  <MessageCircle size={48} className="text-slate-200 mb-6" />
                  <h3 className="text-xl font-black text-slate-500 uppercase tracking-widest">Select a channel to begin secure synchronization</h3>
                  <p className="text-slate-400 text-sm mt-4 max-w-sm">Neural links are established per-node. All communications are logged to the corporate immutable ledger.</p>
               </div>
            </div>
          </div>
        );
      case 'stories':
        return <StoriesView onBack={() => changeView('discover')} onNavigateStore={navigateToStore} />;
      case 'my-stories':
        return <StoryManagerView currentUser={currentUser} onBack={() => changeView('stories')} />;
      case 'compose-story':
        return (
          <StoryComposer 
            currentUser={currentUser} 
            initialItemId={preSelectedItemId || undefined}
            onBack={() => changeView('discover')} 
            onSave={(s: Story) => { console.log('Saved', s); changeView('my-stories'); }} 
          />
        );
      case 'profile':
        changeView('discover');
        return null;
      case 'store':
        return (
          <div className="px-5 md:px-0 min-h-[60vh]">
            {selectedUserId ? <StoreUserView userId={selectedUserId} onBack={() => setView(prevView)} /> : null}
          </div>
        );
      default:
        return (
          <MarketplaceView 
            mkt={mkt}
            onNavigateStore={navigateToStore} 
            onNavigateItem={navigateToItem} 
            onAddStory={() => changeView('compose-story')}
            favorites={favorites} 
            onToggleFavorite={toggleFavorite} 
          />
        );
    }
  };

  return (
    <div className={`min-h-screen bg-[#FDFDFF] flex flex-col font-opensans selection:bg-blue-100 selection:text-blue-900 ${view === 'compose-story' ? '' : isImmersiveMode ? 'h-screen overflow-hidden' : ''}`}>
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/[0.04] blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/[0.04] blur-[120px]"></div>
      </div>

      {/* ULTIMATE GLASS HEADER - Hidden in immersive Story Creation mode */}
      {!isImmersiveMode && (
        <div className="sticky top-0 z-[110] px-4 md:px-8 py-4 pointer-events-none">
          <header className="max-w-[1600px] mx-auto pointer-events-auto bg-white/70 backdrop-blur-3xl border border-white/40 rounded-[2.5rem] shadow-2xl shadow-slate-200/40 overflow-hidden group/header transition-all duration-500 hover:bg-white/80">
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent animate-pulse"></div>
            <div className="px-6 md:px-10 py-4 md:py-5 flex items-center justify-between gap-4 md:gap-12 relative z-10">
              {/* Logo Sector */}
              <div className="flex items-center gap-4 cursor-pointer group/logo shrink-0" onClick={() => changeView('discover')}>
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#0052FF] rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20 group-active/logo:scale-90 transition-all duration-500">N</div>
                <div className="hidden md:block">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none font-montserrat">Nexus<span className="text-[#0052FF]">Market</span></h1>
                  <div className="flex items-center gap-2 mt-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-ui">Neural Grid Active</p>
                  </div>
                </div>
              </div>

              {/* Premium Search Hub */}
              <div className="flex-1 max-w-2xl relative group/search font-ui hidden sm:block">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within/search:text-[#0052FF] transition-colors duration-500">
                  <Search size={20} strokeWidth={2.5} />
                </div>
                <input type="text" placeholder="Search logistics matrix... [ / ]" value={mkt.searchQuery} onChange={(e) => mkt.setSearchQuery(e.target.value)} className="w-full bg-slate-950/[0.03] border border-slate-200/20 rounded-full py-4 md:py-5 pl-16 pr-16 text-sm font-black text-slate-700 placeholder:text-slate-400 focus:ring-[12px] focus:ring-blue-500/[0.04] focus:bg-white focus:border-blue-500/20 transition-all duration-500 outline-none" />
              </div>

              {/* Action Matrix */}
              <div className="flex items-center gap-2 md:gap-5 font-ui">
                <div className="flex items-center bg-slate-100/40 p-1.5 rounded-2xl border border-slate-200/20">
                  <button onClick={() => changeView('stories')} className={`p-3 rounded-xl transition-all relative group/btn ${view === 'stories' ? 'bg-blue-600 text-white shadow-xl' : 'text-slate-400 hover:text-[#0052FF] hover:bg-white'}`} title="Community Intel">
                    <Library size={24} strokeWidth={2.2} />
                  </button>
                  <button onClick={() => openMessenger('marketplace')} className="p-3 text-slate-400 hover:text-[#0052FF] hover:bg-white rounded-xl transition-all relative group/btn" title="Comms Terminal">
                    <MessageSquare size={24} strokeWidth={2.2} className="group-hover/btn:scale-110 transition-transform" />
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#0052FF] rounded-full border-2 border-white shadow-lg animate-bounce"></span>
                  </button>
                </div>

                <div className="w-[1px] h-10 bg-slate-200/30 mx-1 hidden md:block"></div>

                {/* ULTIMATE PROFILE DROP DOWN */}
                <div className="relative">
                   <button onClick={() => setIsProfileOpen(!isProfileOpen)} className={`flex items-center gap-3 p-1.5 rounded-2xl border transition-all duration-500 ${isProfileOpen ? 'bg-white border-blue-500/20 shadow-xl' : 'hover:bg-white hover:border-slate-200 border-transparent'}`}>
                     <div className="relative">
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden border-2 border-white shadow-xl"><img src={currentUser.avatar_url} className="w-full h-full object-cover" /></div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white shadow-sm flex items-center justify-center"><div className="w-1 h-1 bg-white rounded-full animate-ping"></div></div>
                     </div>
                     <ChevronDown size={14} className={`text-slate-400 transition-transform duration-500 hidden sm:block ${isProfileOpen ? 'rotate-180 text-blue-500' : ''}`} />
                   </button>

                   {isProfileOpen && (
                     <>
                       <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                       <div className="absolute right-0 mt-4 w-80 bg-white/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl border border-white p-6 z-20 animate-scale-up origin-top-right">
                          <div className="pb-6 border-b border-slate-100">
                             <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden border-4 border-slate-50 shadow-inner"><img src={currentUser.avatar_url} className="w-full h-full object-cover" /></div>
                                <div className="min-w-0"><h4 className="text-base font-black text-slate-900 truncate tracking-tight">{currentUser.full_name}</h4><p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5">Enterprise Core Access</p></div>
                             </div>
                          </div>
                          <div className="py-4 space-y-1">
                             {[
                               { label: 'My Chronicles', icon: <BookOpen size={16}/>, action: () => changeView('my-stories'), desc: 'Neural Deployment Logs' },
                               { label: 'Neural Profile', icon: <User size={16}/>, action: () => changeView('profile'), desc: 'Identity & Ranking' },
                               { label: 'Trade Comms', icon: <MessageCircle size={16}/>, action: () => openMessenger('marketplace'), desc: 'Secure P2P Sync', badge: 'Active' },
                               { label: 'System Control', icon: <Settings size={16}/>, action: onExit, desc: 'WMS Core Terminal' },
                             ].map((item, i) => (
                               <button key={i} onClick={() => { item.action?.(); setIsProfileOpen(false); }} className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-[#0052FF]/[0.03] transition-all group/item text-left">
                                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-white group-hover/item:text-[#0052FF] group-hover/item:shadow-lg group-hover/item:shadow-blue-500/10 transition-all">{item.icon}</div>
                                  <div className="flex-1"><div className="flex items-center justify-between"><p className="text-xs font-black text-slate-700 group-hover/item:text-[#0052FF] transition-colors">{item.label}</p>{item.badge && <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full uppercase tracking-widest">{item.badge}</span>}</div><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.desc}</p></div>
                               </button>
                             ))}
                          </div>
                          <div className="pt-4 mt-2 border-t border-slate-100">
                             <button onClick={onExit} className="w-full flex items-center justify-between p-5 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all group/exit"><span className="text-xs font-black uppercase tracking-widest">Terminate Portal</span><LogOut size={16} strokeWidth={2.5} className="group-hover/exit:translate-x-1 transition-transform" /></button>
                          </div>
                       </div>
                     </>
                   )}
                </div>
              </div>
            </div>
          </header>
        </div>
      )}

      <main className={`flex-1 w-full relative z-10 ${isImmersiveMode ? 'max-w-none p-0 overflow-visible' : 'max-w-[1600px] mx-auto py-4 md:py-10 mb-24 md:mb-0'}`}>
        {renderContent()}
      </main>

      <MessengerOverlay 
        isOpen={isMessengerOpen} 
        onClose={() => setIsMessengerOpen(false)}
        context={messengerContext}
        currentUser={currentUser}
        conversation={messengerContext === 'marketplace' ? MOCK_CONVERSATIONS[0] : MOCK_CONVERSATIONS[1]}
      />

      {/* FOOTER - Explicitly hidden in immersive Story Creation mode */}
      {!isImmersiveMode && (
        <footer className="bg-slate-950 text-white pt-24 pb-12 px-6 relative overflow-hidden z-20">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
           <div className="max-w-[1600px] mx-auto relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-12 mb-20">
                 <div className="lg:col-span-2 space-y-8 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                       <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl">N</div>
                       <h2 className="text-2xl font-black tracking-tighter uppercase font-montserrat">Nexus<span className="text-blue-500">Market</span></h2>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-sm mx-auto md:mx-0">
                       The industrial world's most advanced neural marketplace for distribution assets and surplus optimization. Built for the high-throughput future.
                    </p>
                 </div>
              </div>
           </div>
        </footer>
      )}
    </div>
  );
};

export default FullMarketplacePage;
