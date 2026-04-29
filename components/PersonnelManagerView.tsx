
import React, { useState } from 'react';
import { 
  Users, Calendar, Clock, DollarSign, Search, 
  Plus, MoreVertical, Filter, ArrowUpRight, 
  Briefcase, CheckCircle2, AlertCircle, TrendingUp,
  UserPlus, Download, UserCheck
} from 'lucide-react';
import { MOCK_PROFILES, MOCK_SHIFTS, MOCK_PAYROLL } from '../lib/constants';
import { Profile, WorkShift, PayrollRecord } from '../lib/types';
import { useTranslation, Language } from '../lib/i18n';

interface PersonnelManagerViewProps {
  lang: Language;
}

const PersonnelManagerView: React.FC<PersonnelManagerViewProps> = ({ lang }) => {
  const t = useTranslation(lang);
  const [activeTab, setActiveTab] = useState<'roster' | 'schedule' | 'payroll'>('roster');
  const [searchTerm, setSearchTerm] = useState('');

  const renderRoster = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search employees..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-sm text-xs font-bold outline-none focus:ring-8 focus:ring-blue-500/5 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-slate-950 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">
          <UserPlus size={18} /> Hire Personnel
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-3xl rounded-sm border border-white/60 shadow-2xl overflow-hidden">
        <table className="w-full text-left border-separate border-spacing-0">
          <thead className="bg-slate-50/50 sticky top-0 z-10">
            <tr>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Employee</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Department</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Hourly Rate</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {MOCK_PROFILES.map((user) => (
              <tr key={user.id} className="hover:bg-white group transition-all">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar_url} className="w-12 h-12 rounded-sm border-2 border-slate-100" />
                    <div>
                      <p className="font-black text-slate-900 text-sm">{user.full_name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{user.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Briefcase size={14} className="text-blue-500" />
                    <span className="text-[11px] font-black uppercase">{user.department || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <span className="text-sm font-black text-slate-900">${user.hourly_rate}/hr</span>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{user.status}</span>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <button className="p-3 text-slate-300 hover:text-slate-900 transition-colors opacity-0 group-hover:opacity-100">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <div key={day} className="bg-white/40 p-4 border border-slate-100 rounded-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">{day}</p>
               <div className="space-y-3">
                  {MOCK_SHIFTS.filter(s => day === 'Thu').map(shift => (
                     <div key={shift.id} className="p-3 bg-blue-50 border border-blue-100 rounded-sm">
                        <p className="text-[10px] font-black text-blue-900 truncate">
                           {MOCK_PROFILES.find(u => u.id === shift.user_id)?.full_name}
                        </p>
                        <p className="text-[9px] font-bold text-blue-600 mt-1">{shift.start_time} - {shift.end_time}</p>
                     </div>
                  ))}
                  <button className="w-full py-2 border border-dashed border-slate-200 text-slate-300 hover:border-blue-300 hover:text-blue-400 transition-all rounded-sm flex items-center justify-center">
                    <Plus size={12} />
                  </button>
               </div>
            </div>
          ))}
       </div>
       
       <div className="bg-slate-950 p-8 rounded-sm text-white relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10 flex items-center justify-between">
             <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center border border-white/10"><Calendar size={24} className="text-blue-400"/></div>
                <div>
                   <h4 className="text-lg font-black tracking-tight">Active Shifts: 12</h4>
                   <p className="text-xs text-slate-400">Hub-Level Resource Optimization is Active</p>
                </div>
             </div>
             <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-sm text-[10px] font-black uppercase tracking-widest transition-all">Generate Smart Schedule</button>
          </div>
       </div>
    </div>
  );

  const renderPayroll = () => (
    <div className="space-y-8 animate-fade-in">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-sm border border-slate-100 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Liability</p>
             <h3 className="text-3xl font-black text-slate-950">$12,450.00</h3>
             <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase">
                <TrendingUp size={12} className="rotate-180" /> +5% vs Prev Month
             </div>
          </div>
          <div className="bg-white p-8 rounded-sm border border-slate-100 shadow-sm">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Average Payout</p>
             <h3 className="text-3xl font-black text-slate-950">$3,200.00</h3>
          </div>
          <div className="bg-blue-600 p-8 rounded-sm text-white shadow-xl shadow-blue-500/20">
             <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Next Pay Run</p>
             <h3 className="text-3xl font-black">Oct 31, 2024</h3>
          </div>
       </div>

       <div className="bg-white border border-slate-100 rounded-sm shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <h4 className="text-sm font-black uppercase tracking-widest text-slate-900">Current Ledger</h4>
             <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-sm text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">
               <Download size={14} /> Export CSV
             </button>
          </div>
          <div className="divide-y divide-slate-50">
             {MOCK_PAYROLL.map(record => (
               <div key={record.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-6">
                     <div className="w-10 h-10 bg-slate-100 rounded-sm flex items-center justify-center text-slate-400"><DollarSign size={20} /></div>
                     <div>
                        <p className="text-sm font-black text-slate-900">{MOCK_PROFILES.find(u => u.id === record.user_id)?.full_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{record.period}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-10">
                     <div className="text-right">
                        <p className="text-sm font-black text-slate-900">${record.amount.toLocaleString()}</p>
                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Bonus: +${record.bonus}</p>
                     </div>
                     <span className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest border ${
                        record.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                     }`}>
                        {record.status}
                     </span>
                     <button className="p-2 bg-slate-100 rounded-sm text-slate-400 hover:text-blue-600 transition-all"><ArrowUpRight size={18} /></button>
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-140px)] animate-fade-in overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Personnel Intelligence</h2>
          <p className="text-sm font-medium text-slate-400">Managing human node capacity and fiscal operations</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-sm border border-slate-200">
           {[
             { id: 'roster', label: 'Roster', icon: <Users size={16} /> },
             { id: 'schedule', label: 'Shifts', icon: <Calendar size={16} /> },
             { id: 'payroll', label: 'Payroll', icon: <DollarSign size={16} /> }
           ].map(tab => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`flex items-center gap-2 px-6 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${
                 activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               {tab.icon} {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
         {activeTab === 'roster' && renderRoster()}
         {activeTab === 'schedule' && renderSchedule()}
         {activeTab === 'payroll' && renderPayroll()}
      </div>
    </div>
  );
};

export default PersonnelManagerView;
