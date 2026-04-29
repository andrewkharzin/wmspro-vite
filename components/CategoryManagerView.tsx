
import React, { useState, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, Search, Filter, Layers, 
  ChevronRight, ChevronDown, Sparkles, BrainCircuit, 
  Loader2, Info, Check, X, Tag, Box, 
  Thermometer, ShieldAlert, Palette, Activity,
  Cpu, Hammer, RotateCcw, Zap, ImageIcon, RefreshCw
} from 'lucide-react';
import { MOCK_CATEGORIES } from '../lib/constants';
import { Category } from '../lib/types';
import { suggestCategoryOptimization, generateCategoryVisual } from '../lib/gemini';

const CategoryIcon: React.FC<{ category: Partial<Category>; className?: string; size?: number }> = ({ category, className, size = 20 }) => {
  if (category.custom_icon_url) {
    return <img src={category.custom_icon_url} className={`rounded-sm object-cover ${className}`} style={{ width: size, height: size }} alt={category.name} />;
  }

  const name = category.icon_name;
  switch (name) {
    case 'Cpu': return <Cpu className={className} size={size} />;
    case 'Hammer': return <Hammer className={className} size={size} />;
    case 'RotateCcw': return <RotateCcw className={className} size={size} />;
    case 'Zap': return <Zap className={className} size={size} />;
    case 'Box': return <Box className={className} size={size} />;
    case 'Activity': return <Activity className={className} size={size} />;
    case 'Layers': return <Layers className={className} size={size} />;
    case 'ShieldAlert': return <ShieldAlert className={className} size={size} />;
    default: return <Tag className={className} size={size} />;
  }
};

const CategoryManagerView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set([1, 2, 4]));
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isGeneratingIcon, setIsGeneratingIcon] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ suggestions: string[], optimization_score: number } | null>(null);

  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    parent_id: undefined,
    description: '',
    icon_name: 'Tag',
    custom_icon_url: '',
    color_code: '#0052FF'
  });

  const roots = useMemo(() => categories.filter(c => !c.parent_id), [categories]);
  
  const getChildren = (parentId: number) => categories.filter(c => c.parent_id === parentId);

  const toggleExpand = (id: number) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedIds(newSet);
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData(category);
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        icon_name: 'Tag',
        custom_icon_url: '',
        color_code: '#0052FF'
      });
    }
    setIsModalOpen(true);
  };

  const handleRunAiOptimization = async () => {
    setIsAiLoading(true);
    const results = await suggestCategoryOptimization(categories);
    setAiSuggestions(results);
    setIsAiLoading(false);
  };

  const handleAiGenerateIcon = async () => {
    if (!formData.name) return;
    setIsGeneratingIcon(true);
    const url = await generateCategoryVisual(formData.name);
    if (url) {
      setFormData(prev => ({ ...prev, custom_icon_url: url }));
    }
    setIsGeneratingIcon(false);
  };

  const handleSave = () => {
    if (!formData.name) return;
    
    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, ...formData } as Category : c));
    } else {
      const newCat: Category = {
        ...formData as Category,
        id: Date.now(),
        items_count: 0,
        slug: formData.name!.toLowerCase().replace(/\s+/g, '-')
      };
      setCategories([...categories, newCat]);
    }
    setIsModalOpen(false);
  };

  const renderCategoryNode = (cat: Category, depth = 0) => {
    const children = getChildren(cat.id);
    const isExpanded = expandedIds.has(cat.id);
    const hasChildren = children.length > 0;

    return (
      <div key={cat.id} className="flex flex-col">
        <div 
          className={`flex items-center gap-4 p-4 rounded-sm border transition-all group ${
            depth === 0 ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200'
          }`}
          style={{ marginLeft: `${depth * 2}rem` }}
        >
          <div className="flex items-center gap-2 shrink-0">
             {hasChildren ? (
               <button onClick={() => toggleExpand(cat.id)} className="p-1 text-slate-400 hover:text-blue-600 transition-colors">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
               </button>
             ) : (
               <div className="w-6" />
             )}
             <div 
               className="w-10 h-10 rounded-sm flex items-center justify-center text-white shadow-lg overflow-hidden"
               style={{ backgroundColor: cat.custom_icon_url ? 'transparent' : (cat.color_code || '#0052FF') }}
             >
                <CategoryIcon category={cat} className="text-white" />
             </div>
          </div>
          
          <div className="flex-1 min-w-0">
             <div className="flex items-center gap-3">
                <h4 className="font-black text-slate-900 text-sm tracking-tight truncate">{cat.name}</h4>
                <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">{cat.slug}</span>
             </div>
             <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{cat.description || 'No classification summary available.'}</p>
          </div>

          <div className="flex items-center gap-8 shrink-0">
             <div className="text-right">
                <p className="text-sm font-black text-slate-900">{cat.items_count}</p>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global SKUs</p>
             </div>
             <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleOpenModal(cat)} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-sm transition-all"><Edit2 size={14} /></button>
                <button className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-sm transition-all"><Trash2 size={14} /></button>
             </div>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className="flex flex-col mt-2 gap-2">
            {children.map(child => renderCategoryNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-140px)] animate-fade-in overflow-hidden">
      
      {/* Header & Meta Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Taxonomy Manager</h2>
          <p className="text-sm font-medium text-slate-400">Defining hierarchical asset classification and neural indexing</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search taxonomy..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-sm text-xs font-bold outline-none focus:ring-8 focus:ring-blue-500/5 transition-all w-64 shadow-sm"
              />
           </div>
           <button 
             onClick={() => handleOpenModal()}
             className="flex items-center gap-2 px-8 py-3.5 bg-[#0052FF] text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-[#0041CC] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
           >
             <Plus size={18} /> Add Category
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
        
        {/* Left Column: Category Tree */}
        <div className="lg:col-span-8 bg-white/60 backdrop-blur-3xl rounded-sm border border-white/60 shadow-2xl flex flex-col overflow-hidden">
           <div className="p-8 border-b border-slate-100 bg-white/40 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Classified Index</h3>
              <div className="flex items-center gap-4">
                 <button onClick={() => setExpandedIds(new Set())} className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">Collapse All</button>
                 <button onClick={() => setExpandedIds(new Set(categories.map(c => c.id)))} className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors">Expand All</button>
              </div>
           </div>
           <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-4">
              {roots.map(root => renderCategoryNode(root))}
              {roots.length === 0 && (
                <div className="py-32 text-center">
                  <Layers size={64} strokeWidth={1} className="mx-auto mb-6 text-slate-200" />
                  <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No root categories defined in grid</p>
                </div>
              )}
           </div>
        </div>

        {/* Right Column: AI Insights & Statistics */}
        <div className="lg:col-span-4 space-y-8 overflow-y-auto no-scrollbar">
           <div className="bg-slate-950 p-8 rounded-sm text-white relative overflow-hidden group border border-white/5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-blue-600/20 transition-all duration-700"></div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-blue-600 rounded-sm shadow-xl"><BrainCircuit size={20} /></div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Taxonomy Auditor</h4>
                 </div>
                 <p className="text-lg font-medium leading-relaxed mb-8">System can automatically audit category distribution to identify fragmentation or over-saturation.</p>
                 <button 
                  onClick={handleRunAiOptimization}
                  disabled={isAiLoading}
                  className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-sm font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                 >
                    {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} 
                    Run Neural Audit
                 </button>
              </div>
           </div>

           {aiSuggestions && (
             <div className="bg-white rounded-sm border border-slate-100 p-8 shadow-sm animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Findings</h4>
                   <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-emerald-500">{aiSuggestions.optimization_score}%</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase">Health</span>
                   </div>
                </div>
                <ul className="space-y-4">
                   {aiSuggestions.suggestions.map((s, i) => (
                     <li key={i} className="flex gap-4 p-4 bg-slate-50 rounded-sm border border-slate-100 group hover:border-blue-200 transition-all">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0 group-hover:scale-125 transition-transform" />
                        <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{s}</p>
                     </li>
                   ))}
                </ul>
             </div>
           )}

           <div className="bg-white rounded-sm border border-slate-100 p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Global Distribution</h4>
              <div className="space-y-6">
                 {[
                   { label: 'Most Populated', val: 'Industrial Parts', count: 890, color: '#F5A623' },
                   { label: 'Least Populated', val: 'Chemicals', count: 45, color: '#FF5733' },
                   { label: 'Deepest Hierarchy', val: 'Electronics', count: 3, color: '#0052FF' },
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-sm font-black text-slate-900 mt-1">{stat.val}</p>
                      </div>
                      <div className="text-right">
                         <span className="text-xs font-black px-2 py-1 rounded-sm text-white shadow-sm" style={{ backgroundColor: stat.color }}>{stat.count}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* MODAL: CATEGORY ENTRY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fade-in">
           <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
           <div className="relative w-full max-w-2xl bg-white rounded-sm border border-white shadow-2xl p-12 space-y-10 animate-scale-up overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-6">
                    <div 
                      className="w-16 h-16 rounded-sm flex items-center justify-center shadow-2xl shadow-blue-500/10 text-white overflow-hidden relative group/icon"
                      style={{ backgroundColor: formData.custom_icon_url ? 'transparent' : (formData.color_code || '#0052FF') }}
                    >
                      {isGeneratingIcon ? (
                        <Loader2 className="animate-spin text-white" size={32} />
                      ) : (
                        <CategoryIcon category={formData} size={32} />
                      )}
                      
                      {formData.custom_icon_url && (
                        <button 
                          onClick={() => setFormData({ ...formData, custom_icon_url: '' })}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover/icon:opacity-100 transition-opacity flex items-center justify-center text-white text-[8px] font-black uppercase"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{editingCategory ? 'Update Taxonomy' : 'Define Taxonomy'}</h3>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Taxonomy Registry</p>
                    </div>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-50 rounded-sm text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
              </div>

              <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Display Name</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Precision Robotics" 
                         value={formData.name} 
                         onChange={e => setFormData({...formData, name: e.target.value})} 
                         className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all" 
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Parent Mapping</label>
                       <select 
                         value={formData.parent_id || ''} 
                         onChange={e => setFormData({...formData, parent_id: e.target.value ? Number(e.target.value) : undefined})} 
                         className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none appearance-none"
                       >
                         <option value="">Root Taxonomy (Level 0)</option>
                         {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                         ))}
                       </select>
                    </div>

                    <div className="space-y-3">
                       <div className="flex justify-between items-center ml-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity Visual</label>
                          <button 
                            onClick={handleAiGenerateIcon}
                            disabled={!formData.name || isGeneratingIcon}
                            className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 disabled:opacity-40"
                          >
                            {isGeneratingIcon ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Generate Unique AI Visual
                          </button>
                       </div>
                       <select 
                         value={formData.icon_name} 
                         disabled={!!formData.custom_icon_url}
                         onChange={e => setFormData({...formData, icon_name: e.target.value})} 
                         className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none appearance-none disabled:opacity-40"
                       >
                         <option value="Tag">Default Tag</option>
                         <option value="Cpu">Electronics / CPU</option>
                         <option value="Hammer">Industrial / Tools</option>
                         <option value="RotateCcw">Mechanical / Bearings</option>
                         <option value="Zap">Energy / Hydraulics</option>
                         <option value="Box">Storage / Office</option>
                         <option value="Activity">Sensors / Lab</option>
                         <option value="Layers">Raw Materials</option>
                         <option value="ShieldAlert">Hazardous / Chem</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Identity Color</label>
                       <div className={`flex gap-4 p-4 bg-slate-50 rounded-sm transition-opacity ${formData.custom_icon_url ? 'opacity-40 pointer-events-none' : ''}`}>
                          {['#0052FF', '#F5A623', '#7ED321', '#9013FE', '#D0021B', '#4A90E2'].map(c => (
                            <button 
                              key={c} 
                              onClick={() => setFormData({...formData, color_code: c})}
                              className={`w-8 h-8 rounded-sm shadow-sm transition-all ${formData.color_code === c ? 'ring-4 ring-white border border-slate-300 scale-125' : 'hover:scale-110'}`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                       </div>
                    </div>

                    <div className="md:col-span-2 space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Intelligence Summary (Description)</label>
                       <textarea 
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none h-32 resize-none"
                        placeholder="Define the functional scope of this classification..."
                       />
                    </div>
                 </div>
              </div>

              <div className="flex gap-6 pt-4">
                 <button onClick={() => setIsModalOpen(false)} className="flex-1 py-6 bg-slate-50 text-slate-400 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all">Discard</button>
                 <button onClick={handleSave} className="flex-1 py-6 bg-blue-600 text-white rounded-sm text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">Commit Registry</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagerView;
