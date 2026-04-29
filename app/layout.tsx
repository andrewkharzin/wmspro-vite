import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import AiAssistant from '../components/AiAssistant';
import MessengerOverlay from '../components/MessengerOverlay';
import {
  Sparkles, Search, Bell, ShoppingBag, LogOut, User,
  ChevronDown, Settings, CreditCard, LayoutGrid, Terminal,
  MessageCircle, ExternalLink, ShieldCheck, Database
} from 'lucide-react';
import { useTranslation } from '../lib/i18n';
import { useAuthStore } from '@/lib/store/authStore';

export default function RootLayout({
  children,
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  isAiOpen,
  setIsAiOpen,
  lang,
  setLang,
  onLaunchMarketplace,
  onLogout,
  searchQuery,
  setSearchQuery
}: any) {
  const t = useTranslation(lang);
  const isDashboard = activeTab === 'dashboard';
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMessengerOpen, setIsMessengerOpen] = useState(false);
  const [messengerContext, setMessengerContext] = useState<'marketplace' | 'support'>('support');

  // Берем пользователя из store - больше НЕТ локальной загрузки данных
  const { user, isLoading } = useAuthStore();

  const openMessenger = (context: 'marketplace' | 'support') => {
    setMessengerContext(context);
    setIsMessengerOpen(true);
  };

  // Генерация аватара через ui-avatars.com (надежный fallback)
  const avatarUrl = user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=0052FF&color=fff&bold=true&size=160`;

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] relative selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden font-opensans antialiased">
      {/* Background Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-500/[0.04] blur-[120px]"></div>
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/[0.04] blur-[120px]"></div>
      </div>

      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isCollapsed}
          toggleSidebar={() => setIsCollapsed(!isCollapsed)}
          lang={lang}
        />
      </div>

      <main className={`flex-1 relative transition-all duration-700 ease-in-out z-10 flex flex-col
        ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}
        mb-20 md:mb-0`}
      >
        <header className="sticky top-0 z-[100] bg-white/80 backdrop-blur-3xl border-b border-slate-200/40 px-6 md:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="md:hidden w-10 h-10 bg-[#0052FF] rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">N</div>
             <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter font-montserrat">{t[activeTab as keyof typeof t] || activeTab}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-ui">{t.network_secure} • {t.terminal}</p>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6 font-ui">
             <div className="hidden sm:flex bg-slate-100/60 p-1 rounded-sm border border-slate-200/50 items-center">
                <button onClick={() => setLang('en')} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all ${lang === 'en' ? 'bg-white text-[#0052FF] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>EN</button>
                <button onClick={() => setLang('ru')} className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-sm transition-all ${lang === 'ru' ? 'bg-white text-[#0052FF] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>RU</button>
             </div>

             <div className="hidden lg:flex items-center bg-slate-100/40 rounded-sm px-4 py-2.5 border border-slate-200/50 w-64 focus-within:w-80 transition-all focus-within:bg-white focus-within:ring-8 focus-within:ring-blue-500/5">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.search_placeholder}
                  className="bg-transparent border-none outline-none text-xs font-bold ml-2 w-full text-slate-700"
                />
             </div>

             <div className="flex items-center gap-2">
                <button
                  onClick={() => openMessenger('support')}
                  className="p-2.5 text-slate-400 hover:text-[#0052FF] transition-all relative"
                >
                   <MessageCircle size={20} strokeWidth={2} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                </button>
                <button onClick={() => onLaunchMarketplace?.()} className="p-2.5 text-slate-400 hover:text-[#0052FF] transition-all relative group" title="Open Full Marketplace">
                   <ShoppingBag size={20} strokeWidth={2} />
                </button>
                <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors relative">
                   <Bell size={20} strokeWidth={2} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
             </div>

             <div className="w-px h-8 bg-slate-200/50 mx-2 hidden sm:block"></div>

             {/* Profile Drop Down */}
             <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-3 p-1 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                >
                   <div className="w-9 h-9 rounded-full bg-slate-900 overflow-hidden border-2 border-white shadow-lg">
                      <img
                        src={avatarUrl}
                        className="w-full h-full object-cover"
                        alt="Profile"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=0052FF&color=fff`;
                        }}
                      />
                   </div>
                   <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-sm shadow-2xl border border-slate-100 py-4 z-20 animate-scale-up">
                       <div className="px-6 py-4 border-b border-slate-50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorized User</p>
                          <h4 className="font-black text-slate-900 truncate">{user?.full_name || 'Loading...'}</h4>
                          <div className="flex items-center gap-2 mt-2">
                             <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-sm text-[8px] font-black uppercase tracking-widest border border-blue-100 flex items-center gap-1">
                                <ShieldCheck size={10} /> {user?.role || 'Staff'} • {user?.subscription_tier || 'Free'}
                             </span>
                          </div>
                       </div>

                       <div className="py-2">
                          {[
                            { label: 'Market Profile', icon: <User size={14}/>, action: () => onLaunchMarketplace?.() },
                            { label: 'Procurement Ledger', icon: <ShoppingBag size={14}/>, action: () => onLaunchMarketplace?.('ledger') },
                            { label: 'Messenger Terminal', icon: <MessageCircle size={14}/>, action: () => openMessenger('marketplace') },
                            { label: 'Account Settings', icon: <CreditCard size={14}/>, action: () => setActiveTab('account') },
                            { label: 'System Diagnostics', icon: <Database size={14}/>, action: () => setActiveTab('reports') },
                          ].map((item, i) => (
                            <button
                              key={i}
                              onClick={() => { item.action?.(); setIsProfileMenuOpen(false); }}
                              className="w-full flex items-center gap-3 px-6 py-3 text-slate-500 hover:text-blue-600 hover:bg-slate-50 transition-all"
                            >
                               <span className="shrink-0">{item.icon}</span>
                               <span className="text-[11px] font-black uppercase tracking-widest flex-1 text-left">{item.label}</span>
                               <ChevronDown size={12} className="-rotate-90 opacity-20" />
                            </button>
                          ))}
                       </div>

                       <div className="px-4 mt-2">
                          <button onClick={onLogout} className="w-full flex items-center justify-between p-3 bg-rose-50 text-rose-600 rounded-sm hover:bg-rose-100 transition-all group">
                             <span className="text-[10px] font-black uppercase tracking-widest">Logout System</span>
                             <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                  </>
                )}
             </div>

             <button onClick={() => setIsAiOpen(true)} className="flex items-center gap-2 bg-[#0052FF] hover:bg-slate-950 transition-all px-5 py-2.5 rounded-sm shadow-xl shadow-blue-500/10 group active:scale-95">
                <Sparkles size={16} className="text-white group-hover:rotate-12 transition-transform" />
                <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-white">{t.ask_assistant}</span>
              </button>
          </div>
        </header>

        <div className={`flex-1 animate-fade-in ${isDashboard ? 'p-0' : 'p-6 md:p-10'}`}>
          {children}
        </div>

        <AiAssistant isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} lang={lang} />

        <MessengerOverlay
          isOpen={isMessengerOpen}
          onClose={() => setIsMessengerOpen(false)}
          context={messengerContext}
          currentUser={user}
          conversation={null}
        />
      </main>

      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] h-18 bg-white/80 backdrop-blur-2xl border border-slate-200/50 rounded-sm shadow-2xl flex items-center justify-around px-4">
        {[
          { id: 'dashboard', icon: <LayoutGrid size={22} />, label: 'Nexus' },
          { id: 'inventory', icon: <ShoppingBag size={22} />, label: 'Assets' },
          { id: 'movements', icon: <Search size={22} />, label: 'Flow' }
        ].map(btn => (
          <button key={btn.id} onClick={() => setActiveTab(btn.id)} className={`flex flex-col items-center gap-1.5 ${activeTab === btn.id ? 'text-[#0052FF]' : 'text-slate-400'}`}>
            {btn.icon}
            <span className="text-[9px] font-black uppercase tracking-tighter">{btn.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}