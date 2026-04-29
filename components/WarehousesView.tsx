
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MOCK_WAREHOUSES } from '../lib/constants';
import { 
  MapPin, Box, Layers, Thermometer, Plus, Edit2, Trash2, X, Check, 
  Search, Filter, ShieldAlert, Zap, ArrowRight, Info, ChevronLeft, 
  LayoutGrid, Maximize, Activity, Sparkles, TrendingUp, BarChart3, 
  Loader2, Printer, Download, QrCode, ShieldCheck 
} from 'lucide-react';
import { StorageZone, Warehouse, StorageBin } from '../lib/types';
import { suggestBinAllocation } from '../lib/gemini';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';

// Real Barcode Generator using JsBarcode
const BarcodeReal: React.FC<{ code: string }> = ({ code }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      try {
        JsBarcode(svgRef.current, code, {
          format: "CODE128",
          width: 2,
          height: 50,
          displayValue: false,
          margin: 0,
          background: "transparent"
        });
      } catch (e) {
        console.error("Barcode generation error:", e);
      }
    }
  }, [code]);

  return (
    <div className="flex justify-center w-full bg-white p-2">
      <svg ref={svgRef} className="w-full h-12"></svg>
    </div>
  );
};

// Real QR Code Generator using QRCode library
const QrCodeReal: React.FC<{ code: string; size?: number }> = ({ code, size = 64 }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const url = await QRCode.toDataURL(code, {
          width: size * 2,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error(err);
      }
    };
    generateQR();
  }, [code, size]);

  return (
    <div className="bg-white p-1 border-2 border-black inline-block shadow-sm">
      {qrDataUrl ? (
        <img src={qrDataUrl} alt="QR Code" style={{ width: size, height: size }} />
      ) : (
        <div style={{ width: size, height: size }} className="bg-slate-100 animate-pulse" />
      )}
    </div>
  );
};

interface WarehousesViewProps {
  initialLocationId?: string;
}

