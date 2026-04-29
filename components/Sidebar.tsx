import React, { useState, useCallback, memo } from 'react';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Activity,
  Settings,
  Users,
  Truck,
  MapPin,
  ChevronRight,
  ChevronDown,
  Layers,
  Box,
  ShoppingBag,
  LogOut as LogoutIcon,
  Globe,
  BarChart3,
  Contact as ContactIcon,
  Building2,
  User as UserIcon,
  Tag
} from 'lucide-react';
import { useTranslation, Language } from '../lib/i18n';
import { useAuthStore } from '@/lib/store/authStore';
import { useThrottle } from '@/hooks/useThrottle';
import { useDebounce } from '@/hooks/useDebounce';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  lang: Language;
}

// Мемоизированный компонент для пункта меню
const MenuItem = memo(({
  item,
  isActive,
  isCollapsed,
  onClick,
  isGroup,
  hasActiveChild
}: any) => {
  const throttledClick = useThrottle(onClick, 100);

  const handleClick = useCallback(() => {
    throttledClick();
  }, [throttledClick]);

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-150 relative group ${
        isActive || hasActiveChild
          ? isGroup ? 'text-white' : 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/20 ring-1 ring-white/10'
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      } ${isCollapsed ? 'justify-center' : ''}`}
    >
      <div className={`shrink-0 ${isActive || hasActiveChild ? 'text-white' : 'text-slate-500 group-hover:text-blue-400 transition-colors'}`}>
        {item.icon}
      </div>
      {!isCollapsed && (
        <span className="text-xs font-bold tracking-tight transition-all duration-150 truncate flex-1 text-left">
          {item.label}
        </span>
      )}

      {isCollapsed && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-sm opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50 shadow-2xl border border-white/10 translate-x-2 group-hover:translate-x-0">
          {item.label}
        </div>
      )}
    </button>
  );
});

MenuItem.displayName = 'MenuItem';

// Мемоизированный компонент для подменю
const SubMenuItem = memo(({ child, activeTab, setActiveTab }: any) => {
  const throttledSetActiveTab = useThrottle(setActiveTab, 100);

  const handleClick = useCallback(() => {
    throttledSetActiveTab(child.id);
  }, [child.id, throttledSetActiveTab]);

  return (
    <li>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-3 px-4 py-2 rounded-sm transition-all duration-150 relative group ${
          activeTab === child.id
            ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/5'
            : 'text-slate-500 hover:bg-white/5 hover:text-white'
        }`}
      >
        <div className={`shrink-0 ${activeTab === child.id ? 'text-blue-400' : 'text-slate-600 group-hover:text-blue-400 transition-colors'}`}>
          {child.icon}
        </div>
        <span className="text-[11px] font-bold tracking-tight transition-all duration-150 truncate">
          {child.label}
        </span>
      </button>
    </li>
  );
});

