
import React, { useState, useEffect } from 'react';
import { X, Camera, Loader2, Image as ImageIcon, Check, MapPin, Layers, DollarSign, Info, Sparkles, Edit2, Plus, BrainCircuit, Trash2, Cpu, Zap, RefreshCw } from 'lucide-react';
import { autoIdentifyItem, generateAiSku } from '../lib/gemini';
import { MOCK_LOCATIONS, MOCK_WAREHOUSES, MOCK_CATEGORIES } from '../lib/constants';
import { Item, Location, StorageZone } from '../lib/types';

interface Characteristic {
  label: string;
  value: string;
}

interface AddItemModalProps {
  onClose: () => void;
  editItem?: Item;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, editItem }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingSku, setIsGeneratingSku] = useState(false);
  const [useAiAssist, setUseAiAssist] = useState(true);
  const [useAiSku, setUseAiSku] = useState(true);
  const [includeCharacteristics, setIncludeCharacteristics] = useState(true);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Item>>({
    title: '',
    category_id: 2,
    price: 0,
    condition: 'new',
    quantity: 1,
    available_quantity: 1,
    reserved_quantity: 0,
    description: '',
    inventory_number: `SKU-${Date.now().toString().slice(-6)}`,
    location_id: MOCK_LOCATIONS[0].id,
    zone_id: '',
    status: 'active',
    requires_moderation: false
  });

  // Pre-fill if editing
  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
      setImagePreview(editItem.image_url || null);
    }
  }, [editItem]);

  // Derived Zones for selected location
  const availableZones = React.useMemo(() => {
    const warehouse = MOCK_WAREHOUSES.find(w => w.location_id === formData.location_id);
    return warehouse?.zones || [];
  }, [formData.location_id]);

  const handleGenerateSku = async () => {
    if (!formData.title) return;
    setIsGeneratingSku(true);
    try {
      const categoryName = MOCK_CATEGORIES.find(c => c.id === formData.category_id)?.name || 'General';
      const newSku = await generateAiSku(formData.title, categoryName, characteristics);
      setFormData(prev => ({ ...prev, inventory_number: newSku }));
    } catch (error) {
      console.error("SKU Gen Error:", error);
    } finally {
      setIsGeneratingSku(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);

        if (useAiAssist) {
            setIsAnalyzing(true);
            const base64Data = base64String.split(',')[1];

            try {
                const analysis = await autoIdentifyItem(base64Data, includeCharacteristics);
                
                setFormData(prev => ({
                    ...prev,
                    title: analysis.title || prev.title,
                    category_id: analysis.category_id || prev.category_id,
                    price: analysis.suggested_price || prev.price,
                    condition: analysis.condition || prev.condition,
                    description: analysis.description || prev.description,
                    inventory_number: useAiSku ? (analysis.suggested_sku || prev.inventory_number) : prev.inventory_number
                }));

                if (includeCharacteristics && analysis.characteristics) {
                    setCharacteristics(analysis.characteristics);
                } else if (!includeCharacteristics) {
                    setCharacteristics([]);
                }
            } catch (error) {
                console.error("Analysis Error:", error);
            } finally {
                setIsAnalyzing(false);
            }
        }
    };
    reader.readAsDataURL(file);
  };

  const addCharacteristic = () => {
    setCharacteristics([...characteristics, { label: '', value: '' }]);
  };

  const updateCharacteristic = (index: number, field: keyof Characteristic, val: string) => {
    const newChars = [...characteristics];
    newChars[index][field] = val;
    setCharacteristics(newChars);
  };

  const removeCharacteristic = (index: number) => {
    setCharacteristics(characteristics.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xl z-[200] flex items-center justify-center p-4 md:p-6 animate-fade-in">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col animate-scale-up border border-white/20">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 gap-4">
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 bg-blue-600 text-white rounded-sm flex items-center justify-center shadow-xl shadow-blue-500/20 shrink-0">
                {editItem ? <Edit2 size={24} /> : <Plus size={28} />}
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{editItem ? 'Asset Recalibration' : 'Smart SKU Intake'}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Secure Hub Node RU-Moscow-01</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100/80 p-1.5 rounded-sm border border-slate-200/50">
                <button 
                  onClick={() => setUseAiAssist(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${useAiAssist ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   <BrainCircuit size={14} /> AI On
                </button>
                <button 
                  onClick={() => setUseAiAssist(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${!useAiAssist ? 'bg-white text-slate-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                   Manual
                </button>
            </div>

            <button onClick={onClose} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 rounded-sm transition-all shadow-sm">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50/30">
          <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left Section: Image & Vision Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <div className={`relative aspect-square rounded-sm border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center group ${isAnalyzing ? 'bg-blue-50/50 border-blue-300' : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'}`}>
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center text-center p-8 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[scan_2s_infinite]"></div>
                            <div className="w-20 h-20 bg-blue-100/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                              <BrainCircuit size={40} className="text-blue-600" />
                            </div>
                            <p className="text-sm font-black text-blue-700 uppercase tracking-widest">Neural Scan Active</p>
                            <p className="text-[10px] text-blue-400 mt-2 font-bold uppercase tracking-widest">Extracting physical metadata...</p>
                        </div>
                    ) : (
                       <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-4">
                           <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                           {imagePreview ? (
                               <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                           ) : (
                               <>
                                <div className="w-16 h-16 bg-blue-50 rounded-sm flex items-center justify-center text-blue-600 shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                    <Camera size={28} />
                                </div>
                                <p className="text-xs font-black text-slate-700 uppercase tracking-widest text-center px-4">Upload Asset Visuals</p>
                                <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Supports AI Auto-Fill</p>
                               </>
                           )}
                           {imagePreview && (
                              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
                                 <div className="bg-white px-5 py-2.5 rounded-sm font-black text-[9px] uppercase tracking-widest text-slate-900 shadow-2xl">Change Image</div>
                              </div>
                           )}
                       </label>
                    )}
                </div>
              </div>

              {useAiAssist && (
                <div className="bg-white p-6 rounded-sm border border-slate-100 shadow-sm space-y-6">
                   <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <Zap size={16} className="text-amber-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">Technical Analysis</span>
                         </div>
                         <button 
                           onClick={() => setIncludeCharacteristics(!includeCharacteristics)}
                           className={`w-10 h-5 rounded-full relative transition-colors ${includeCharacteristics ? 'bg-blue-600' : 'bg-slate-200'}`}
                         >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${includeCharacteristics ? 'left-6' : 'left-1'}`}></div>
                         </button>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Extract precise technical specs from visual data.</p>
                   </div>

                   <div className="space-y-4 border-t border-slate-50 pt-4">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <Layers size={16} className="text-blue-500" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">AI SKU Generation</span>
                         </div>
                         <button 
                           onClick={() => setUseAiSku(!useAiSku)}
                           className={`w-10 h-5 rounded-full relative transition-colors ${useAiSku ? 'bg-[#0052FF]' : 'bg-slate-200'}`}
                         >
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${useAiSku ? 'left-6' : 'left-1'}`}></div>
                         </button>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Automatically derive a structured SKU from title and specs.</p>
                   </div>
                </div>
              )}
            </div>

            {/* Right Section: Core Data */}
            <div className="lg:col-span-7 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Product Designation</label>
                     <input 
                       type="text" 
                       value={formData.title} 
                       onChange={e => setFormData({...formData, title: e.target.value})}
                       className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm font-bold text-sm focus:ring-4 focus:ring-blue-500/[0.05] transition-all outline-none" 
                       placeholder="Enter technical title..." 
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Global Tracking SKU</label>
                     <div className="relative group">
                        <input 
                          type="text" 
                          value={formData.inventory_number} 
                          onChange={e => setFormData({...formData, inventory_number: e.target.value})}
                          className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm font-mono font-bold text-sm focus:ring-4 focus:ring-blue-500/[0.05] transition-all outline-none" 
                        />
                        {useAiSku && (
                           <button 
                             onClick={handleGenerateSku}
                             disabled={isGeneratingSku || !formData.title}
                             className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-slate-50 hover:bg-[#0052FF] hover:text-white text-slate-400 rounded-sm transition-all disabled:opacity-40"
                             title="Regenerate with AI"
                           >
                             {isGeneratingSku ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                           </button>
                        )}
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Market Classification</label>
                     <select 
                       value={formData.category_id}
                       onChange={e => setFormData({...formData, category_id: Number(e.target.value)})}
                       className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm font-bold text-sm focus:ring-4 focus:ring-blue-500/[0.05] transition-all outline-none"
                     >
                        {MOCK_CATEGORIES.map(c => (
                           <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                     </select>
                  </div>
                  
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Market Valuation (₽)</label>
                     <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₽</span>
                        <input 
                          type="number"
                          value={formData.price} 
                          onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                          className="w-full pl-10 pr-6 py-4 bg-white border border-slate-100 rounded-sm font-bold text-sm focus:ring-4 focus:ring-blue-500/[0.05] outline-none" 
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Quantity Load</label>
                     <input 
                        type="number"
                        value={formData.quantity} 
                        onChange={e => setFormData({...formData, quantity: Number(e.target.value), available_quantity: Number(e.target.value)})}
                        className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm font-bold text-sm focus:ring-4 focus:ring-blue-500/[0.05] outline-none" 
                     />
                  </div>
               </div>

               {/* Location / Zone mapping */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                        <MapPin size={10} className="text-blue-600" /> Storage Hub
                     </label>
                     <select 
                        value={formData.location_id}
                        onChange={e => setFormData({...formData, location_id: e.target.value, zone_id: ''})}
                        className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm font-bold text-sm focus:ring-4 focus:ring-blue-500/[0.05] outline-none appearance-none"
                     >
                        {MOCK_LOCATIONS.map(loc => (
                           <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                     </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Intelligence Summary</label>
                  <textarea 
                     value={formData.description} 
                     onChange={e => setFormData({...formData, description: e.target.value})}
                     className="w-full px-6 py-4 bg-white border border-slate-100 rounded-sm font-bold text-sm focus:ring-4 focus:ring-blue-500/[0.05] outline-none h-32 resize-none transition-all leading-relaxed" 
                     placeholder="Technical specifications and usage logs..." 
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-100 flex justify-end gap-4 bg-white/90 backdrop-blur-md">
            <button onClick={onClose} className="px-8 py-4 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 rounded-sm transition-all">
                Discard Entry
            </button>
            <button onClick={handleSave} className="px-10 py-4 bg-slate-950 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-sm hover:bg-blue-600 transition-all flex items-center gap-3 shadow-xl shadow-slate-900/10 active:scale-95 group">
                <Check size={18} className="group-hover:scale-110 transition-transform" />
                {editItem ? 'Update Hub Registry' : 'Commit to Network'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AddItemModal;
