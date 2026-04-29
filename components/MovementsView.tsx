
import React, { useState, useMemo } from 'react';
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Repeat, 
  Search, 
  Plus, 
  Calendar, 
  User, 
  X, 
  Check, 
  MapPin, 
  Layers, 
  Zap, 
  ShieldAlert, 
  Activity, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  Box,
  QrCode
} from 'lucide-react';
import { MOCK_MOVEMENTS, MOCK_ITEMS, MOCK_LOCATIONS, MOCK_WAREHOUSES, MOCK_BATCHES } from '../lib/constants';
import { InventoryMovement, Item, Location, StorageZone, Batch } from '../lib/types';
import { analyzeMovementRisk } from '../lib/gemini';

const MovementsView: React.FC = () => {
  // Fix: Directly use MOCK_MOVEMENTS as it now adheres to the InventoryMovement interface
  const [movements, setMovements] = useState<InventoryMovement[]>(MOCK_MOVEMENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAiValidating, setIsAiValidating] = useState(false);
  const [aiRisk, setAiRisk] = useState<{ riskScore: number; riskLevel: string; reason: string; suggestion: string } | null>(null);

  // Form State
  const [newMovement, setNewMovement] = useState<Partial<InventoryMovement>>({
    item_id: '',
    batch_id: '',
    movement_type: 'transfer',
    quantity: 1,
    from_location_id: '',
    from_zone_id: '',
    to_location_id: '',
    to_zone_id: '',
    notes: '',
    user: 'Alex Manager'
  });

  const selectedItem = useMemo(() => 
    MOCK_ITEMS.find(i => i.id === newMovement.item_id), 
    [newMovement.item_id]
  );

  const availableBatches = useMemo(() => 
    MOCK_BATCHES.filter(b => b.item_id === newMovement.item_id),
    [newMovement.item_id]
  );

  const fromLocationZones = useMemo(() => {
    const wh = MOCK_WAREHOUSES.find(w => w.location_id === newMovement.from_location_id);
    return wh?.zones || [];
  }, [newMovement.from_location_id]);

  const toLocationZones = useMemo(() => {
    const wh = MOCK_WAREHOUSES.find(w => w.location_id === newMovement.to_location_id);
    return wh?.zones || [];
  }, [newMovement.to_location_id]);

  const handleValidateMovement = async () => {
    if (!selectedItem || !newMovement.from_zone_id || !newMovement.to_zone_id) return;
    
    setIsAiValidating(true);
    const fromZone = fromLocationZones.find(z => z.id === newMovement.from_zone_id)?.name || 'Unknown';
    const toZone = toLocationZones.find(z => z.id === newMovement.to_zone_id)?.name || 'Unknown';
    
    const risk = await analyzeMovementRisk(selectedItem.title, fromZone, toZone);
    setAiRisk(risk);
    setIsAiValidating(false);
  };

  const handleCreateMovement = () => {
     if (!newMovement.item_id || (newMovement.quantity || 0) <= 0) return;

     const movement: InventoryMovement = {
         id: `mov-${Date.now()}`,
         item_id: selectedItem!.id,
         item_name: selectedItem!.title,
         batch_id: newMovement.batch_id,
         movement_type: newMovement.movement_type as any,
         quantity: newMovement.quantity!,
         from_location_id: newMovement.from_location_id,
         from_zone_id: newMovement.from_zone_id,
         to_location_id: newMovement.to_location_id,
         to_zone_id: newMovement.to_zone_id,
         movement_date: new Date().toISOString(),
         user: newMovement.user,
         notes: newMovement.notes,
         status: 'completed'
     };

     setMovements([movement, ...movements]);
     setIsModalOpen(false);
     setNewMovement({ item_id: '', batch_id: '', movement_type: 'transfer', quantity: 1, user: 'Alex Manager' });
     setAiRisk(null);
  };

  const getMovementIcon = (type: string) => {
      switch(type) {
          case 'in': return <ArrowDownLeft size={20} className="text-emerald-500" />;
          case 'out': return <ArrowUpRight size={20} className="text-rose-500" />;
          case 'transfer': return <Repeat size={20} className="text-blue-500" />;
          default: return <Activity size={20} className="text-slate-500" />;
      }
  };

  const getLocationName = (id?: string) => MOCK_LOCATIONS.find(l => l.id === id)?.name || 'System';
  const getZoneName = (zoneId?: string) => {
    for (const wh of MOCK_WAREHOUSES) {
      const zone = wh.zones?.find(z => z.id === zoneId);
      if (zone) return zone.name;
    }
    return 'N/A';
  };
  const getBatchNumber = (id?: string) => MOCK_BATCHES.find(b => b.id === id)?.batch_number || null;

  const filteredMovements = movements.filter(m => 
    m.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.user?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-140px)] animate-fade-in overflow-hidden">
      
      {/* Dynamic Statistics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Cycles</p>
           <h3 className="text-2xl font-black text-slate-950">{movements.length} <span className="text-xs text-slate-400 font-bold">24h</span></h3>
        </div>
        <div className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
           <h3 className="text-2xl font-black text-emerald-500">98.2%</h3>
        </div>
        <div className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Throughput</p>
           <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-500" />
              <h3 className="text-2xl font-black text-slate-950">High</h3>
           </div>
        </div>
        <div className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Protocol Status</p>
           <h3 className="text-2xl font-black text-blue-600">Secure</h3>
        </div>
      </div>

      {/* Main Movement Log */}
      <div className="bg-white/60 backdrop-blur-3xl rounded-sm border border-white/60 shadow-2xl flex flex-col flex-1 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Neural Flow Ledger</h2>
            <p className="text-sm font-medium text-slate-400">Chronological spatial audit of all asset migrations</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Locate movement record..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-sm text-xs font-bold outline-none focus:ring-8 focus:ring-blue-500/5 transition-all w-80 shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#0052FF] transition-all shadow-xl active:scale-95"
            >
              <Plus size={20} /> Provision Transfer
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10">
          <div className="space-y-6">
             {filteredMovements.map((mov) => (
               <div key={mov.id} className="group flex items-center gap-8 p-8 bg-white rounded-sm border border-slate-50 hover:border-blue-200 hover:shadow-2xl transition-all relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.02] blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  
                  {/* Icon & Type */}
                  <div className={`w-16 h-16 rounded-sm flex items-center justify-center shrink-0 shadow-lg ${
                    mov.movement_type === 'in' ? 'bg-emerald-50 text-emerald-600 shadow-emerald-500/10' :
                    mov.movement_type === 'out' ? 'bg-rose-50 text-rose-600 shadow-rose-500/10' : 'bg-blue-50 text-blue-600 shadow-blue-500/10'
                  }`}>
                    {getMovementIcon(mov.movement_type)}
                  </div>

                  {/* Asset Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-black text-slate-900 text-lg tracking-tight truncate group-hover:text-blue-600 transition-colors">{mov.item_name}</h4>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-sm leading-none">{mov.movement_type}</span>
                      {mov.batch_id && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded-sm border border-blue-100">
                           <QrCode size={10} /> {getBatchNumber(mov.batch_id)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <div className="flex items-center gap-1.5"><Calendar size={12}/> {new Date(mov.movement_date).toLocaleDateString()}</div>
                       <div className="flex items-center gap-1.5"><User size={12}/> {mov.user}</div>
                    </div>
                  </div>

                  {/* Spatial Flow */}
                  <div className="hidden lg:flex items-center gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Origin</p>
                      <div className="px-4 py-2 bg-slate-50 rounded-sm border border-slate-100 text-[10px] font-bold text-slate-600">
                        {getZoneName(mov.from_zone_id)}
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-slate-300 mt-4" />
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Destination</p>
                      <div className="px-4 py-2 bg-blue-50 rounded-sm border border-blue-100 text-[10px] font-black text-blue-600">
                        {getZoneName(mov.to_zone_id)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="text-right pl-8">
                     <p className={`text-2xl font-black ${
                       mov.movement_type === 'out' ? 'text-rose-500' : 'text-emerald-500'
                     }`}>
                       {mov.movement_type === 'out' ? '-' : '+'}{Math.abs(mov.quantity)}
                     </p>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Units Transferred</p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* MODAL: NEW MOVEMENT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-sm border border-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
            
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-sm flex items-center justify-center shadow-2xl shadow-blue-500/20"><Repeat size={28} /></div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Provision Migration Protocol</h3>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Spatial Asset Transfer Interface</p>
                  </div>
               </div>
               <button onClick={() => setIsModalOpen(false)} className="p-4 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 rounded-sm transition-all shadow-sm"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
               <div className="grid grid-cols-2 gap-10">
                  {/* Asset Selection */}
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Select Target Asset</label>
                     <select 
                      value={newMovement.item_id}
                      onChange={(e) => setNewMovement({...newMovement, item_id: e.target.value, batch_id: ''})}
                      className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none appearance-none cursor-pointer focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                     >
                        <option value="">Select SKU...</option>
                        {MOCK_ITEMS.map(i => <option key={i.id} value={i.id}>{i.title} (Stock: {i.available_quantity})</option>)}
                     </select>
                  </div>

                  {/* Batch Selection */}
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Select Target Batch / Lot</label>
                     <select 
                      value={newMovement.batch_id}
                      onChange={(e) => setNewMovement({...newMovement, batch_id: e.target.value})}
                      disabled={!newMovement.item_id}
                      className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none appearance-none cursor-pointer focus:ring-8 focus:ring-blue-500/[0.03] transition-all disabled:opacity-40"
                     >
                        <option value="">All Batches (Standard)</option>
                        {availableBatches.map(b => <option key={b.id} value={b.id}>{b.batch_number} (Qty: {b.current_quantity})</option>)}
                     </select>
                  </div>

                  {/* Origin Panel */}
                  <div className="bg-slate-50/50 p-8 rounded-sm border border-slate-100 space-y-6">
                     <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <MapPin size={14} className="text-slate-400" /> Source Origin
                     </h4>
                     <div className="space-y-4">
                        <select 
                          value={newMovement.from_location_id}
                          onChange={(e) => setNewMovement({...newMovement, from_location_id: e.target.value, from_zone_id: ''})}
                          className="w-full p-5 bg-white border-none rounded-sm font-bold text-xs outline-none"
                        >
                          <option value="">Hub Node...</option>
                          {MOCK_LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                        <select 
                          value={newMovement.from_zone_id}
                          onChange={(e) => setNewMovement({...newMovement, from_zone_id: e.target.value})}
                          className="w-full p-5 bg-white border-none rounded-sm font-bold text-xs outline-none disabled:opacity-40"
                          disabled={!newMovement.from_location_id}
                        >
                          <option value="">Sector...</option>
                          {fromLocationZones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                        </select>
                     </div>
                  </div>

                  {/* Destination Panel */}
                  <div className="bg-blue-50/30 p-8 rounded-sm border border-blue-100 space-y-6">
                     <h4 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                       <ArrowRight size={14} className="text-blue-600" /> Targeted Destination
                     </h4>
                     <div className="space-y-4">
                        <select 
                          value={newMovement.to_location_id}
                          onChange={(e) => setNewMovement({...newMovement, to_location_id: e.target.value, to_zone_id: ''})}
                          className="w-full p-5 bg-white border-none rounded-sm font-bold text-xs outline-none"
                        >
                          <option value="">Hub Node...</option>
                          {MOCK_LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                        <select 
                          value={newMovement.to_zone_id}
                          onChange={(e) => setNewMovement({...newMovement, to_zone_id: e.target.value})}
                          className="w-full p-5 bg-white border-none rounded-sm font-bold text-xs outline-none disabled:opacity-40"
                          disabled={!newMovement.to_location_id}
                        >
                          <option value="">Sector...</option>
                          {toLocationZones.map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                        </select>
                     </div>
                  </div>
               </div>

               {/* AI RISK ANALYSIS WIDGET */}
               <div className="bg-slate-950 p-10 rounded-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  <div className="relative z-10">
                     <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                           <Zap size={24} className="text-blue-400" />
                           <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">Nexus AI Movement Validation</h4>
                        </div>
                        <button 
                          onClick={handleValidateMovement}
                          disabled={isAiValidating || !newMovement.from_zone_id || !newMovement.to_zone_id}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
                        >
                          {isAiValidating ? <Loader2 size={16} className="animate-spin" /> : 'Run Neural Audit'}
                        </button>
                     </div>

                     {aiRisk ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                           <div className="md:col-span-1 p-6 bg-white/5 rounded-sm border border-white/10 flex flex-col items-center justify-center text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Protocol Risk</p>
                              <div className={`text-4xl font-black mb-1 ${
                                aiRisk.riskLevel === 'high' ? 'text-rose-500' : aiRisk.riskLevel === 'medium' ? 'text-amber-500' : 'text-emerald-500'
                              }`}>{aiRisk.riskScore}%</div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{aiRisk.riskLevel} Hazard</p>
                           </div>
                           <div className="md:col-span-2 space-y-4">
                              <div className="flex items-start gap-4">
                                 <ShieldAlert size={20} className="text-blue-400 shrink-0 mt-1" />
                                 <p className="text-sm text-slate-300 leading-relaxed font-medium">{aiRisk.reason}</p>
                              </div>
                              <div className="flex items-start gap-4">
                                 <Activity size={20} className="text-emerald-400 shrink-0 mt-1" />
                                 <p className="text-sm text-emerald-400 leading-relaxed font-bold">{aiRisk.suggestion}</p>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <p className="text-xs text-slate-500 text-center py-4 border border-dashed border-white/10 rounded-sm italic">Select source and destination sectors to initiate AI-powered movement audit.</p>
                     )}
                  </div>
               </div>
            </div>

            <div className="p-10 border-t border-slate-100 flex justify-end gap-6 bg-slate-50/30">
               <button onClick={() => setIsModalOpen(false)} className="px-10 py-5 text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-slate-200 rounded-sm transition-all">Abort Protocol</button>
               <button 
                  onClick={handleCreateMovement}
                  className="px-12 py-5 bg-[#0052FF] text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-sm hover:bg-[#0041CC] transition-all flex items-center gap-4 shadow-2xl shadow-blue-500/20 active:scale-95 group"
               >
                  <Check size={22} className="group-hover:scale-110 transition-transform" /> Commit Migration
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementsView;
