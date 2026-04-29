import React, { useState } from 'react';
import { Check, X, ShieldAlert, Eye, Search, AlertTriangle, FileText, Calendar } from 'lucide-react';
import { MOCK_ITEMS } from '../constants';
import { Item } from '../types';

const ModerationView: React.FC = () => {
  // Filter for items that need moderation initially
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS.filter(i => i.requires_moderation));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would call an API
    setItems(prev => prev.filter(i => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
    // You could show a toast here
  };

  const handleReject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.filter(i => i.id !== id));
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const filteredItems = items.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.inventory_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      
      {/* Left List Column */}
      <div className="w-1/3 flex flex-col gap-4">
         <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 sticky top-0 z-10">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <ShieldAlert className="text-purple-600" size={20} />
                    <h2 className="font-bold text-slate-800">Pending Review</h2>
                </div>
                <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                    {items.length} Pending
                </span>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search by name or SKU..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
            </div>
         </div>

         <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {filteredItems.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                    <Check size={48} className="mx-auto mb-2 text-emerald-200" />
                    <p>All clear! No items pending.</p>
                </div>
            ) : (
                filteredItems.map(item => (
                    <div 
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`group p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                            selectedItem?.id === item.id 
                            ? 'bg-white border-purple-500 shadow-md ring-1 ring-purple-500' 
                            : 'bg-white border-slate-200 hover:border-purple-300'
                        }`}
                    >
                        {/* Status Stripe */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-indigo-500"></div>

                        <div className="flex gap-3 pl-2">
                            <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0 overflow-hidden border border-slate-200">
                                {item.image_url && <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-slate-800 text-sm truncate pr-2">{item.title}</h3>
                                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                                        {item.inventory_number || 'NO-SKU'}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 mb-2 truncate">
                                    {item.condition.replace('_', ' ')} • ${item.price}
                                </p>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={(e) => handleApprove(item.id, e)}
                                        className="flex-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 py-1 rounded text-xs font-medium flex items-center justify-center gap-1"
                                    >
                                        <Check size={12} /> Approve
                                    </button>
                                    <button 
                                        onClick={(e) => handleReject(item.id, e)}
                                        className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-1 rounded text-xs font-medium flex items-center justify-center gap-1"
                                    >
                                        <X size={12} /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
         </div>
      </div>

      {/* Main Preview Column */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col relative overflow-hidden">
          {selectedItem ? (
              <div className="h-full flex flex-col">
                 <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                <AlertTriangle size={12} /> Needs Review
                            </span>
                            <span className="text-slate-400 text-xs flex items-center gap-1">
                                <Calendar size={12} /> Added today
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">{selectedItem.title}</h1>
                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                            SKU: <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">{selectedItem.inventory_number || 'N/A'}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                         <button 
                            onClick={(e) => handleReject(selectedItem.id, e)}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
                         >
                            <X size={18} /> Reject
                         </button>
                         <button 
                            onClick={(e) => handleApprove(selectedItem.id, e)}
                            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-200 font-medium transition-all flex items-center gap-2"
                         >
                            <Check size={18} /> Approve Item
                         </button>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                             {/* Image Preview */}
                            <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden flex items-center justify-center relative group">
                                {selectedItem.image_url ? (
                                    <img src={selectedItem.image_url} alt={selectedItem.title} className="w-full h-full object-contain mix-blend-multiply" />
                                ) : (
                                    <div className="text-slate-300 flex flex-col items-center">
                                        <Eye size={48} className="mb-2" />
                                        <span>No Preview Available</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Details Table */}
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <FileText size={18} /> Item Details
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500">Category</span>
                                        <span className="font-medium text-slate-800">
                                            {selectedItem.category_id === 1 ? 'Electronics' : 
                                             selectedItem.category_id === 2 ? 'Industrial' : 'Other'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500">Price Value</span>
                                        <span className="font-medium text-slate-800">${selectedItem.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500">Stock Quantity</span>
                                        <span className="font-medium text-slate-800">{selectedItem.quantity} units</span>
                                    </div>
                                    <div className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="text-slate-500">Condition</span>
                                        <span className="font-medium text-slate-800 capitalize">{selectedItem.condition.replace('_', ' ')}</span>
                                    </div>
                                    <div className="flex justify-between pt-1">
                                        <span className="text-slate-500">Location ID</span>
                                        <span className="font-medium text-slate-800">{selectedItem.location_id || 'Unassigned'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* AI Analysis Mockup */}
                            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-blue-100">
                                <h3 className="font-bold text-indigo-900 mb-2 text-sm uppercase tracking-wide">AI Analysis</h3>
                                <p className="text-sm text-indigo-800 leading-relaxed">
                                    The image matches the description with <span className="font-bold">94% confidence</span>. 
                                    Price point seems consistent with market value for "{selectedItem.condition.replace('_', ' ')}" condition.
                                    No safety hazards detected.
                                </p>
                            </div>
                        </div>
                    </div>
                 </div>
              </div>
          ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                     <ShieldAlert size={48} className="opacity-50" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-500">No Item Selected</h3>
                  <p className="max-w-xs text-center mt-2">Select an item from the pending list to review details and approve.</p>
              </div>
          )}
      </div>

    </div>
  );
};

export default ModerationView;