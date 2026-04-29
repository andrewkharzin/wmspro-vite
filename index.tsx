import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useAuthStore } from './lib/store/authStore';
import { Loader2 } from 'lucide-react';
import RootLayout from './app/layout';
import DashboardPage from './app/page';
import MarketplacePage from './app/marketplace/page';
import ModerationPage from './app/moderation/page';
import InventoryView from './components/InventoryView';
import BatchManagerView from './components/BatchManagerView';
import WarehousesView from './components/WarehousesView';
import LocationsView from './components/LocationsView';
import MovementsView from './components/MovementsView';
import ReportsView from './components/ReportsView';
import AddItemModal from './components/AddItemModal';
import FullMarketplacePage from './components/FullMarketplacePage';
import PersonnelManagerView from './components/PersonnelManagerView';
import ContactsView from './components/ContactsView';
import AccountView from './components/AccountView';
import AuthPages from './components/AuthPages';
import CategoryManagerView from './components/CategoryManagerView';
import { Item } from './lib/types';
import { Language } from './lib/i18n';

const AppContent = () => {
  const { isAuthenticated, isLoading, initialize, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
  const [isFullPage, setIsFullPage] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [selectedWarehouseLocation, setSelectedWarehouseLocation] = useState<string | null>(null);

  // Инициализация аутентификации при загрузке приложения
  useEffect(() => {
    initialize();
  }, []);

  const handleLogin = (role: string, tier: string) => {
    // Аутентификация уже обработана в store, просто обновляем UI
    console.log('User logged in:', role, tier);
  };

  const handleLogout = async () => {
    await logout();
    setIsFullPage(false);
    setActiveTab('dashboard');
  };

  // Показываем спиннер пока проверяется аутентификация
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
        return <DashboardPage onNavigateMarketplace={handleNavigateToMarketplace} lang={lang} />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'moderation':
        return <ModerationPage />;
      case 'inventory':
        return <InventoryView onAddItem={handleOpenAddItem} />;
      case 'batches':
        return <BatchManagerView />;
      case 'warehouses':
        return <WarehousesView initialLocationId={selectedWarehouseLocation || undefined} />;
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
        return <DashboardPage onNavigateMarketplace={handleNavigateToMarketplace} lang={lang} />;
    }
  };

  return (
    <RootLayout
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
      searchQuery={''}
      setSearchQuery={() => {}}
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
    </RootLayout>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppContent />
    </React.StrictMode>
  );
}