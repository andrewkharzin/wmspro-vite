import React, { useState } from 'react';
import {
  Shield, Lock, Mail, User, ArrowRight, Sparkles,
  Building2, Fingerprint, Zap, ChevronRight, AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';

interface AuthPagesProps {
  onLogin?: (role: string, tier: string) => void;
  onSuccess?: () => void;
}

const DEMO_ACCOUNTS = [
  { id: 'admin', label: 'Admin Terminal', role: 'admin', tier: 'enterprise', color: 'blue', email: 'admin@nexusgrid.ai', password: 'Admin123!', name: 'Admin User' },
  { id: 'manager', label: 'Hub Manager', role: 'manager', tier: 'pro', color: 'purple', email: 'manager@nexusgrid.ai', password: 'Manager123!', name: 'Manager User' },
  { id: 'staff', label: 'Field Operator', role: 'staff', tier: 'free', color: 'emerald', email: 'staff@nexusgrid.ai', password: 'Staff123!', name: 'Staff User' },
];

const AuthPages: React.FC<AuthPagesProps> = ({ onLogin, onSuccess }) => {
  const { login, isLoading: authLoading } = useAuthStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Neural credentials required for grid access.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);

      if (success) {
        const { user } = useAuthStore.getState();
        const role = user?.role || 'staff';
        const tier = user?.subscription_tier || 'free';

        if (onLogin) {
          onLogin(role, tier);
        } else if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = `/dashboard/${role}`;
        }
      } else {
        setError('Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName || !username) {
      setError('All fields are required for neural registration.');
      return;
    }

    if (password.length < 6) {
      setError('Encryption key must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { signup } = useAuthStore.getState();
      await signup(email, password, username, fullName);

      alert('Registration successful! You can now sign in.');

      setMode('signin');
      setEmail('');
      setPassword('');
      setFullName('');
      setUsername('');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoAccount: typeof DEMO_ACCOUNTS[0]) => {
    setLoading(true);
    setError('');

    try {
      const success = await login(demoAccount.email, demoAccount.password);

      if (success) {
        const { user } = useAuthStore.getState();
        const role = user?.role || demoAccount.role;
        const tier = user?.subscription_tier || demoAccount.tier;

        if (onLogin) {
          onLogin(role, tier);
        } else if (onSuccess) {
          onSuccess();
        } else {
          window.location.href = `/dashboard/${role}`;
        }
      } else {
        setError('Demo login failed. Please try again.');
      }
    } catch (err: any) {
      setError('Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = mode === 'signin' ? handleSignIn : handleSignUp;

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col md:flex-row relative overflow-hidden font-opensans">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/[0.03] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/[0.03] blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #0052FF 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Left Panel: Aesthetic Sidebar */}
      <div className="w-full md:w-[40%] bg-slate-950 p-12 md:p-24 flex flex-col justify-between relative overflow-hidden shrink-0 shadow-2xl z-20">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-600/30 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 bg-[#0052FF] rounded-sm flex items-center justify-center font-black text-3xl text-white shadow-2xl shadow-blue-500/20">N</div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tighter font-montserrat">Nexus<span className="text-blue-500">AI</span></h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Neural Supply Grid</p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
           <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter font-montserrat uppercase">
                 Optimize<br/>The <span className="text-blue-500">Global</span><br/>Network.
              </h2>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-sm">
                 Connecting 2,400+ industrial nodes through neural-synced logistics.
              </p>
           </div>

           <div className="grid grid-cols-2 gap-4 pt-12">
              <div className="p-6 bg-white/5 rounded-sm border border-white/10 backdrop-blur-md">
                 <p className="text-2xl font-black text-white font-roboto">99.8%</p>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Uptime SLA</p>
              </div>
              <div className="p-6 bg-white/5 rounded-sm border border-white/10 backdrop-blur-md">
                 <p className="text-2xl font-black text-white font-roboto">12ms</p>
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Grid Latency</p>
              </div>
           </div>
        </div>

        <div className="relative z-10 pt-12">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Shield size={14} className="text-blue-500" /> Secure Terminal Encryption Active
          </p>
        </div>
      </div>

      {/* Right Panel: The Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-24 relative z-10">
        <div className="w-full max-w-md space-y-12 animate-fade-in">

          <div className="space-y-2">
            <div className="flex bg-slate-100 p-1.5 rounded-sm border border-slate-200 w-fit mb-6">
              <button
                onClick={() => {
                  setMode('signin');
                  setError('');
                }}
                className={`px-8 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'signin' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode('signup');
                  setError('');
                }}
                className={`px-8 py-2.5 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'signup' ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Sign Up
              </button>
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter font-montserrat uppercase">
               {mode === 'signin' ? 'Welcome Back, Admin' : 'Register Node Access'}
            </h3>
            <p className="text-sm font-medium text-slate-400">
               {mode === 'signin' ? 'Provide your encrypted credentials to access the terminal.' : 'Apply for a neural-synced distribution account.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-sm flex items-center gap-3 animate-slide-down">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-ui">Personnel Identifier</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full pl-12 pr-6 py-5 bg-white border border-slate-100 rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] focus:border-blue-500/30 shadow-sm transition-all"
                      disabled={loading || authLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-ui">Username</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="w-full pl-12 pr-6 py-5 bg-white border border-slate-100 rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] focus:border-blue-500/30 shadow-sm transition-all"
                      disabled={loading || authLoading}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-ui">Network Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexus-grid.ai"
                  className="w-full pl-12 pr-6 py-5 bg-white border border-slate-100 rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] focus:border-blue-500/30 shadow-sm transition-all font-roboto"
                  disabled={loading || authLoading}
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 font-ui">Encryption Key</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-6 py-5 bg-white border border-slate-100 rounded-sm font-bold text-sm outline-none focus:ring-8 focus:ring-blue-500/[0.03] focus:border-blue-500/30 shadow-sm transition-all font-roboto"
                  disabled={loading || authLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || authLoading}
              className="w-full py-6 bg-slate-950 text-white rounded-sm font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(loading || authLoading) ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Initialize Grid Sync <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo Presets Section */}
          <div className="pt-12 border-t border-slate-100">
             <div className="flex items-center gap-2 mb-6">
                <Sparkles size={16} className="text-amber-500" />
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-ui">Neural Presets (Demo Access)</h4>
             </div>
             <div className="grid grid-cols-1 gap-3">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.id}
                    onClick={() => handleDemoLogin(acc)}
                    disabled={loading || authLoading}
                    className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-sm hover:border-blue-200 group transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-4">
                       <div className={`p-2 rounded-sm ${acc.id === 'admin' ? 'bg-blue-50 text-blue-600' : acc.id === 'manager' ? 'bg-purple-50 text-purple-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {acc.id === 'admin' ? <Fingerprint size={16} /> : acc.id === 'manager' ? <Building2 size={16} /> : <Zap size={16} />}
                       </div>
                       <div className="text-left">
                          <p className="text-xs font-black text-slate-900 font-ui uppercase tracking-tight">{acc.label}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{acc.tier} Access Level</p>
                       </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;