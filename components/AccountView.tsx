// components/AccountView.tsx - Премиум версия
import React, { useState, useRef, useEffect } from 'react';
import {
  User, Building2, Shield, Bell, Camera, Save,
  LogOut, ChevronRight, Mail, Loader2, Edit2, X, Check,
  Globe, Phone, MapPin, Briefcase, DollarSign, Calendar,
  Award, Zap, Star, TrendingUp, Users, Clock, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useProfileData } from '@/hooks/useProfileData';
import { useCompanyData } from '@/hooks/useCompanyData';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } }
};

const AccountView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'company'>('profile');
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [companyForm, setCompanyForm] = useState({
    name: '', address: '', city: '', country: '',
    email: '', phone: '', tax_id: '', website: '', industry: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { user: authUser, logout } = useAuthStore();
  const { profile, loading: profileLoading, updateProfile, uploadAvatar } = useProfileData(authUser?.id);
  const { company, loading: companyLoading, saveCompany } = useCompanyData();

  const [formData, setFormData] = useState({
    full_name: '', username: '', email: '', department: '', hourly_rate: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
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

  useEffect(() => {
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

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await updateProfile({
      full_name: formData.full_name,
      username: formData.username,
      department: formData.department,
      hourly_rate: parseFloat(formData.hourly_rate) || null,
    });
    setIsSaving(false);
    showSuccessMessage('Profile updated successfully');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    await uploadAvatar(file);
    setIsUploading(false);
    showSuccessMessage('Avatar updated successfully');
  };

  const handleSaveCompany = async () => {
    setIsSaving(true);
    await saveCompany(companyForm);
    setIsEditingCompany(false);
    setIsSaving(false);
    showSuccessMessage('Company information saved successfully');
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-140px)]">
        <div className="text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-slate-500 text-sm">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const avatarUrl = profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'User')}&background=0052FF&color=fff&bold=true&size=160`;

  // Статистика профиля
  const profileStats = [
    { label: 'Member Since', value: new Date(profile.created_at || Date.now()).toLocaleDateString(), icon: Calendar },
    { label: 'Role Level', value: profile.role?.toUpperCase(), icon: Award, color: 'text-purple-600' },
    { label: 'Tier', value: profile.subscription_tier?.toUpperCase(), icon: Star, color: 'text-amber-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8 h-[calc(100vh-140px)] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50"
    >
      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-2"
          >
            <Check size={18} />
            <span className="text-sm font-medium">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            Terminal Settings
          </h2>
          <p className="text-sm text-slate-400 mt-1">Manage your profile and corporate hub metrics</p>
        </div>
        {activeTab === 'profile' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveProfile}
            disabled={isSaving}
            className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        )}
      </motion.div>

      {/* Main Container */}
      <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-2xl shadow-slate-200/50 flex overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/50 p-6 space-y-2"
        >
          <div className="mb-6 px-4">
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Navigation</p>
          </div>

          {[
            { id: 'profile', label: 'User Profile', icon: User, description: 'Personal information' },
            { id: 'company', label: 'Corporate Entity', icon: Building2, description: 'Company details' },
          ].map(tab => (
            <motion.button
              key={tab.id}
              whileHover={{ x: 4 }}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full p-4 rounded-xl transition-all duration-300 text-left group ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-50 to-white shadow-lg shadow-blue-100/50 border border-blue-100'
                  : 'hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    <tab.icon size={18} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-slate-700'
                    }`}>
                      {tab.label}
                    </p>
                    <p className="text-[10px] text-slate-400">{tab.description}</p>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className={`transition-all duration-300 ${
                    activeTab === tab.id ? 'opacity-100 translate-x-0 text-blue-600' : 'opacity-0 -translate-x-2'
                  }`}
                />
              </div>
            </motion.button>
          ))}

          <div className="pt-8 mt-8 border-t border-slate-200/50">
            <motion.button
              whileHover={{ x: 4 }}
              onClick={logout}
              className="w-full flex items-center gap-3 p-4 text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
            >
              <div className="p-2 rounded-lg bg-rose-50 text-rose-500 group-hover:bg-rose-100">
                <LogOut size={18} />
              </div>
              <span className="text-sm font-bold">Terminate Session</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                {...fadeInUp}
                className="p-8 space-y-8"
              >
                {/* Profile Header Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-1">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-slate-800">
                          <img
                            src={avatarUrl}
                            className="w-full h-full object-cover"
                            alt="Avatar"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 p-2.5 bg-blue-500 rounded-xl shadow-lg hover:bg-blue-600 transition-all"
                      >
                        <Camera size={14} className="text-white" />
                      </button>
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center">
                          <Loader2 className="animate-spin text-white" size={24} />
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </div>

                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-black">{profile.full_name}</h3>
                      <p className="text-blue-400 text-sm mt-1">@{profile.username}</p>
                      <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold">
                          {profile.role?.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-bold">
                          {profile.subscription_tier?.toUpperCase()} TIER
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profileStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg bg-slate-50 ${stat.color || 'text-blue-600'}`}>
                          <stat.icon size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                          <p className="text-sm font-bold text-slate-800">{stat.value}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Profile Form */}
                <motion.div variants={fadeInUp} className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                  <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <User size={20} className="text-blue-600" />
                    Personal Information
                  </h4>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Username</label>
                      <input
                        type="text"
                        value={formData.username}
                        onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Department</label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={e => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hourly Rate</label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="number"
                          value={formData.hourly_rate}
                          onChange={e => setFormData(prev => ({ ...prev, hourly_rate: e.target.value }))}
                          className="w-full pl-10 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={formData.email}
                          readOnly
                          className="w-full pl-12 pr-5 py-3.5 bg-slate-100 border border-slate-200 rounded-xl font-medium text-sm text-slate-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Authority Info */}
                  <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-blue-900">Authority Level: {profile.role?.toUpperCase()}</p>
                        <p className="text-xs text-blue-700 mt-1">
                          Your account has {profile.role} override permissions. All actions are logged to the neural immutable ledger.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'company' && (
              <motion.div
                key="company"
                {...fadeInUp}
                className="p-8 space-y-6"
              >
                {companyLoading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                  </div>
                ) : (
                  <>
                    {/* Company Header */}
                    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
                      <div className="relative z-10 flex justify-between items-center flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Building2 size={32} className="text-white/60" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black">{company?.name || 'No Company Registered'}</h3>
                            <p className="text-blue-400 text-sm mt-1">Managed Enterprise Entity</p>
                          </div>
                        </div>
                        {!isEditingCompany && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsEditingCompany(true)}
                            className="px-5 py-2.5 bg-white/10 rounded-xl text-sm font-bold hover:bg-white/20 transition-all flex items-center gap-2"
                          >
                            <Edit2 size={14} /> {company ? 'Edit Company' : 'Add Company'}
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Company Content */}
                    {isEditingCompany ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm"
                      >
                        <div className="flex justify-between items-center mb-6">
                          <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <Building2 size={20} className="text-blue-600" />
                            {company ? 'Edit Company Information' : 'Register New Company'}
                          </h4>
                          <button
                            onClick={() => setIsEditingCompany(false)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <X size={18} className="text-slate-400" />
                          </button>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Company Name *</label>
                            <input
                              value={companyForm.name}
                              onChange={e => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Enter company name"
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tax ID</label>
                            <input
                              value={companyForm.tax_id}
                              onChange={e => setCompanyForm(prev => ({ ...prev, tax_id: e.target.value }))}
                              placeholder="Enter tax ID"
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Industry</label>
                            <input
                              value={companyForm.industry}
                              onChange={e => setCompanyForm(prev => ({ ...prev, industry: e.target.value }))}
                              placeholder="e.g., Technology, Logistics"
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Email</label>
                            <input
                              type="email"
                              value={companyForm.email}
                              onChange={e => setCompanyForm(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="company@example.com"
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Phone</label>
                            <input
                              value={companyForm.phone}
                              onChange={e => setCompanyForm(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+1 (555) 000-0000"
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Website</label>
                            <input
                              value={companyForm.website}
                              onChange={e => setCompanyForm(prev => ({ ...prev, website: e.target.value }))}
                              placeholder="https://example.com"
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Address</label>
                            <input
                              value={companyForm.address}
                              onChange={e => setCompanyForm(prev => ({ ...prev, address: e.target.value }))}
                              placeholder="Street address"
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">City</label>
                            <input
                              value={companyForm.city}
                              onChange={e => setCompanyForm(prev => ({ ...prev, city: e.target.value }))}
                              placeholder="City"
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Country</label>
                            <input
                              value={companyForm.country}
                              onChange={e => setCompanyForm(prev => ({ ...prev, country: e.target.value }))}
                              placeholder="Country"
                              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                          </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSaveCompany}
                            disabled={isSaving}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/25"
                          >
                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                            {isSaving ? 'Saving...' : 'Save Company'}
                          </motion.button>
                          <button
                            onClick={() => setIsEditingCompany(false)}
                            className="px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ) : company ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm"
                      >
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Briefcase size={12} /> Entity Name
                            </label>
                            <p className="text-base font-bold text-slate-800">{company.name}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <AlertCircle size={12} /> Tax ID
                            </label>
                            <p className="text-base text-slate-700">{company.tax_id || 'Not specified'}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <TrendingUp size={12} /> Industry
                            </label>
                            <p className="text-base text-slate-700">{company.industry || 'Not specified'}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Mail size={12} /> Email
                            </label>
                            <p className="text-base text-slate-700">{company.email || 'Not specified'}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Phone size={12} /> Phone
                            </label>
                            <p className="text-base text-slate-700">{company.phone || 'Not specified'}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <Globe size={12} /> Website
                            </label>
                            <p className="text-base text-slate-700">{company.website || 'Not specified'}</p>
                          </div>
                          <div className="md:col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <MapPin size={12} /> Address
                            </label>
                            <p className="text-base text-slate-700">
                              {company.address ? `${company.address}, ${company.city}, ${company.country}` : 'Not specified'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
                        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <Building2 size={40} className="text-slate-300" />
                        </div>
                        <p className="text-slate-500 mb-4">No company registered yet</p>
                        <button
                          onClick={() => setIsEditingCompany(true)}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                        >
                          Register Company
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountView;