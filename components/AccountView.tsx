// components/AccountView.tsx - максимально упрощенная версия
import React, { useState, useRef } from 'react';
import {
  User, Building2, Shield, Bell, Camera, Save,
  LogOut, ChevronRight, Mail, Loader2, Edit2, X, Check
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useProfileData } from '@/hooks/useProfileData';
import { useCompanyData } from '@/hooks/useCompanyData';

const AccountView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'company'>('profile');
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '', address: '', city: '', country: '',
    email: '', phone: '', tax_id: '', website: '', industry: ''
  });

  const { user: authUser, logout } = useAuthStore();
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useProfileData(authUser?.id);
  const { company, loading: companyLoading, saveCompany } = useCompanyData();

  const [formData, setFormData] = useState({
    full_name: '', username: '', email: '', department: '', hourly_rate: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        username: profile.username || '',
        email: profile.email || '',
        department: profile.department || '',
        hourly_rate: profile.hourly_rate?.toString() || '',
      });
    }
  }, [profile]);

  React.useEffect(() => {
    if (company) {
      setCompanyForm({
        name: company.name || '',
        address: company.address || '',
        city: company.city || '',
        country: company.country || '',
        email: company.email || '',
        phone: company.phone || '',
        tax_id: company.tax_id || '',
        website: company.website || '',
        industry: company.industry || '',
      });
    }
  }, [company]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await updateProfile({
      full_name: formData.full_name,
      username: formData.username,
      department: formData.department,
      hourly_rate: parseFloat(formData.hourly_rate) || null,
    });
    setIsSaving(false);
    alert('Profile updated');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await uploadAvatar(file);
    setIsUploading(false);
  };

  const handleSaveCompany = async () => {
    setIsSaving(true);
    await saveCompany(companyForm);
    setIsEditingCompany(false);
    setIsSaving(false);
    alert('Company saved');
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!profile) return null;

  const avatarUrl = profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}&background=0052FF&color=fff`;

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-140px)] overflow-hidden">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black">Terminal Settings</h2>
          <p className="text-sm text-slate-400">Manage your profile and company</p>
        </div>
        {activeTab === 'profile' && (
          <button onClick={handleSaveProfile} disabled={isSaving} className="px-10 py-4 bg-blue-600 text-white rounded-sm font-black text-xs disabled:opacity-50">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save</>}
          </button>
        )}
      </div>

      <div className="flex-1 bg-white/60 rounded-sm border shadow-2xl flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-slate-50/50 border-r p-8 space-y-1">
          {[
            { id: 'profile', label: 'User Profile', icon: <User size={18} /> },
            { id: 'company', label: 'Corporate Entity', icon: <Building2 size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex justify-between items-center p-4 rounded-sm transition-all ${
                activeTab === tab.id ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500 hover:bg-white'
              }`}
            >
              <div className="flex gap-3">
                {tab.icon}
                <span className="text-[11px] font-black uppercase">{tab.label}</span>
              </div>
              <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
            </button>
          ))}
          <div className="pt-8 border-t mt-auto">
            <button onClick={logout} className="w-full flex gap-3 p-4 text-rose-500 hover:bg-rose-50 rounded-sm">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-10">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="text-center">
                  <div className="relative w-40 h-40 mx-auto">
                    <img src={avatarUrl} className="w-full h-full rounded-sm object-cover" />
                    <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-full">
                      <Camera size={16} className="text-white" />
                    </button>
                    {isUploading && <div className="absolute inset-0 bg-black/50 rounded-sm flex items-center justify-center"><Loader2 className="animate-spin text-white" /></div>}
                    <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </div>
                  <h4 className="mt-4 font-black">{profile.full_name}</h4>
                  <p className="text-[10px] text-slate-400">{profile.role} • {profile.subscription_tier}</p>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" value={formData.full_name} onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))} placeholder="Full Name" className="p-4 bg-slate-50 rounded-sm" />
                    <input type="text" value={formData.username} onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))} placeholder="Username" className="p-4 bg-slate-50 rounded-sm" />
                    <input type="text" value={formData.department} onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))} placeholder="Department" className="p-4 bg-slate-50 rounded-sm" />
                    <input type="number" value={formData.hourly_rate} onChange={e => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))} placeholder="Hourly Rate" className="p-4 bg-slate-50 rounded-sm" />
                    <div className="md:col-span-2 relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="email" value={formData.email} readOnly className="w-full pl-12 p-4 bg-slate-100 rounded-sm" />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 flex gap-3 rounded-sm">
                    <Shield className="text-blue-600" />
                    <div><p className="font-black text-sm">Authority Level</p><p className="text-xs text-blue-700">Your account has {profile.role} permissions</p></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-6">
              {companyLoading ? <Loader2 className="animate-spin mx-auto" /> : (
                <>
                  <div className="bg-slate-900 text-white p-8 rounded-sm flex justify-between items-center">
                    <div><h3 className="text-2xl font-black">{company?.name || 'No Company'}</h3><p className="text-blue-400 text-[10px]">Enterprise Entity</p></div>
                    {!isEditingCompany && <button onClick={() => setIsEditingCompany(true)} className="px-4 py-2 bg-white/10 rounded-sm"><Edit2 size={14} /> Edit</button>}
                  </div>

                  {isEditingCompany ? (
                    <div className="bg-white p-8 rounded-sm border space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input value={companyForm.name} onChange={e => setCompanyForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Company Name" className="p-4 bg-slate-50 rounded-sm" />
                        <input value={companyForm.tax_id} onChange={e => setCompanyForm(prev => ({ ...prev, tax_id: e.target.value }))} placeholder="Tax ID" className="p-4 bg-slate-50 rounded-sm" />
                        <input value={companyForm.industry} onChange={e => setCompanyForm(prev => ({ ...prev, industry: e.target.value }))} placeholder="Industry" className="p-4 bg-slate-50 rounded-sm" />
                        <input value={companyForm.email} onChange={e => setCompanyForm(prev => ({ ...prev, email: e.target.value }))} placeholder="Email" className="p-4 bg-slate-50 rounded-sm" />
                        <input value={companyForm.phone} onChange={e => setCompanyForm(prev => ({ ...prev, phone: e.target.value }))} placeholder="Phone" className="p-4 bg-slate-50 rounded-sm" />
                        <input value={companyForm.website} onChange={e => setCompanyForm(prev => ({ ...prev, website: e.target.value }))} placeholder="Website" className="p-4 bg-slate-50 rounded-sm" />
                        <input value={companyForm.address} onChange={e => setCompanyForm(prev => ({ ...prev, address: e.target.value }))} placeholder="Address" className="md:col-span-2 p-4 bg-slate-50 rounded-sm" />
                        <div className="flex gap-4 md:col-span-2">
                          <button onClick={handleSaveCompany} className="px-8 py-3 bg-blue-600 text-white rounded-sm">Save</button>
                          <button onClick={() => setIsEditingCompany(false)} className="px-8 py-3 bg-slate-100 rounded-sm">Cancel</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white p-8 rounded-sm border grid md:grid-cols-2 gap-4">
                      <div><label className="text-[10px] text-slate-400">Name</label><p>{company?.name || '-'}</p></div>
                      <div><label className="text-[10px] text-slate-400">Tax ID</label><p>{company?.tax_id || '-'}</p></div>
                      <div><label className="text-[10px] text-slate-400">Industry</label><p>{company?.industry || '-'}</p></div>
                      <div><label className="text-[10px] text-slate-400">Email</label><p>{company?.email || '-'}</p></div>
                      <div><label className="text-[10px] text-slate-400">Phone</label><p>{company?.phone || '-'}</p></div>
                      <div><label className="text-[10px] text-slate-400">Website</label><p>{company?.website || '-'}</p></div>
                      <div className="md:col-span-2"><label className="text-[10px] text-slate-400">Address</label><p>{company?.address ? `${company.address}, ${company.city}, ${company.country}` : '-'}</p></div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountView;