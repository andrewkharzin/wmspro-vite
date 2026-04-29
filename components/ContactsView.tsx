
import React, { useState, useMemo, useRef } from 'react';
import { 
  Building2, Users, Search, Plus, Mail, Phone, Globe, MapPin, 
  MoreVertical, Star, ShieldCheck, X, Check, Edit2, Trash2,
  Briefcase, ExternalLink, ArrowUpRight, CheckCircle2, Camera, Image as ImageIcon
} from 'lucide-react';
import { MOCK_COMPANIES } from '../lib/constants';
import { Company, Contact } from '../lib/types';

const ContactsView: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Company>>({
    name: '',
    address: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    industry: '',
    is_own_company: false,
    website: '',
    tax_id: '',
    logo_url: ''
  });

  const ownCompany = useMemo(() => companies.find(c => c.is_own_company), [companies]);
  const partners = useMemo(() => companies.filter(c => !c.is_own_company), [companies]);

  const filteredPartners = partners.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (company?: Company) => {
    if (company) {
      setEditingCompany(company);
      setFormData(company);
    } else {
      setEditingCompany(null);
      setFormData({
        name: '',
        address: '',
        city: '',
        country: '',
        email: '',
        phone: '',
        industry: '',
        is_own_company: companies.some(c => c.is_own_company) ? false : true,
        website: '',
        tax_id: '',
        logo_url: ''
      });
    }
    setIsCompanyModalOpen(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, logo_url: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCompany = () => {
    if (!formData.name) return;

    if (editingCompany) {
      setCompanies(prev => prev.map(c => c.id === editingCompany.id ? { ...c, ...formData } as Company : c));
    } else {
      const newComp: Company = {
        ...formData as Company,
        id: `comp-${Date.now()}`,
        contacts: []
      };
      // If we mark a new one as "own", unmark others
      if (newComp.is_own_company) {
        setCompanies(prev => prev.map(c => ({ ...c, is_own_company: false })).concat(newComp));
      } else {
        setCompanies([...companies, newComp]);
      }
    }
    setIsCompanyModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-140px)] animate-fade-in overflow-hidden">
      
      {/* Top Banner: My Company */}
      <section>
        <div className="flex items-center justify-between mb-4 px-2">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Corporate Entity</h3>
           {!ownCompany && (
             <button onClick={() => handleOpenModal()} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
               <Plus size={12}/> Define Primary Hub
             </button>
           )}
        </div>

        {ownCompany ? (
          <div className="bg-slate-950 rounded-sm p-10 text-white relative overflow-hidden group shadow-2xl border border-white/5">
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full translate-x-1/4 -translate-y-1/4 group-hover:bg-blue-600/20 transition-all duration-700"></div>
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="relative shrink-0">
                   <div className="w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-sm border border-white/20 backdrop-blur-xl flex items-center justify-center p-2 shadow-2xl overflow-hidden">
                      {ownCompany.logo_url ? (
                        <img src={ownCompany.logo_url} className="w-full h-full object-cover rounded-sm" alt="Company Logo" />
                      ) : (
                        <Building2 size={48} className="text-white/40" />
                      )}
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-sm border-4 border-slate-950 shadow-xl">
                      <ShieldCheck size={20} strokeWidth={2.5} />
                   </div>
                </div>

                <div className="flex-1 space-y-4 text-center md:text-left">
                   <div>
                      <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">{ownCompany.name}</h2>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                         <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] bg-blue-500/10 px-3 py-1.5 rounded-sm border border-blue-500/20">Own Enterprise Node</span>
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{ownCompany.tax_id || 'Tax ID Pending'}</span>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                      <div className="flex items-center gap-3 text-slate-400 group/item">
                         <div className="p-2.5 bg-white/5 rounded-sm border border-white/10 text-white group-hover/item:bg-blue-600 transition-colors"><Mail size={14}/></div>
                         <span className="text-xs font-bold truncate">{ownCompany.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 group/item">
                         <div className="p-2.5 bg-white/5 rounded-sm border border-white/10 text-white group-hover/item:bg-blue-600 transition-colors"><Phone size={14}/></div>
                         <span className="text-xs font-bold">{ownCompany.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 group/item">
                         <div className="p-2.5 bg-white/5 rounded-sm border border-white/10 text-white group-hover/item:bg-blue-600 transition-colors"><MapPin size={14}/></div>
                         <span className="text-xs font-bold truncate">{ownCompany.city}, {ownCompany.country}</span>
                      </div>
                   </div>
                </div>

                <div className="flex flex-col gap-3 shrink-0">
                   <button onClick={() => handleOpenModal(ownCompany)} className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-sm font-black text-[10px] uppercase tracking-widest transition-all text-white flex items-center justify-center gap-2">
                      <Edit2 size={14} /> Update Registry
                   </button>
                   <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-sm font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2">
                      <Globe size={14} /> Corporate Portal
                   </button>
                </div>
             </div>
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-sm p-16 text-center">
             <Building2 size={48} className="mx-auto mb-4 text-slate-300" />
             <h3 className="text-xl font-black text-slate-900 mb-2">Corporate Node Required</h3>
             <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">Define your own company first to enable document mentions, label branding, and network verification.</p>
             <button onClick={() => handleOpenModal()} className="px-10 py-4 bg-blue-600 text-white rounded-sm font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                Initialize Entity Registry
             </button>
          </div>
        )}
      </section>

      {/* Partners List */}
      <section className="flex-1 flex flex-col min-h-0">
         <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6 mb-8 px-2">
            <div>
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Supply Network Partners</h3>
               <h2 className="text-2xl font-black text-slate-900 tracking-tighter">Verified Collaborators</h2>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
               <div className="relative flex-1 md:w-80 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search logistics network..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-sm text-xs font-bold outline-none focus:ring-8 focus:ring-blue-500/5 transition-all shadow-sm"
                  />
               </div>
               <button onClick={() => handleOpenModal()} className="p-3.5 bg-slate-950 text-white rounded-sm hover:bg-blue-600 transition-all shadow-xl">
                  <Plus size={20} />
               </button>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto pr-2 no-scrollbar pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {filteredPartners.map(partner => (
                 <div key={partner.id} className="bg-white rounded-sm border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col h-full relative overflow-hidden">
                    <div className="p-8 border-b border-slate-50 relative z-10 flex items-center justify-between">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-sm bg-slate-50 flex items-center justify-center p-2 border border-slate-100 shadow-inner group-hover:bg-blue-50 transition-colors shrink-0 overflow-hidden">
                             {partner.logo_url ? <img src={partner.logo_url} className="w-full h-full object-cover rounded-sm" /> : <Building2 size={24} className="text-slate-400" />}
                          </div>
                          <div className="min-w-0">
                             <h4 className="font-black text-slate-900 tracking-tight text-lg truncate group-hover:text-blue-600 transition-colors">{partner.name}</h4>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{partner.industry || 'General Partner'}</p>
                          </div>
                       </div>
                       <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors shrink-0">
                          <MoreVertical size={20} />
                       </button>
                    </div>

                    <div className="p-8 space-y-6 flex-1 relative z-10">
                       <div className="space-y-4">
                          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                             <Mail size={14} className="text-blue-500 shrink-0" />
                             <span className="truncate">{partner.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                             <Phone size={14} className="text-emerald-500 shrink-0" />
                             <span>{partner.phone}</span>
                          </div>
                          <div className="flex items-start gap-3 text-xs font-bold text-slate-500">
                             <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                             <span>{partner.address}, {partner.city}</span>
                          </div>
                       </div>

                       <div className="pt-6 border-t border-slate-50">
                          <div className="flex items-center justify-between mb-4">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Contacts</p>
                             <span className="text-[10px] font-black text-blue-600 uppercase">{partner.contacts?.length || 0} Listed</span>
                          </div>
                          <div className="flex -space-x-2">
                             {(partner.contacts || []).slice(0, 3).map(c => (
                               <div key={c.id} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-600 uppercase" title={`${c.first_name} ${c.last_name}`}>
                                  {c.first_name[0]}{c.last_name[0]}
                               </div>
                             ))}
                             {partner.contacts && partner.contacts.length > 3 && (
                               <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-50 text-[10px] font-black text-blue-600 flex items-center justify-center">
                                  +{partner.contacts.length - 3}
                               </div>
                             )}
                             {(!partner.contacts || partner.contacts.length === 0) && (
                               <p className="text-[10px] text-slate-300 italic">No human node contacts mapped.</p>
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="p-8 pt-0 relative z-10">
                       <button className="w-full py-4 bg-slate-50 hover:bg-slate-950 text-slate-400 hover:text-white rounded-sm font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-slate-100 group/btn active:scale-95">
                          View Entity Dossier
                          <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                       </button>
                    </div>
                 </div>
               ))}
               
               {filteredPartners.length === 0 && (
                 <div className="col-span-full py-32 text-center bg-white/40 rounded-sm border border-dashed border-slate-200">
                    <Building2 size={64} strokeWidth={1} className="mx-auto mb-6 text-slate-200" />
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-sm">No partners match your criteria</p>
                    <button onClick={() => setSearchTerm('')} className="mt-8 px-10 py-4 bg-slate-900 text-white rounded-sm font-black text-[10px] uppercase tracking-widest shadow-xl">Reset Search</button>
                 </div>
               )}
            </div>
         </div>
      </section>

      {/* MODAL: Company Entry */}
      {isCompanyModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-md" onClick={() => setIsCompanyModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white rounded-sm border border-white shadow-2xl p-12 space-y-10 animate-scale-up overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-sm flex items-center justify-center shadow-xl shadow-blue-500/10"><Building2 size={28} /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{editingCompany ? 'Update Entity Registry' : 'Provision New Entity'}</h3>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Logistics Network Calibration</p>
                  </div>
               </div>
               <button onClick={() => setIsCompanyModalOpen(false)} className="p-3 bg-slate-50 rounded-sm text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
            </div>

            <div className="space-y-8">
               {/* Logo Upload Section */}
               <div className="flex flex-col items-center gap-4 py-4">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative w-32 h-32 rounded-sm bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all overflow-hidden"
                  >
                     {formData.logo_url ? (
                       <img src={formData.logo_url} className="w-full h-full object-cover" alt="Upload Preview" />
                     ) : (
                       <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-blue-500">
                          <Camera size={32} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Upload Logo</span>
                       </div>
                     )}
                     <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImageIcon size={24} className="text-white" />
                     </div>
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleLogoUpload} 
                  />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Corporate Branding Identity</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Corporate Name</label>
                     <input type="text" placeholder="e.g. Nexus Global Ops" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-6 bg-slate-50 border-none rounded-sm font-bold text-sm focus:ring-8 focus:ring-blue-500/[0.03] transition-all outline-none" />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Industry Sector</label>
                    <input type="text" placeholder="Industrial, Logistics, etc." value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Tax ID / VAT</label>
                    <input type="text" placeholder="REG-XXX-000" value={formData.tax_id} onChange={(e) => setFormData({...formData, tax_id: e.target.value.toUpperCase()})} className="w-full p-5 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Network Email</label>
                    <input type="email" placeholder="contact@domain.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Secure Phone</label>
                    <input type="tel" placeholder="+7 000 000 00 00" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none" />
                  </div>

                  <div className="md:col-span-2 space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Registered Address</label>
                     <input type="text" placeholder="Physical location..." value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">City</label>
                    <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Country</label>
                    <input type="text" placeholder="Country" value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} className="w-full p-5 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none" />
                  </div>
               </div>

               {!editingCompany && (
                 <label className="flex items-center gap-4 p-8 bg-blue-50/50 rounded-sm border border-blue-100 cursor-pointer group hover:bg-blue-50 transition-all">
                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center transition-all ${formData.is_own_company ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-300 border border-slate-200'}`}>
                       <CheckCircle2 size={20} />
                    </div>
                    <input type="checkbox" checked={formData.is_own_company} onChange={(e) => setFormData({...formData, is_own_company: e.target.checked})} className="hidden" />
                    <div>
                       <span className="text-xs font-black text-slate-900 uppercase tracking-[0.1em] block">Mark as Primary Entity</span>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sets this company as the own identity of this terminal</span>
                    </div>
                 </label>
               )}
            </div>

            <div className="flex gap-6 pt-4">
               <button onClick={() => setIsCompanyModalOpen(false)} className="flex-1 py-6 bg-slate-50 text-slate-400 rounded-sm text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all">Discard</button>
               <button onClick={handleSaveCompany} className="flex-1 py-6 bg-blue-600 text-white rounded-sm text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">Commit Registry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactsView;
