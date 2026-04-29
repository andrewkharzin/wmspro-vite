// components/AnimatedTabs.tsx
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface AnimatedTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: Array<{ id: string; label: string; icon: React.ReactNode; component: React.ReactNode }>;
}

export const AnimatedTabs: React.FC<AnimatedTabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex h-full">
      {/* Sidebar с анимацией */}
      <div className="w-72 bg-slate-50/50 border-r border-slate-100 flex flex-col p-8 gap-1 shrink-0">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-between p-4 rounded-sm transition-all group ${
              activeTab === tab.id ? 'bg-white text-blue-600 shadow-xl ring-1 ring-slate-100' : 'text-slate-500 hover:bg-white hover:text-slate-900'
            }`}
            whileTap={{ scale: 0.98 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-3">
              <span className={`${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`}>
                {tab.icon}
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
            </div>
            <ChevronRight size={14} className={`transition-all ${activeTab === tab.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
          </motion.button>
        ))}
      </div>

      {/* Content с анимацией */}
      <div className="flex-1 overflow-y-auto p-10 bg-white/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {tabs.find(tab => tab.id === activeTab)?.component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};