const WarehousesView: React.FC<WarehousesViewProps> = ({ initialLocationId }) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>(MOCK_WAREHOUSES);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(
    initialLocationId 
      ? MOCK_WAREHOUSES.find(w => w.location_id === initialLocationId)?.id || MOCK_WAREHOUSES[0].id
      : MOCK_WAREHOUSES[0].id
  );
  
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const [isBinModalOpen, setIsBinModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<StorageZone | null>(null);
  const [editingBin, setEditingBin] = useState<StorageBin | null>(null);
  const [viewingMatrixZoneId, setViewingMatrixZoneId] = useState<string | null>(null);
  const [printTarget, setPrintTarget] = useState<{ id: string; type: 'zone' | 'bin' } | null>(null);
  
  useEffect(() => {
    if (initialLocationId) {
      const found = MOCK_WAREHOUSES.find(w => w.location_id === initialLocationId);
      if (found) setSelectedWarehouseId(found.id);
    }
  }, [initialLocationId]);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ suggestedZoneCode: string, reason: string, priority: string } | null>(null);
  const [aiItemType, setAiItemType] = useState('');

  const [zoneForm, setZoneForm] = useState<Partial<StorageZone>>({ name: '', code: '', zone_type: 'rack' });
  const [binForm, setBinForm] = useState<Partial<StorageBin>>({ code: '', max_volume: 10, current_quantity: 0, is_occupied: false });

  const selectedWarehouse = useMemo(() => warehouses.find(w => w.id === selectedWarehouseId), [warehouses, selectedWarehouseId]);
  const activeZone = useMemo(() => selectedWarehouse?.zones?.find(z => z.id === viewingMatrixZoneId), [selectedWarehouse, viewingMatrixZoneId]);

  const printObject = useMemo(() => {
    if (!printTarget || !selectedWarehouse) return null;
    if (printTarget.type === 'zone') {
      return selectedWarehouse.zones?.find(z => z.id === printTarget.id);
    } else {
      for (const zone of selectedWarehouse.zones || []) {
        const bin = zone.bins?.find(b => b.id === printTarget.id);
        if (bin) return { ...bin, zoneName: zone.name, zoneCode: zone.code };
      }
    }
    return null;
  }, [printTarget, selectedWarehouse]);

  const handleAiSlotting = async () => {
    if (!aiItemType || !selectedWarehouse) return;
    setIsAiLoading(true);
    const suggestion = await suggestBinAllocation(aiItemType, selectedWarehouse.code);
    setAiSuggestion(suggestion);
    setIsAiLoading(false);
  };

  const handlePrint = () => window.print();

  const handleOpenAddZoneModal = () => {
    setEditingZone(null);
    setZoneForm({ name: '', code: '', zone_type: 'rack' });
    setIsZoneModalOpen(true);
  };

  const handleSaveZone = () => {
    if (!zoneForm.name || !zoneForm.code) return;
    setWarehouses(prev => prev.map(wh => {
      if (wh.id !== selectedWarehouseId) return wh;
      const currentZones = wh.zones || [];
      if (editingZone) {
        return { ...wh, zones: currentZones.map(z => z.id === editingZone.id ? { ...z, ...zoneForm } as StorageZone : z) };
      } else {
        const newZone: StorageZone = { id: `zn-${Date.now()}`, name: zoneForm.name!, code: zoneForm.code!.toUpperCase(), zone_type: zoneForm.zone_type as any, bins: [] };
        return { ...wh, zones: [...currentZones, newZone] };
      }
    }));
    setIsZoneModalOpen(false);
  };

  const handleSaveBin = () => {
    if (!binForm.code || !viewingMatrixZoneId) return;
    setWarehouses(prev => prev.map(wh => {
      if (wh.id !== selectedWarehouseId) return wh;
      return {
        ...wh,
        zones: wh.zones?.map(z => {
          if (z.id !== viewingMatrixZoneId) return z;
          const currentBins = z.bins || [];
          if (editingBin) {
            return { ...z, bins: currentBins.map(b => b.id === editingBin.id ? { ...b, ...binForm } as StorageBin : b) };
          } else {
            const newBin: StorageBin = { id: `bn-${Date.now()}`, code: binForm.code!.toUpperCase(), is_occupied: !!binForm.is_occupied, current_quantity: Number(binForm.current_quantity) || 0, max_volume: Number(binForm.max_volume) || 10 };
            return { ...z, bins: [...currentBins, newBin] };
          }
        })
      };
    }));
    setIsBinModalOpen(false);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-8 animate-fade-in relative overflow-hidden">
      
      {/* Facilities Sidebar */}
      {!viewingMatrixZoneId && (
        <div className="w-1/4 flex flex-col gap-4 overflow-y-auto pr-2 no-scrollbar animate-fade-in print:hidden">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Managed Terminals</h3>
            <button className="p-1.5 text-slate-400 hover:text-[#0052FF] transition-colors"><Plus size={16}/></button>
          </div>
          {warehouses.map(wh => (
            <div 
              key={wh.id} 
              onClick={() => setSelectedWarehouseId(wh.id)}
              className={`p-6 rounded-sm border transition-all cursor-pointer group relative overflow-hidden ${
                selectedWarehouseId === wh.id ? 'bg-white border-[#0052FF] shadow-xl ring-1 ring-[#0052FF]/20' : 'bg-white/40 border-slate-100 hover:border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                  <h3 className={`font-black tracking-tight transition-colors ${selectedWarehouseId === wh.id ? 'text-[#0052FF]' : 'text-slate-800'}`}>{wh.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{wh.code}</p>
                </div>
                <div className={`p-2 rounded-sm ${selectedWarehouseId === wh.id ? 'bg-[#0052FF] text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 text-slate-400'}`}>
                  <Box size={16} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 relative z-10 text-[10px] font-black uppercase text-slate-400">
                <div>Cap: {(wh.capacity_volume / 1000).toFixed(0)}k</div>
                <div className="text-right">Sectors: {wh.zones?.length || 0}</div>
              </div>
            </div>
          ))}

          <div className="mt-4 p-6 bg-slate-950 rounded-sm text-white shadow-2xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-blue-400" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Slotting Intelligence</h4>
               </div>
               <input type="text" placeholder="Analyze item type..." value={aiItemType} onChange={(e) => setAiItemType(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-sm p-3 text-xs mb-3 outline-none focus:bg-white/10" />
               <button onClick={handleAiSlotting} disabled={isAiLoading || !aiItemType} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                  {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />} 
                  Optimize Slotting
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Panel */}
      <div className="flex-1 bg-white/70 backdrop-blur-3xl rounded-sm border border-white/60 shadow-2xl flex flex-col overflow-hidden transition-all duration-500 print:hidden">
        {!selectedWarehouse ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <Zap size={48} className="mb-4 opacity-20" />
            <p className="font-black text-xs uppercase tracking-[0.2em]">Select Hub to Configure Grid</p>
          </div>
        ) : viewingMatrixZoneId && activeZone ? (
          /* MATRIX VIEW (Bins) */
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-8 border-b border-slate-100 bg-white/40 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button onClick={() => setViewingMatrixZoneId(null)} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-sm transition-all active:scale-90"><ChevronLeft size={20} /></button>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Matrix Control: {activeZone.name}</h2>
                    <span className="px-3 py-1 bg-[#0052FF] text-white text-[9px] font-black uppercase tracking-widest rounded-sm">{activeZone.code} PROTOCOL</span>
                  </div>
                  <p className="text-sm font-medium text-slate-400">Direct spatial management of {activeZone.bins?.length || 0} bins</p>
                </div>
              </div>
              <button onClick={() => { setBinForm({ code: '', max_volume: 10, current_quantity: 0, is_occupied: false }); setEditingBin(null); setIsBinModalOpen(true); }} className="flex items-center gap-2 px-6 py-3 bg-slate-950 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#0052FF] transition-all shadow-xl"><Plus size={18} /> Provision Bin</button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6 no-scrollbar bg-slate-50/30">
              {activeZone.bins?.map(bin => (
                <div 
                  key={bin.id}
                  className={`group relative aspect-square rounded-sm border transition-all p-5 flex flex-col justify-between cursor-pointer ${
                    bin.is_occupied ? 'bg-white border-[#0052FF]/20 shadow-xl shadow-blue-500/[0.03]' : 'bg-white/40 border-slate-100 border-dashed hover:border-blue-400'
                  }`}
                  onClick={() => { setEditingBin(bin); setBinForm({ ...bin }); setIsBinModalOpen(true); }}
                >
                  <div className="flex justify-between items-start">
                    <div className={`w-3 h-3 rounded-full ${bin.is_occupied ? 'bg-[#0052FF] shadow-[0_0_10px_rgba(0,82,255,0.5)]' : 'bg-slate-200'}`}></div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button onClick={(e) => { e.stopPropagation(); setPrintTarget({ id: bin.id, type: 'bin' }); }} className="text-slate-400 hover:text-blue-500"><Printer size={12} /></button>
                        <button onClick={(e) => { e.stopPropagation(); if (confirm('Destroy this bin?')) setWarehouses(prev => prev.map(wh => wh.id === selectedWarehouseId ? { ...wh, zones: wh.zones?.map(z => z.id === viewingMatrixZoneId ? { ...z, bins: z.bins?.filter(b => b.id !== bin.id) } : z) } : wh)); }} className="text-slate-400 hover:text-red-500"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className={`font-black text-lg tracking-tighter ${bin.is_occupied ? 'text-[#0052FF]' : 'text-slate-400'}`}>{bin.code}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Bin Unit</p>
                  </div>

                  <div className="w-full bg-slate-100 h-1.5 rounded-sm overflow-hidden">
                    <div className={`h-full ${bin.is_occupied ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-slate-200'}`} style={{ width: `${Math.min(100, ((bin.current_quantity || 0) / (bin.max_volume || 1)) * 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* DASHBOARD VIEW (Zones) */
          <div className="flex flex-col h-full animate-fade-in">
            <div className="p-8 border-b border-slate-100 bg-white/40 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Sectored Hub architecture</h2>
                <p className="text-sm font-medium text-slate-400">Managing logistics grid for {selectedWarehouse.name}</p>
              </div>
              <button onClick={handleOpenAddZoneModal} className="flex items-center gap-2 px-6 py-3 bg-[#0052FF] text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#0041CC] transition-all shadow-xl shadow-blue-500/20"><Plus size={18} /> Provision Sector</button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 no-scrollbar bg-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {selectedWarehouse.zones?.map(zone => (
                  <div key={zone.id} className="group bg-white rounded-sm border border-slate-100 p-8 transition-all hover:shadow-2xl hover:-translate-y-1 flex flex-col h-72 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/[0.02] blur-40px rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                       <div className={`p-4 rounded-sm ${zone.zone_type === 'cold' ? 'bg-blue-50 text-blue-500' : zone.zone_type === 'hazardous' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'}`}>{zone.zone_type === 'cold' ? <Thermometer size={24} /> : <Layers size={24} />}</div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => setPrintTarget({ id: zone.id, type: 'zone' })} className="p-2.5 bg-blue-50 text-[#0052FF] hover:bg-blue-600 hover:text-white rounded-sm transition-all" title="Generate Label"><Printer size={16} /></button>
                          <button onClick={() => { setEditingZone(zone); setZoneForm({ ...zone }); setIsZoneModalOpen(true); }} className="p-2.5 bg-slate-50 text-slate-400 hover:text-[#0052FF] rounded-sm transition-all"><Edit2 size={16} /></button>
                          <button onClick={() => { if (confirm('Decommission zone?')) setWarehouses(prev => prev.map(wh => wh.id === selectedWarehouseId ? { ...wh, zones: wh.zones?.filter(z => z.id !== zone.id) } : wh)); }} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 rounded-sm transition-all"><Trash2 size={16} /></button>
                       </div>
                    </div>
                    <div className="flex-1 relative z-10">
                       <h4 className="text-xl font-black text-slate-900 tracking-tighter">{zone.name}</h4>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">{zone.code} SECTOR • {zone.zone_type}</p>
                    </div>
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between mt-auto relative z-10">
                      <p className="text-xl font-black text-slate-900">{zone.bins?.length || 0} <span className="text-xs text-slate-400 font-medium lowercase">bins</span></p>
                      <button onClick={() => setViewingMatrixZoneId(zone.id)} className="p-4 bg-slate-950 text-white rounded-sm hover:bg-[#0052FF] transition-all"><Maximize size={20} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ZONE/BIN MODALS */}
      {isZoneModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-fade-in print:hidden">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-md" onClick={() => setIsZoneModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-sm p-12 space-y-10 animate-scale-up shadow-2xl">
            <h3 className="text-2xl font-black">{editingZone ? 'Adjust Sector' : 'Provision Sector'}</h3>
            <div className="space-y-6">
               <input type="text" placeholder="Sector Designation" value={zoneForm.name} onChange={(e) => setZoneForm({...zoneForm, name: e.target.value})} className="w-full p-6 bg-slate-50 rounded-sm font-bold outline-none" />
               <input type="text" placeholder="Grid ID" value={zoneForm.code} onChange={(e) => setZoneForm({...zoneForm, code: e.target.value.toUpperCase()})} className="w-full p-6 bg-slate-50 rounded-sm font-bold outline-none" />
               <select value={zoneForm.zone_type} onChange={(e) => setZoneForm({...zoneForm, zone_type: e.target.value as any})} className="w-full p-6 bg-slate-50 rounded-sm font-bold outline-none">
                  <option value="rack">Rack System</option><option value="bulk">Bulk Storage</option><option value="cold">Cold Storage</option>
               </select>
            </div>
            <div className="flex gap-4 pt-4">
               <button onClick={() => setIsZoneModalOpen(false)} className="flex-1 py-5 bg-slate-50 rounded-sm text-[10px] font-black uppercase">Cancel</button>
               <button onClick={handleSaveZone} className="flex-1 py-5 bg-[#0052FF] text-white rounded-sm text-[10px] font-black uppercase shadow-xl shadow-blue-500/20">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {isBinModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-fade-in print:hidden">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-md" onClick={() => setIsBinModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-sm p-12 space-y-10 animate-scale-up shadow-2xl">
            <h3 className="text-2xl font-black">{editingBin ? 'Adjust Matrix Unit' : 'Initialize Bin Unit'}</h3>
            <div className="space-y-6">
               <input type="text" placeholder="Coordinate ID" value={binForm.code} onChange={(e) => setBinForm({...binForm, code: e.target.value.toUpperCase()})} className="w-full p-6 bg-slate-50 rounded-sm font-bold outline-none" />
               <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Load" value={binForm.current_quantity} onChange={(e) => setBinForm({...binForm, current_quantity: Number(e.target.value)})} className="w-full p-6 bg-slate-50 rounded-sm font-bold outline-none" />
                  <input type="number" placeholder="Limit" value={binForm.max_volume} onChange={(e) => setBinForm({...binForm, max_volume: Number(e.target.value)})} className="w-full p-6 bg-slate-50 rounded-sm font-bold outline-none" />
               </div>
               <label className="flex items-center gap-4 p-6 bg-slate-50 rounded-sm cursor-pointer">
                  <input type="checkbox" checked={binForm.is_occupied} onChange={(e) => setBinForm({...binForm, is_occupied: e.target.checked})} className="w-6 h-6 rounded-sm text-[#0052FF]" />
                  <span className="text-xs font-black uppercase tracking-widest text-slate-700">Active Storage</span>
               </label>
            </div>
            <div className="flex gap-4 pt-4">
               <button onClick={() => setIsBinModalOpen(false)} className="flex-1 py-5 bg-slate-50 rounded-sm text-[10px] font-black uppercase">Discard</button>
               <button onClick={handleSaveBin} className="flex-1 py-5 bg-[#0052FF] text-white rounded-sm text-[10px] font-black uppercase shadow-xl shadow-blue-500/20">Commit</button>
            </div>
          </div>
        </div>
      )}

      {/* UNIFIED PRINT LABEL MODAL */}
      {printTarget && printObject && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl print:bg-white print:p-0 print:static print:inset-auto">
          <div className="absolute inset-0 print:hidden" onClick={() => setPrintTarget(null)}></div>
          
          <div className="relative w-full max-w-2xl animate-scale-up print:shadow-none print:w-full print:max-w-none">
            <div className="mb-6 flex justify-between items-center print:hidden text-white">
              <div className="flex items-center gap-3">
                <Printer size={20} className="text-blue-400" />
                <span className="text-[10px] font-black uppercase tracking-widest">{printTarget.type.toUpperCase()} Protocol Label</span>
              </div>
              <div className="flex gap-3">
                 <button onClick={handlePrint} className="px-6 py-3 bg-blue-600 text-white rounded-sm font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">
                   <Download size={16} /> Execute Print
                 </button>
                 <button onClick={() => setPrintTarget(null)} className="p-3 bg-white/10 text-white rounded-sm hover:bg-white/20 transition-all"><X size={20} /></button>
              </div>
            </div>

            <div 
              id="print-label"
              className="bg-white text-black p-10 aspect-[4/3] rounded-sm border-[4px] border-black flex flex-col justify-between shadow-2xl print:border-none print:shadow-none print:w-[10cm] print:h-[15cm] print:p-8 mx-auto"
            >
              <div className="flex justify-between items-start border-b-[2px] border-black pb-4">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-none">Facility Node</p>
                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">{selectedWarehouse?.name}</h2>
                    <p className="text-[10px] font-bold opacity-60 uppercase">{selectedWarehouse?.code} // HUB-LEVEL</p>
                 </div>
                 <div className="text-right flex flex-col items-end gap-2">
                    <div className="bg-black text-white px-3 py-1 text-[12px] font-black uppercase tracking-[0.3em]">NexusAI</div>
                    <QrCodeReal code={`${selectedWarehouse?.code}-${(printObject as any).code}`} size={48} />
                 </div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center py-6">
                 {printTarget.type === 'bin' && (
                    <p className="text-xs font-black uppercase tracking-[0.3em] mb-2 text-slate-400">Sector: {(printObject as any).zoneCode} // {(printObject as any).zoneName}</p>
                 )}
                 <h1 className="text-[100px] font-black leading-none tracking-[-0.05em] uppercase border-b-[6px] border-black pb-1 mb-2">
                   {(printObject as any).code}
                 </h1>
                 <p className="text-xl font-bold uppercase tracking-[0.4em]">{(printObject as any).name || 'Storage Unit'}</p>
              </div>

              <div className="space-y-4 border-t-2 border-black pt-4">
                 <div className="flex justify-between items-center gap-6">
                    <div className="flex-1 overflow-hidden">
                       <BarcodeReal code={(printObject as any).code} />
                    </div>
                    <div className="text-right shrink-0">
                       <p className="text-[8px] font-black uppercase tracking-widest leading-none mb-1">Audit Trace</p>
                       <p className="text-[12px] font-black uppercase font-mono">{(printObject as any).id.slice(-8).toUpperCase()}</p>
                    </div>
                 </div>
                 <div className="flex justify-between items-end">
                    <div className="text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5">
                       <ShieldCheck size={10} fill="black" className="text-white" /> Security Integrity Protocol v5.1
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-widest italic opacity-40">Generated by Nexus Intelligence Core</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Print Styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-label, #print-label * { visibility: visible; }
          #print-label { position: absolute; left: 0; top: 0; width: 100% !important; height: auto !important; border: none !important; margin: 0 !important; padding: 40px !important; }
          @page { size: 4in 6in; margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default WarehousesView;
