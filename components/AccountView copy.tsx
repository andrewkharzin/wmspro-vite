import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
  User, Building2, Shield, Bell, Camera, Save,
  RefreshCw, LogOut, ChevronRight, Fingerprint,
  Laptop, Key, Mail, Loader2, CreditCard, Edit2, X, Check
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { browserClient } from '@/lib/supabase/clients/browser.client';
import { Database } from '@/types/supabase/core.types';
import { useThrottle } from '@/hooks/useThrottle';
import { useDebounce } from '@/hooks/useDebounce';

type Profile = Database['core']['Tables']['profiles']['Row'];
type Company = Database['core']['Tables']['companies']['Row'];

// Мемоизированный компонент для вкладки профиля
const ProfileTab = memo(({
  user,
  formData,
  setFormData,
  avatarUrl,
  handleAvatarUpload,
  isUploading,
  fileInputRef,
  error
}: any) => (
  <div className="space-y-8 animate-fade-in">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div className="space-y-6">
        <div className="relative group w-40 h-40 mx-auto md:mx-0">
          <div className="w-full h-full rounded-sm bg-slate-100 border-2 border-slate-200 overflow-hidden relative">
            <img
              src={avatarUrl}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              alt="Avatar"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'User')}&background=0052FF&color=fff`;
              }}
            />
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="text-white" size={24} />
            </div>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-sm flex items-center justify-center">
              <Loader2 className="animate-spin text-white" size={24} />
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
            }}
          />
        </div>
        <div className="text-center md:text-left">
          <h4 className="text-lg font-black text-slate-900">{user.full_name}</h4>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
            {user.role} • {user.subscription_tier} tier
          </p>
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Hourly Rate ($)</label>
            <input
              type="number"
              value={formData.hourly_rate}
              onChange={(e) => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-sm">
            {error}
          </div>
        )}

        <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-sm flex items-start gap-4">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-sm"><Shield size={18} /></div>
          <div>
            <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Authority Level</p>
            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
              Your account has {user.role} permissions.
              All actions are logged to the neural immutable ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
));

ProfileTab.displayName = 'ProfileTab';

// Мемоизированный компонент для вкладки компании
const CompanyTab = memo(({
  company,
  companyFormData,
  setCompanyFormData,
  handleSaveCompany,
  isEditingCompany,
  setIsEditingCompany,
  isSaving,
  companyLoading
}: any) => {
  if (companyLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Company Header */}
      <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-900 p-8 rounded-sm text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-24 h-24 bg-white/10 rounded-sm border border-white/20 backdrop-blur-md flex items-center justify-center p-2 shrink-0">
          <Building2 size={40} className="text-white/40" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-4 justify-between">
            <div>
              <h3 className="text-2xl font-black tracking-tighter">
                {company?.name || 'No Company Registered'}
              </h3>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1">
                Managed Enterprise Entity
              </p>
            </div>
            {!isEditingCompany && (
              <button
                onClick={() => setIsEditingCompany(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-sm text-white text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Edit2 size={14} /> {company ? 'Edit' : 'Add'} Company
              </button>
            )}
          </div>
          <div className="flex gap-6 mt-4">
            <div className="text-center">
              <p className="text-xl font-black">{company?.industry || 'N/A'}</p>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Industry</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black">{company?.city ? `${company.city}, ${company.country}` : 'N/A'}</p>
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Location</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Form - Edit Mode or View Mode */}
      <div className="bg-white rounded-sm border border-slate-100 p-8">
        {isEditingCompany ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                {company ? 'Edit Company Information' : 'Register New Company'}
              </h4>
              <button
                onClick={() => setIsEditingCompany(false)}
                className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Entity Name *</label>
                <input
                  type="text"
                  value={companyFormData.name}
                  onChange={(e) => setCompanyFormData((prev: any) => ({ ...prev, name: e.target.value }))}
                  placeholder="Company Name"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tax ID / Registration</label>
                <input
                  type="text"
                  value={companyFormData.tax_id}
                  onChange={(e) => setCompanyFormData((prev: any) => ({ ...prev, tax_id: e.target.value }))}
                  placeholder="Tax ID"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Industry</label>
                <input
                  type="text"
                  value={companyFormData.industry}
                  onChange={(e) => setCompanyFormData((prev: any) => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., Logistics, Technology, Manufacturing"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                <input
                  type="email"
                  value={companyFormData.email}
                  onChange={(e) => setCompanyFormData((prev: any) => ({ ...prev, email: e.target.value }))}
                  placeholder="company@example.com"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                <input
                  type="tel"
                  value={companyFormData.phone}
                  onChange={(e) => setCompanyFormData((prev: any) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Street Address</label>
                <input
                  type="text"
                  value={companyFormData.address}
                  onChange={(e) => setCompanyFormData((prev: any) => ({ ...prev, address: e.target.value }))}
                  placeholder="Address"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">City</label>
                <input
                  type="text"
                  value={companyFormData.city}
                  onChange={(e) => setCompanyFormData((prev: any) => ({ ...prev, city: e.target.value }))}
                  placeholder="City"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Country</label>
                <input
                  type="text"
                  value={companyFormData.country}
                  onChange={(e) => setCompanyFormData((prev: any) => ({ ...prev, country: e.target.value }))}
                  placeholder="Country"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Website</label>
                <input
                  type="url"
                  value={companyFormData.website}
                  onChange={(e) => setCompanyFormData((prev: any) => ({ ...prev, website: e.target.value }))}
                  placeholder="https://example.com"
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] transition-all"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSaveCompany}
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                {isSaving ? 'Saving...' : 'Save Company Information'}
              </button>
              <button
                onClick={() => setIsEditingCompany(false)}
                className="px-8 py-4 bg-slate-100 text-slate-600 rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            {company ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block mb-2">Entity Name</label>
                  <p className="text-sm font-bold text-slate-900">{company.name}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block mb-2">Tax ID</label>
                  <p className="text-sm font-bold text-slate-900">{company.tax_id || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block mb-2">Industry</label>
                  <p className="text-sm font-bold text-slate-900">{company.industry || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block mb-2">Email</label>
                  <p className="text-sm font-bold text-slate-900">{company.email || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block mb-2">Phone</label>
                  <p className="text-sm font-bold text-slate-900">{company.phone || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block mb-2">Website</label>
                  <p className="text-sm font-bold text-slate-900">{company.website || 'Not specified'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 block mb-2">Address</label>
                  <p className="text-sm font-bold text-slate-900">
                    {company.address ? `${company.address}, ${company.city}, ${company.country}` : 'Not specified'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Building2 size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 mb-4">No company registered yet</p>
                <button
                  onClick={() => setIsEditingCompany(true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                >
                  Register Company
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

CompanyTab.displayName = 'CompanyTab';

const AccountView: React.FC<AccountViewProps> = ({ lang = 'en' }) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'company' | 'security' | 'notifications'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);

  const { user: storeUser, isLoading: authLoading, logout, updateUser } = useAuthStore();
  const [user, setUser] = useState(storeUser);
  const [company, setCompany] = useState<Company | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);

  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    department: '',
    hourly_rate: '',
  });

  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: '',
    email: '',
    phone: '',
    tax_id: '',
    website: '',
    industry: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (storeUser) {
      setUser(storeUser);
      setAvatarPreview(storeUser.avatar_url);
      setFormData({
        full_name: storeUser.full_name || '',
        username: storeUser.username || '',
        email: storeUser.email || '',
        department: storeUser.department || '',
        hourly_rate: storeUser.hourly_rate?.toString() || '',
      });
    }
  }, [storeUser]);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = useCallback(async () => {
    setCompanyLoading(true);
    try {
      const client = browserClient.getClient();
      const { data, error } = await client
        .from('companies')
        .select('*')
        .eq('is_own_company', true)
        .maybeSingle();

      if (error) {
        console.error('Company load error:', error);
        return;
      }

      if (data) {
        setCompany(data);
        setCompanyFormData({
          name: data.name || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          email: data.email || '',
          phone: data.phone || '',
          tax_id: data.tax_id || '',
          website: data.website || '',
          industry: data.industry || '',
        });
      }
    } catch (err) {
      console.error('Error loading company:', err);
    } finally {
      setCompanyLoading(false);
    }
  }, []);

  const handleSaveCompany = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      const client = browserClient.getClient();

      const companyData = {
        name: companyFormData.name,
        address: companyFormData.address,
        city: companyFormData.city,
        country: companyFormData.country,
        email: companyFormData.email,
        phone: companyFormData.phone,
        tax_id: companyFormData.tax_id || null,
        website: companyFormData.website || null,
        industry: companyFormData.industry || null,
        is_own_company: true,
      };

      let result;
      if (company) {
        const { data, error } = await client
          .from('companies')
          .update(companyData)
          .eq('id', company.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await client
          .from('companies')
          .insert(companyData)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      setCompany(result);
      alert('Company information saved successfully');
      setIsEditingCompany(false);
    } catch (err: any) {
      console.error('Error saving company:', err);
      setError(err.message || 'Error saving company information');
    } finally {
      setIsSaving(false);
    }
  }, [company, companyFormData]);

  const handleSave = useCallback(async () => {
    if (!user) return;

    setIsSaving(true);
    setError(null);
    try {
      const client = browserClient.getClient();

      const updates = {
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        department: formData.department,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : null,
      };

      const { error: updateError } = await client
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (updateError) throw updateError;

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      updateUser(updatedUser);

      alert('Profile updated successfully');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setError(error?.message || 'Error saving profile');
    } finally {
      setIsSaving(false);
    }
  }, [user, formData, updateUser]);

  const handleAvatarUpload = useCallback(async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const client = browserClient.getClient();

      const { error: uploadError } = await client
        .storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = client
        .storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await client
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarPreview(publicUrl);
      const updatedUser = { ...user, avatar_url: publicUrl };
      setUser(updatedUser);
      updateUser(updatedUser);

      alert('Avatar updated successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      alert(error?.message || 'Error uploading avatar');
    } finally {
      setIsUploading(false);
    }
  }, [user, updateUser]);

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [logout]);

  const setActiveSubTabThrottled = useThrottle(setActiveSubTab, 150);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-slate-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <div className="text-center">
          <p className="text-amber-600 mb-4">No user data available</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-sm"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  const avatarUrl = avatarPreview || user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.username || 'User')}&background=0052FF&color=fff&bold=true&size=160`;

  const renderSubTab = () => {
    switch (activeSubTab) {
      case 'profile':
        return (
          <ProfileTab
            user={user}
            formData={formData}
            setFormData={setFormData}
            avatarUrl={avatarUrl}
            handleAvatarUpload={handleAvatarUpload}
            isUploading={isUploading}
            fileInputRef={fileInputRef}
            error={error}
          />
        );
      case 'company':
        return (
          <CompanyTab
            company={company}
            companyFormData={companyFormData}
            setCompanyFormData={setCompanyFormData}
            handleSaveCompany={handleSaveCompany}
            isEditingCompany={isEditingCompany}
            setIsEditingCompany={setIsEditingCompany}
            isSaving={isSaving}
            companyLoading={companyLoading}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-slate-500">
            <p>Coming soon...</p>
          </div>
        );
    }
  };

  const tabButtons = [
    { id: 'profile', label: 'User Profile', icon: <User size={18} /> },
    { id: 'company', label: 'Corporate Entity', icon: <Building2 size={18} /> },
    { id: 'security', label: 'Access Protocols', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'System Alerts', icon: <Bell size={18} /> },
  ] as const;

  return (
    <div className="flex flex-col gap-8 h-[calc(100vh-140px)] animate-fade-in overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Terminal Settings</h2>
           <p className="text-sm font-medium text-slate-400">Calibrating personnel profile and corporate hub metrics</p>
        </div>
        {activeSubTab === 'profile' && (
          <div className="flex items-center gap-4">
             <button
               onClick={handleSave}
               disabled={isSaving}
               className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white rounded-sm font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-70 min-w-[200px] justify-center"
             >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Commit Configuration</>}
             </button>
          </div>
        )}
      </div>

      <div className="flex-1 bg-white/60 backdrop-blur-3xl rounded-sm border border-white/60 shadow-2xl flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-72 bg-slate-50/50 border-r border-slate-100 flex flex-col p-8 gap-1 shrink-0">
          {tabButtons.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTabThrottled(tab.id)}
              className={`flex items-center justify-between p-4 rounded-sm transition-all group ${
                activeSubTab === tab.id ? 'bg-white text-blue-600 shadow-xl ring-1 ring-slate-100' : 'text-slate-500 hover:bg-white hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${activeSubTab === tab.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`}>{tab.icon}</span>
                <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
              </div>
              <ChevronRight size={14} className={`transition-all ${activeSubTab === tab.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
            </button>
          ))}

          <div className="mt-auto pt-8 border-t border-slate-100">
             <button
               onClick={handleSignOut}
               className="w-full flex items-center gap-3 p-4 text-rose-500 hover:bg-rose-50 rounded-sm transition-all group"
             >
                <LogOut size={18} />
                <span className="text-[11px] font-black uppercase tracking-widest">Terminate Session</span>
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10 bg-white/20">
           {renderSubTab()}
        </div>
      </div>
    </div>
  );
};

export default React.memo(AccountView);