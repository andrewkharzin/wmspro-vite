
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Edit2, Trash2, MapPin, Layers, Box } from 'lucide-react';
import { MOCK_LOCATIONS, MOCK_WAREHOUSES } from '../lib/constants';
import { useInventory } from '../hooks/use-inventory';
import { Item } from '../lib/types';

interface InventoryViewProps {
  onAddItem: (item?: Item) => void;
  searchOverride?: string;
}

const InventoryView: React.FC<InventoryViewProps> = ({ onAddItem, searchOverride = '' }) => {
  const { items, stats, searchTerm, setSearchTerm, deleteItem } = useInventory();

  // Sync internal search with global search if override is provided
  useEffect(() => {
    if (searchOverride !== undefined) {
      setSearchTerm(searchOverride);
    }
  }, [searchOverride, setSearchTerm]);

  const getLocationName = (id?: string) => MOCK_LOCATIONS.find(l => l.id === id)?.name || 'Unassigned';
  
  const getZoneName = (zoneId?: string) => {
    for (const wh of MOCK_WAREHOUSES) {
      const zone = wh.zones?.find(z => z.id === zoneId);
      if (zone) return zone.name;
    }
    return 'General';
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-140px)] animate-fade-in">
      {/* High-Level Stock Summary Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Valuation</p>
           <h3 className="text-2xl font-black text-slate-950">₽{(stats.totalValue / 1000).toFixed(1)}k</h3>
        </div>
        <div className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Catalog Count</p>
           <h3 className="text-2xl font-black text-slate-950">{stats.totalItems} <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">SKUs</span></h3>
        </div>
        <div className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Low Stock Trigger</p>
           <h3 className={`text-2xl font-black ${stats.lowStockCount > 0 ? 'text-red-500' : 'text-slate-950'}`}>{stats.lowStockCount}</h3>
        </div>
        <div className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Grid Sync</p>
           <h3 className="text-2xl font-black text-emerald-500">100%</h3>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-3xl rounded-sm border border-white/60 shadow-xl flex flex-col flex-1 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Stock Management</h2>
            <p className="text-sm font-medium text-slate-400">Master inventory control and spatial placement</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Locate asset via SKU or Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-sm text-xs font-bold outline-none focus:ring-8 focus:ring-blue-500/5 transition-all w-64 md:w-80 shadow-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-100 text-slate-600 rounded-sm text-[10px] font-black uppercase tracking-widest hover:border-blue-200 transition-all shadow-sm">
              <Filter size={16} /> Filter
            </button>
            <button 
              onClick={() => onAddItem()}
              className="flex items-center gap-2 px-8 py-3.5 bg-[#0052FF] text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#0041CC] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
            >
              <Plus size={18} /> Add SKU
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto no-scrollbar">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead className="bg-slate-50/50 sticky top-0 z-20 backdrop-blur-sm">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Asset Profile</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Spatial Origin</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Inventory Load</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Valuation</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((item) => (
                <tr key={item.id} className="group hover:bg-white transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-sm bg-slate-100 overflow-hidden border border-slate-100 shrink-0 group-hover:scale-105 transition-transform">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-slate-900 text-sm truncate group-hover:text-[#0052FF] transition-colors">{item.title}</h4>
                        <div className="flex items-center gap-2 mt-1.5">
                           <span className="text-[10px] font-black bg-slate-50 text-slate-500 px-2 py-0.5 rounded-sm uppercase tracking-widest">{item.inventory_number}</span>
                           <span className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'active' ? 'text-emerald-500' : 'text-amber-500'}`}>{item.status}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1.5">
                       <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-900 transition-colors">
                          <MapPin size={12} className="text-[#0052FF]" />
                          <span className="text-[11px] font-bold tracking-tight">{getLocationName(item.location_id)}</span>
                       </div>
                       <div className="flex items-center gap-2 text-slate-400">
                          <Layers size={12} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{getZoneName(item.zone_id)}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className={`text-sm font-black ${item.available_quantity < 10 ? 'text-red-500 animate-pulse' : 'text-slate-900'}`}>{item.available_quantity}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Units Active</span>
                      </div>
                      <div className="flex-1 w-24 h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                         <div 
                          className={`h-full ${item.available_quantity < 10 ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, (item.available_quantity / 100) * 100)}%` }}
                         ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <p className="text-sm font-black text-slate-900 tracking-tighter">{item.price.toLocaleString()} ₽</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Price / Unit</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button 
                        onClick={() => onAddItem(item)}
                        className="p-3 bg-blue-50 text-[#0052FF] hover:bg-[#0052FF] hover:text-white rounded-sm transition-all active:scale-90"
                       >
                          <Edit2 size={16} strokeWidth={2.5} />
                       </button>
                       <button 
                        onClick={() => deleteItem(item.id)}
                        className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-all active:scale-90"
                       >
                          <Trash2 size={16} strokeWidth={2.5} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
             <div className="py-32 flex flex-col items-center justify-center text-slate-300">
                <Box size={64} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="font-black text-xs uppercase tracking-[0.3em]">No Assets Found in Stock Grid</p>
                <button onClick={() => setSearchTerm('')} className="mt-6 px-6 py-2.5 bg-slate-100 text-slate-500 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-slate-200">Reset Search</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
