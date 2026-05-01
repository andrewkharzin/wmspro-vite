'use client';

import React, { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { Loader2 } from 'lucide-react';
import AppFrame from '@/components/AppFrame';
import DashboardStats from '@/components/DashboardStats';
import MarketplaceView from '@/components/MarketplaceView';
import ModerationView from '@/components/ModerationView';
import InventoryView from '@/components/InventoryView';
import BatchManagerView from '@/components/BatchManagerView';
import WarehousesView from '@/components/WarehousesView';
import LocationsView from '@/components/LocationsView';
import MovementsView from '@/components/MovementsView';
import ReportsView from '@/components/ReportsView';
import AddItemModal from '@/components/AddItemModal';
import FullMarketplacePage from '@/components/FullMarketplacePage';
import PersonnelManagerView from '@/components/PersonnelManagerView';
import ContactsView from '@/components/ContactsView';
import AccountView from '@/components/AccountView';
import AuthPages from '@/components/AuthPages';
import CategoryManagerView from '@/components/CategoryManagerView';
import { Item } from '@/lib/types';
import { Language } from '@/lib/i18n';

export function AppContent({ initialTab = 'dashboard' }: { initialTab?: string }) {
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isAiOpen, setIsAiOpen] = React.useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Item | undefined>(undefined);
  const [isFullPage, setIsFullPage] = React.useState(false);
  const [lang, setLang] = React.useState<Language>('en');
  const [selectedWarehouseLocation, setSelectedWarehouseLocation] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleLogin = async () => {};

  const handleLogout = async () => {
    const { logout } = useAuthStore.getState();
    await logout();
    setIsFullPage(false);
    setActiveTab('dashboard');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FDFDFF]">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-slate-500 font-medium">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPages onLogin={handleLogin} />;
  }

  if (isFullPage) {
    return <FullMarketplacePage onExit={() => setIsFullPage(false)} />;
  }

  const handleNavigateToMarketplace = (itemId?: string) => {
    setIsFullPage(true);
  };

  const handleNavigateToZones = (locationId: string) => {
    setSelectedWarehouseLocation(locationId);
    setActiveTab('warehouses');
  };

  const handleOpenAddItem = (item?: Item) => {
    setEditingItem(item);
    setIsAddItemOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats onNavigateMarketplace={handleNavigateToMarketplace} lang={lang} />;
      case 'marketplace':
        return <MarketplaceView />;
      case 'moderation':
        return <ModerationView />;
      case 'inventory':
        return <InventoryView onAddItem={handleOpenAddItem} />;
      case 'batches':
        return <BatchManagerView />;
      case 'warehouses':
        // return <WarehousesView initialLocationId={selectedWarehouseLocation || undefined} />;
      case 'locations':
        return <LocationsView onNavigateToZones={handleNavigateToZones} />;
      case 'movements':
        return <MovementsView />;
      case 'contacts':
        return <ContactsView />;
      case 'reports':
        return <ReportsView />;
      case 'users':
        return <PersonnelManagerView lang={lang} />;
      case 'account':
        return <AccountView lang={lang} />;
      case 'categories':
        return <CategoryManagerView />;
      default:
        return <DashboardStats onNavigateMarketplace={handleNavigateToMarketplace} lang={lang} />;
    }
  };

  return (
    <AppFrame
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
      isAiOpen={isAiOpen}
      setIsAiOpen={setIsAiOpen}
      lang={lang}
      setLang={setLang}
      onLaunchMarketplace={handleNavigateToMarketplace}
      onLogout={handleLogout}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      {renderContent()}
      {isAddItemOpen && (
        <AddItemModal
          editItem={editingItem}
          onClose={() => {
            setIsAddItemOpen(false);
            setEditingItem(undefined);
          }}
        />
      )}
    </AppFrame>
  );
}

export default function LegacyBootstrap() {
  return <AppContent />;
}