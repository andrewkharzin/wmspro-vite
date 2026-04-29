
import React from 'react';
import { Activity, ShieldCheck, AlertCircle, PackageCheck } from 'lucide-react';

interface HealthProps {
  lowStock: number;
  moderationPending: number;
}

export const InventoryHealth: React.FC<HealthProps> = ({ lowStock, moderationPending }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-blue-500" size={20} />
          Operational Health
        </h3>
        <span className="text-xs font-medium text-slate-400">Live Updates</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
           <div className="flex items-center justify-between text-slate-500">
             <AlertCircle size={16} className={lowStock > 0 ? 'text-amber-500' : 'text-slate-300'} />
             <span className="text-[10px] font-bold uppercase tracking-wider">Critical Stock</span>
           </div>
           <span className="text-2xl font-black text-slate-900">{lowStock}</span>
           <p className="text-[10px] text-slate-400">Items below threshold</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-2">
           <div className="flex items-center justify-between text-slate-500">
             <ShieldCheck size={16} className={moderationPending > 0 ? 'text-purple-500' : 'text-slate-300'} />
             <span className="text-[10px] font-bold uppercase tracking-wider">Moderation</span>
           </div>
           <span className="text-2xl font-black text-slate-900">{moderationPending}</span>
           <p className="text-[10px] text-slate-400">Pending verification</p>
        </div>

        <div className="col-span-2 p-4 bg-blue-600 rounded-xl text-white flex items-center justify-between group cursor-pointer hover:bg-blue-700 transition-colors">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                    <PackageCheck size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-bold">Optimization Score</h4>
                    <p className="text-[10px] opacity-70">Based on movement data</p>
                </div>
            </div>
            <span className="text-xl font-black">94%</span>
        </div>
      </div>
    </div>
  );
};
