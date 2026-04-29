
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Star, Plus, MoreVertical, Building, Home, ShoppingBag, Box, Check, X, ArrowUpRight, Search, Activity, Layers, Target, Navigation } from 'lucide-react';
import { MOCK_LOCATIONS, MOCK_WAREHOUSES } from '../lib/constants';
import { Location } from '../lib/types';

interface LocationsViewProps {
  onNavigateToZones?: (locationId: string) => void;
}

const MiniMap: React.FC<{ loc: Location }> = ({ loc }) => {
  return (
    <div className="relative w-full h-36 bg-slate-900 rounded-sm overflow-hidden group/map border border-slate-800 shadow-inner">
      {/* Simulated Satellite/Map Image */}
      <img 
        src={`https://picsum.photos/seed/${loc.id}/600/300?grayscale&blur=2`} 
        className="w-full h-full object-cover opacity-30 group-hover/map:scale-110 transition-transform duration-[3000ms] group-hover/map:opacity-40" 
        alt="Spatial Grid"
      />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* HUD Elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Pulsing Marker */}
        <div className="relative">
          <div className="absolute -inset-4 bg-blue-500/20 rounded-full animate-ping"></div>
          <div className="absolute -inset-2 bg-blue-500/40 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_rgba(59,130,246,1)] z-10"></div>
        </div>
        
        {/* Crosshair */}
        <div className="absolute inset-0 border border-blue-500/10 flex items-center justify-center">
          <div className="w-10 h-[1px] bg-blue-500/30"></div>
          <div className="h-10 w-[1px] bg-blue-500/30"></div>
        </div>
      </div>

      {/* Coordinate Labels */}
      <div className="absolute bottom-3 left-4 flex flex-col gap-0.5 pointer-events-none">
         <p className="text-[8px] font-black text-blue-400/80 uppercase tracking-[0.2em] flex items-center gap-1">
           <Navigation size={8} className="rotate-45" /> Spatial Vectors
         </p>
         <p className="text-[10px] font-mono font-black text-white/60">
           {loc.latitude?.toFixed(4) || '55.7558'}° N, {loc.longitude?.toFixed(4) || '37.6173'}° E
         </p>
      </div>

      <div className="absolute top-3 right-4 pointer-events-none">
         <div className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded-sm">
            <p className="text-[8px] font-black text-blue-300 uppercase tracking-widest">Active Link</p>
         </div>
      </div>
    </div>
  );
};

