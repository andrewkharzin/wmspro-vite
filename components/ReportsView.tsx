
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  FileText, Download, Filter, Calendar, Sparkles, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Activity, Box, DollarSign, BrainCircuit, Loader2
} from 'lucide-react';
import { generateReportInsight } from '../lib/gemini';
import { MOCK_ITEMS, MOCK_LOCATIONS, MOCK_MOVEMENTS } from '../lib/constants';

const COLORS = ['#0052FF', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

const ReportsView: React.FC = () => {
  const [activeReport, setActiveReport] = useState('inventory_valuation');
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Valuation by Location Data
  const valuationData = MOCK_LOCATIONS.map(loc => ({
    name: loc.name,
    value: MOCK_ITEMS.filter(i => i.location_id === loc.id)
                  .reduce((sum, i) => sum + (i.price * i.available_quantity), 0)
  }));

  // Category Distribution Data
  const categories = Array.from(new Set(MOCK_ITEMS.map(i => i.category_id)));
  const categoryData = categories.map(catId => ({
    name: `Category ${catId}`,
    count: MOCK_ITEMS.filter(i => i.category_id === catId).length
  }));

  // Mock Movement Velocity Data
  const movementVelocity = [
    { time: '08:00', load: 12 },
    { time: '10:00', load: 45 },
    { time: '12:00', load: 30 },
    { time: '14:00', load: 68 },
    { time: '16:00', load: 52 },
    { time: '18:00', load: 20 },
  ];

  const fetchInsight = async (type: string) => {
    setIsLoadingInsight(true);
    const insight = await generateReportInsight(type);
    setAiInsight(insight);
    setIsLoadingInsight(false);
  };

  useEffect(() => {
    fetchInsight(activeReport);
  }, [activeReport]);

  const reports = [
    { id: 'inventory_valuation', label: 'Asset Valuation', icon: <DollarSign size={18} /> },
    { id: 'warehouse_capacity', label: 'Capacity Utilization', icon: <Box size={18} /> },
    { id: 'movement_velocity', label: 'Throughput Trends', icon: <TrendingUp size={18} /> },
    { id: 'health_compliance', label: 'Health & Compliance', icon: <Activity size={18} /> },
  ];

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-140px)] animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Intelligence Hub</h2>
          <p className="text-sm font-medium text-slate-400">Deep-dive spatial analytics and predictive reporting</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {reports.map(r => (
              <button
                key={r.id}
                onClick={() => setActiveReport(r.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeReport === r.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {r.icon} {r.label}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
            <Download size={18} /> Export Data
          </button>
        </div>
      </div>

      {/* AI Summary Banner */}
      <div className="bg-slate-950 p-8 rounded-[3rem] relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full translate-x-1/4 -translate-y-1/4"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="w-20 h-20 bg-blue-600/20 rounded-[2rem] flex items-center justify-center shrink-0 border border-blue-500/30">
            {isLoadingInsight ? <Loader2 size={32} className="text-blue-400 animate-spin" /> : <BrainCircuit size={32} className="text-blue-400" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-blue-400" />
              <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">AI-Generated Insight</h3>
            </div>
            <p className="text-xl font-medium text-white leading-relaxed italic">
              {isLoadingInsight ? "Neural core analyzing spatial vectors..." : `"${aiInsight}"`}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-[2.5rem] border border-white/10 shrink-0 min-w-[160px]">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Grid Confidence</p>
             <h4 className="text-3xl font-black text-emerald-500">97.4%</h4>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
        
        {/* Main Chart Card */}
        <div className="lg:col-span-8 bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 flex flex-col">
          <div className="flex justify-between items-start mb-10">
             <div>
                <h4 className="text-xl font-black text-slate-900 tracking-tight">
                  {reports.find(r => r.id === activeReport)?.label} Distribution
                </h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Cross-terminal metric analysis</p>
             </div>
             <div className="flex items-center gap-2 text-emerald-500 font-black text-sm">
                <TrendingUp size={16} /> +14.2%
             </div>
          </div>
          
          <div className="flex-1 min-h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
                {activeReport === 'inventory_valuation' ? (
                  <BarChart data={valuationData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 800}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 800}} dx={-10} />
                    <Tooltip 
                      cursor={{fill: '#F8FAFC'}} 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} 
                    />
                    <Bar dataKey="value" fill="#0052FF" radius={[12, 12, 0, 0]} barSize={40} />
                  </BarChart>
                ) : activeReport === 'movement_velocity' ? (
                  <AreaChart data={movementVelocity}>
                    <defs>
                      <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0052FF" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#0052FF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 800}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 10, fontWeight: 800}} dx={-10} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="load" stroke="#0052FF" strokeWidth={4} fillOpacity={1} fill="url(#colorLoad)" />
                  </AreaChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                )}
             </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Info Card */}
        <div className="lg:col-span-4 space-y-8 overflow-y-auto no-scrollbar">
           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Key Performance Indicators</h4>
              <div className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Activity size={18}/></div>
                       <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Pick Accuracy</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">99.2%</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><TrendingUp size={18}/></div>
                       <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Inventory Turnover</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">4.5x</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><Box size={18}/></div>
                       <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Return Rate</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">0.8%</span>
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <h4 className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-4">Strategic Forecast</h4>
              <p className="text-lg font-bold leading-snug mb-8">Asset velocity suggests a 15% increase in storage demand within the Northern Hub next quarter.</p>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white text-blue-600 px-6 py-3 rounded-2xl hover:scale-105 transition-all">
                View Predictive Map <ArrowUpRight size={14} />
              </button>
           </div>

           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Recent Reports</h4>
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer group">
                       <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-white group-hover:text-blue-600 transition-all"><FileText size={18}/></div>
                       <div className="flex-1">
                          <p className="text-[11px] font-black text-slate-900 uppercase">Audit_Log_H1_24.pdf</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Jan 12, 2024 • 2.4 MB</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
