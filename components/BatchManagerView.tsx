
import React, { useState, useMemo } from 'react';
import { 
  Layers, Search, Filter, Plus, Calendar, AlertTriangle, CheckCircle, 
  Clock, MoreVertical, ShieldAlert, MapPin, Box, ArrowRight, X, Check,
  Sparkles, TrendingUp, Info, Activity, Trash2, Edit2, QrCode
} from 'lucide-react';
import { MOCK_BATCHES, MOCK_ITEMS, MOCK_LOCATIONS, MOCK_WAREHOUSES } from '../lib/constants';
import { Batch, Item, Location } from '../lib/types';

const BatchManagerView: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>(MOCK_BATCHES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Batch>>({
    batch_number: '',
    item_id: '',
    initial_quantity: 0,
    current_quantity: 0,
    production_date: new Date().toISOString().split('T')[0],
    expiry_date: '',
    status: 'active',
    location_id: MOCK_LOCATIONS[0].id
  });

  const filteredBatches = batches.filter(b => 
    b.batch_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyles = (status: string, expiryDate: string) => {
    const isExpiringSoon = new Date(expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000;
    
    if (status === 'expired') return 'bg-red-50 text-red-600 border-red-100';
    if (status === 'quarantine') return 'bg-amber-50 text-amber-600 border-amber-100';
    if (isExpiringSoon && status !== 'expired') return 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse';
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  const getLocationName = (id: string) => MOCK_LOCATIONS.find(l => l.id === id)?.name || 'Unknown';

  const handleOpenModal = (batch?: Batch) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData(batch);
    } else {
      setEditingBatch(null);
      setFormData({
        batch_number: `LOT-${Date.now().toString().slice(-6)}`,
        item_id: '',
        initial_quantity: 100,
        current_quantity: 100,
        production_date: new Date().toISOString().split('T')[0],
        expiry_date: '',
        status: 'active',
        location_id: MOCK_LOCATIONS[0].id
      });
    }
    setIsAddModalOpen(true);
  };

  const handleSaveBatch = () => {
    if (!formData.item_id || !formData.batch_number) return;
    
    const selectedItem = MOCK_ITEMS.find(i => i.id === formData.item_id);
    
    if (editingBatch) {
      setBatches(prev => prev.map(b => b.id === editingBatch.id ? { ...b, ...formData, item_name: selectedItem?.title || b.item_name } as Batch : b));
    } else {
      const newBatch: Batch = {
        ...formData as Batch,
        id: `bat-${Date.now()}`,
        item_name: selectedItem?.title || 'Unknown Item'
      };
      setBatches([newBatch, ...batches]);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-140px)] animate-fade-in overflow-hidden">
      
      {/* Integrated Analytics Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-sm border border-slate-100 shadow-sm group hover:border-blue-200 transition-all">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-blue-50 text-blue-600 rounded-sm group-hover:scale-110 transition-transform">
                <Layers size={20} />
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Lots</span>
           </div>
           <p className="text-3xl font-black text-slate-900 tracking-tighter">{batches.length}</p>
           <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              <TrendingUp size={12}/> +2 Syncing
           </div>
        </div>
        
        <div className="bg-white p-8 rounded-sm border border-slate-100 shadow-sm group hover:border-amber-200 transition-all">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-amber-50 text-amber-600 rounded-sm group-hover:scale-110 transition-transform">
                <ShieldAlert size={20} />
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Isolation</span>
           </div>
           <p className="text-3xl font-black text-slate-900 tracking-tighter">
              {batches.filter(b => b.status === 'quarantine').length}
           </p>
           <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Pending Lab Results
           </div>
        </div>

        <div className="bg-white p-8 rounded-sm border border-slate-100 shadow-sm group hover:border-orange-200 transition-all">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 bg-orange-50 text-orange-600 rounded-sm group-hover:scale-110 transition-transform">
                <Clock size={20} />
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shelf-Life Risk</span>
           </div>
           <p className="text-3xl font-black text-slate-900 tracking-tighter">1</p>
           <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-orange-500 uppercase tracking-widest">
              Expiry Alert Level: High
           </div>
        </div>

        <div className="bg-slate-950 p-8 rounded-sm text-white shadow-2xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Batch Integrity</h4>
                  <p className="text-2xl font-black">98.4% <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Secure</span></p>
               </div>
               <button onClick={() => handleOpenModal()} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-sm font-black text-[10px] uppercase tracking-widest transition-all mt-4">
                  Provision Lot
               </button>
            </div>
        </div>
      </div>

      {/* Main Ledger Container */}
      <div className="bg-white/60 backdrop-blur-3xl rounded-sm border border-white/60 shadow-2xl flex flex-col flex-1 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                 <Layers size={32} className="text-blue-600" />
                 Lot & Batch Control
              </h2>
              <p className="text-sm font-medium text-slate-400">Managing physical lot serialization and perishable lifecycle sync</p>
           </div>
           
           <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search lot ID or asset..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-sm text-xs font-bold outline-none focus:ring-8 focus:ring-blue-500/5 transition-all shadow-sm"
                />
              </div>
              <button className="p-4 bg-slate-50 text-slate-400 border border-slate-100 rounded-sm hover:text-blue-600 transition-all">
                 <Filter size={20} />
              </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
           <table className="w-full text-left border-separate border-spacing-0">
              <thead className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-100 backdrop-blur-md">
                 <tr>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Serialization</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Asset</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Spatial Node</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Load Status</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Shelf Life</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {filteredBatches.map(batch => (
                    <tr key={batch.id} className="hover:bg-white group transition-all">
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-sm bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                <QrCode size={20} />
                             </div>
                             <div>
                                <p className="font-black text-slate-900 text-sm tracking-tight font-mono">{batch.batch_number}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">LOT IDENTIFIER</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <p className="text-sm font-black text-slate-800 tracking-tight truncate max-w-[180px] group-hover:text-blue-600 transition-colors">{batch.item_name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">ID: {batch.item_id}</p>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-2 text-slate-500">
                             <MapPin size={14} className="text-blue-500" />
                             <span className="text-[11px] font-black tracking-tight">{getLocationName(batch.location_id)}</span>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex items-center gap-3">
                             <div className="flex flex-col">
                                <span className="text-sm font-black text-slate-900">{batch.current_quantity}</span>
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Of {batch.initial_quantity}</span>
                             </div>
                             <div className="w-20 bg-slate-100 h-1.5 rounded-sm overflow-hidden shrink-0">
                                <div 
                                   className="bg-blue-500 h-full transition-all duration-1000" 
                                   style={{ width: `${(batch.current_quantity / batch.initial_quantity) * 100}%` }}
                                ></div>
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <div className="flex flex-col gap-1.5">
                             <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                <Calendar size={12} /> {batch.production_date}
                             </div>
                             <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                               new Date(batch.expiry_date) < new Date() ? 'text-red-500' : 'text-slate-900'
                             }`}>
                                <Clock size={12} /> {batch.expiry_date}
                             </div>
                          </div>
                       </td>
                       <td className="px-10 py-8">
                          <span className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest border transition-all ${getStatusStyles(batch.status, batch.expiry_date)}`}>
                             {batch.status}
                          </span>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                             <button onClick={() => handleOpenModal(batch)} className="p-3 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-sm transition-all"><Edit2 size={16} /></button>
                             <button className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-all"><Trash2 size={16} /></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
           {filteredBatches.length === 0 && (
              <div className="py-40 text-center flex flex-col items-center">
                 <div className="w-24 h-24 bg-slate-50 rounded-sm flex items-center justify-center mb-6">
                    <Layers size={48} className="text-slate-200" strokeWidth={1} />
                 </div>
                 <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">No serialized lots detected in grid</p>
                 <button onClick={() => setSearchTerm('')} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-sm font-black text-[10px] uppercase tracking-widest shadow-xl">Reset Neural Index</button>
              </div>
           )}
        </div>
      </div>

      {/* MODAL: LOT PROVISIONING */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative w-full max-w-4xl bg-white rounded-sm border border-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-up">
            
            <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-sm flex items-center justify-center shadow-2xl shadow-blue-500/20"><Layers size={28} /></div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{editingBatch ? 'Adjust Lot Record' : 'Provision New Lot'}</h3>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Secure Serialization Registry</p>
                  </div>
               </div>
               <button onClick={() => setIsAddModalOpen(false)} className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-sm transition-all shadow-sm"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
               <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Target Asset System</label>
                     <select 
                       value={formData.item_id}
                       onChange={e => setFormData({...formData, item_id: e.target.value})}
                       className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none appearance-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                     >
                        <option value="">Select Asset Mapping...</option>
                        {MOCK_ITEMS.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
                     </select>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Lot Serialization ID</label>
                     <input 
                       type="text" 
                       value={formData.batch_number}
                       onChange={e => setFormData({...formData, batch_number: e.target.value.toUpperCase()})}
                       className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none uppercase font-mono focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                       placeholder="e.g. LOT-2024-X"
                     />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Load Capacity</label>
                        <input 
                          type="number" 
                          value={formData.initial_quantity}
                          onChange={e => setFormData({...formData, initial_quantity: Number(e.target.value), current_quantity: Number(e.target.value)})}
                          className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                        />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Grid Status</label>
                        <select 
                          value={formData.status}
                          onChange={e => setFormData({...formData, status: e.target.value as any})}
                          className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all appearance-none"
                        >
                          <option value="active">Operational</option>
                          <option value="quarantine">Isolation</option>
                          <option value="expired">Expired / End-of-Life</option>
                        </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Spatial Distribution Node</label>
                     <select 
                        value={formData.location_id}
                        onChange={e => setFormData({...formData, location_id: e.target.value})}
                        className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none appearance-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                     >
                        {MOCK_LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                     </select>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Production Origin Date</label>
                     <input 
                       type="date" 
                       value={formData.production_date}
                       onChange={e => setFormData({...formData, production_date: e.target.value})}
                       className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                     />
                  </div>

                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Lifecycle Expiry Vector</label>
                     <input 
                       type="date" 
                       value={formData.expiry_date}
                       onChange={e => setFormData({...formData, expiry_date: e.target.value})}
                       className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                     />
                  </div>
               </div>

               {/* AI SHELF LIFE ASSISTANCE */}
               <div className="bg-slate-950 p-8 rounded-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  <div className="relative z-10 flex items-start gap-6">
                     <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center shrink-0 border border-white/10">
                        <Sparkles size={24} className="text-blue-400" />
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-2">Nexus Predictive Expiry</h4>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">System detects this asset type may benefit from <span className="text-blue-400 font-black">FIFO (First-In, First-Out)</span> protocol. Neural core suggests end-of-life marking at 12-months post production.</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-10 border-t border-slate-100 flex justify-end gap-6 bg-slate-50/30">
               <button onClick={() => setIsAddModalOpen(false)} className="px-10 py-5 text-slate-400 font-black text-[11px] uppercase tracking-[0.3em] hover:bg-slate-200 rounded-sm transition-all">Discard Protocol</button>
               <button 
                  onClick={handleSaveBatch}
                  className="px-12 py-5 bg-[#0052FF] text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-sm hover:bg-[#0041CC] transition-all flex items-center gap-4 shadow-2xl shadow-blue-500/20 active:scale-95"
               >
                  <Check size={22} /> Commit Registry
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchManagerView;