SubMenuItem.displayName = 'SubMenuItem';

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  toggleSidebar,
  lang
}) => {
  const [warehouseOpen, setWarehouseOpen] = useState(true);
  const { user } = useAuthStore();
  const t = useTranslation(lang);

  const menuItems = [
    { id: 'dashboard', label: t.dashboard, icon: <LayoutDashboard size={18} strokeWidth={1.5} /> },
    { id: 'marketplace', label: t.marketplace, icon: <ShoppingBag size={18} strokeWidth={1.5} /> },
    {
      id: 'warehouse_group',
      label: 'Warehouse',
      icon: <Warehouse size={18} strokeWidth={1.5} />,
      isGroup: true,
      children: [
        { id: 'locations', label: t.locations, icon: <Globe size={16} strokeWidth={1.5} /> },
        { id: 'warehouses', label: 'Zone Control', icon: <Box size={16} strokeWidth={1.5} /> },
        { id: 'inventory', label: t.inventory, icon: <Package size={16} strokeWidth={1.5} /> },
        { id: 'batches', label: t.batches, icon: <Layers size={16} strokeWidth={1.5} /> },
        { id: 'categories', label: 'Categories', icon: <Tag size={16} strokeWidth={1.5} /> },
      ]
    },
    { id: 'movements', label: t.movements, icon: <Truck size={18} strokeWidth={1.5} /> },
    { id: 'contacts', label: t.contacts, icon: <Building2 size={18} strokeWidth={1.5} /> },
    { id: 'reports', label: t.reports, icon: <BarChart3 size={18} strokeWidth={1.5} /> },
    { id: 'moderation', label: t.moderation, icon: <Activity size={18} strokeWidth={1.5} /> },
    { id: 'users', label: t.users, icon: <Users size={18} strokeWidth={1.5} /> },
    { id: 'account', label: t.account || 'Account', icon: <UserIcon size={18} strokeWidth={1.5} /> },
  ];

  // Оптимизированные обработчики
  const handleTabClick = useCallback((id: string, isGroup?: boolean) => {
    if (isGroup) {
      if (!isCollapsed) {
        setWarehouseOpen(prev => !prev);
      }
    } else {
      setActiveTab(id);
    }
  }, [isCollapsed, setActiveTab]);

  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  // Проверка активного дочернего элемента
  const hasActiveChild = useCallback((children: any[]) => {
    return children?.some(c => c.id === activeTab);
  }, [activeTab]);

  // Аватар пользователя из store
  const avatarUrl = user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || 'User')}&background=0052FF&color=fff&bold=true&size=64`;

  return (
    <div
      className={`bg-slate-950 border-r border-white/10 h-screen flex flex-col fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out shadow-2xl ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{ contain: 'layout style' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none"></div>

      {/* Logo Section */}
      <div className="p-6 border-b border-white/5 flex items-center gap-3 min-h-[80px] relative z-10">
        <div className="w-10 h-10 bg-[#0052FF] rounded-sm flex items-center justify-center font-black text-xl text-white shadow-xl shadow-blue-500/20 shrink-0">
          N
        </div>
        {!isCollapsed && (
          <div className="animate-fade-in whitespace-nowrap">
            <h1 className="text-lg font-bold text-white tracking-tight">Nexus<span className="text-blue-500">AI</span></h1>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Control Terminal</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-8 no-scrollbar relative z-10" style={{ contain: 'layout style' }}>
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.id} className="relative">
              <MenuItem
                item={item}
                isActive={activeTab === item.id}
                hasActiveChild={item.children ? hasActiveChild(item.children) : false}
                isCollapsed={isCollapsed}
                onClick={() => handleTabClick(item.id, item.isGroup)}
                isGroup={item.isGroup}
              />

              {/* Submenu */}
              {!isCollapsed && item.children && warehouseOpen && (
                <ul className="mt-1 ml-4 space-y-1 border-l border-white/5 pl-4 animate-fade-in">
                  {item.children.map(child => (
                    <SubMenuItem
                      key={child.id}
                      child={child}
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                    />
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Toggle Button */}
      <button
        onClick={handleToggleSidebar}
        className="absolute -right-3 top-24 bg-slate-900 border border-white/10 text-slate-400 rounded-full p-1.5 shadow-xl hover:text-blue-500 hover:border-blue-500/50 transition-all duration-300 z-50 active:scale-90"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <ChevronRight size={12} strokeWidth={4} className={`transition-transform duration-300 ${isCollapsed ? '' : 'rotate-180'}`} />
      </button>

      {/* User Profile Section */}
      <div className="p-4 border-t border-white/5 relative z-10 space-y-2">
        <div
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-3 p-3 bg-white/5 rounded-sm border border-white/5 group hover:bg-white/10 transition-all cursor-pointer ${isCollapsed ? 'justify-center' : ''} ${activeTab === 'account' ? 'ring-1 ring-blue-500 bg-blue-500/10' : ''}`}
        >
          <div className="relative shrink-0">
            <img
              src={avatarUrl}
              className="w-8 h-8 rounded-sm shrink-0 grayscale group-hover:grayscale-0 transition-all object-cover"
              alt="Avatar"
              loading="lazy"
            />
            <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black text-white truncate">{user?.full_name || 'Loading...'}</p>
              <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{user?.role || 'Staff'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);