const LocationsView: React.FC<LocationsViewProps> = ({ onNavigateToZones }) => {
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [newLocation, setNewLocation] = useState<Partial<Location>>({
    name: '',
    location_code: '',
    type: 'warehouse',
    address: '',
    city: '',
    country: 'Russia',
    is_active: true,
    is_default: false,
    allow_pickup: true
  });

  const handleAddLocation = () => {
    const loc: Location = {
      ...newLocation as Location,
      id: `loc-${Date.now()}`,
      items_count: 0
    };
    
    if (loc.is_default) {
        setLocations(prev => prev.map(l => ({ ...l, is_default: false })).concat(loc));
    } else {
        setLocations([...locations, loc]);
    }
    setIsAddModalOpen(false);
    setNewLocation({
        name: '',
        location_code: '',
        type: 'warehouse',
        address: '',
        city: '',
        country: 'Russia',
        is_active: true,
        is_default: false,
        allow_pickup: true
    });
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    loc.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getWarehouseData = (locationId: string) => {
    return MOCK_WAREHOUSES.find(wh => wh.location_id === locationId);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'home': return <Home size={18} />;
      case 'retail': return <ShoppingBag size={18} />;
      case 'warehouse': return <Building size={18} />;
      default: return <MapPin size={18} />;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white/40 p-6 rounded-sm border border-white/60 backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Global Hub Network</h2>
          <p className="text-sm font-medium text-slate-400">Managing physical endpoints across the neural supply grid</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search nodes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-sm text-xs font-bold outline-none focus:ring-8 focus:ring-blue-500/5 transition-all w-64 md:w-80 shadow-sm"
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3.5 bg-slate-950 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#0052FF] transition-all shadow-xl active:scale-95"
          >
            <Plus size={18} />
            Add Hub
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 overflow-y-auto pb-10 no-scrollbar">
        {filteredLocations.map(loc => {
          const warehouse = getWarehouseData(loc.id);
          return (
            <div key={loc.id} className="bg-white rounded-sm border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col h-full relative overflow-hidden">
              {loc.is_default && (
                <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[10px] font-black px-4 py-1.5 rounded-bl-sm z-20 flex items-center gap-2 uppercase tracking-widest">
                  <Star size={10} fill="currentColor" /> Primary Hub
                </div>
              )}
              
              <div className="p-8 pb-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-sm flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
                      loc.type === 'warehouse' ? 'bg-blue-50 text-blue-600 shadow-blue-500/10' : 
                      loc.type === 'retail' ? 'bg-purple-50 text-purple-600 shadow-purple-500/10' : 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10'
                    }`}>
                      {getTypeIcon(loc.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{loc.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded-sm text-slate-500 uppercase tracking-widest">{loc.location_code}</span>
                         <span className={`text-[10px] font-black uppercase tracking-widest ${loc.is_active ? 'text-emerald-500' : 'text-red-500'}`}>{loc.is_active ? 'Active' : 'Offline'}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>

              {/* NEW MINI MAP SECTION */}
              <div className="px-8 py-2">
                <MiniMap loc={loc} />
              </div>

              <div className="p-8 pt-4 space-y-6 flex-1 relative z-10">
                 <div className="flex items-start gap-3 text-sm font-medium text-slate-500">
                    <MapPin size={18} className="mt-0.5 text-blue-500 shrink-0" />
                    <span className="truncate">{loc.address}, {loc.city}, {loc.country}</span>
                 </div>
                 
                 {/* Internal Warehouse Stats */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Managed Zones</p>
                       <div className="flex items-center gap-2">
                          <Layers size={14} className="text-blue-500" />
                          <span className="text-sm font-black text-slate-900">{warehouse?.zones?.length || 0} Sectors</span>
                       </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-sm border border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Load</p>
                       <div className="flex items-center gap-2">
                          <Activity size={14} className="text-emerald-500" />
                          <span className="text-sm font-black text-slate-900">{loc.items_count.toLocaleString()} <span className="text-[10px] text-slate-400">SKUs</span></span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="p-8 pt-0 relative z-10">
                 <button 
                  onClick={() => onNavigateToZones?.(loc.id)}
                  className="w-full py-4 bg-slate-50 hover:bg-[#0052FF] text-slate-400 hover:text-white rounded-sm font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-100 hover:border-[#0052FF] group/btn shadow-sm hover:shadow-xl hover:shadow-blue-500/20 active:scale-95"
                 >
                    Manage Zone Control
                    <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Location Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/20 backdrop-blur-md z-[150] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative bg-white rounded-sm shadow-2xl w-full max-w-xl overflow-hidden animate-scale-up p-10 space-y-10">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-sm flex items-center justify-center"><MapPin size={24} /></div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">Provision Network Hub</h3>
                   <p className="text-xs font-medium text-slate-400">Initialize a new physical terminal endpoint</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-3 bg-slate-50 rounded-sm text-slate-400 hover:text-slate-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Hub Name</label>
                  <input 
                    type="text" 
                    value={newLocation.name}
                    onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                    placeholder="e.g. Westside Terminal"
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Node Code</label>
                   <input 
                    type="text" 
                    value={newLocation.location_code}
                    onChange={(e) => setNewLocation({...newLocation, location_code: e.target.value.toUpperCase()})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                    placeholder="e.g. HUB-02"
                  />
                </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Facility Type</label>
                 <select 
                    value={newLocation.type}
                    onChange={(e) => setNewLocation({...newLocation, type: e.target.value as any})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none appearance-none"
                 >
                   <option value="warehouse">Central Warehouse</option>
                   <option value="retail">Retail Distribution</option>
                   <option value="home">Satellite Office</option>
                   <option value="other">Temporary Staging</option>
                 </select>
              </div>

              <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Spatial Coordinate (Address)</label>
                  <input 
                    type="text" 
                    value={newLocation.address}
                    onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                    placeholder="Physical location address"
                  />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">City</label>
                  <input 
                    type="text" 
                    value={newLocation.city}
                    onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                  />
                </div>
                 <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Country</label>
                  <input 
                    type="text" 
                    value={newLocation.country}
                    onChange={(e) => setNewLocation({...newLocation, country: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1 py-5 bg-slate-50 text-slate-400 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Discard
              </button>
              <button 
                onClick={handleAddLocation}
                className="flex-1 py-5 bg-[#0052FF] text-white rounded-sm text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-[#0041CC] transition-all"
              >
                Confirm Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsView;
