
import React, { useState } from 'react';
import { User, Shield, Search, MoreVertical, Mail, UserPlus, Filter, Crown, CheckCircle, XCircle } from 'lucide-react';
import { MOCK_PROFILES } from '../lib/constants';
import { Profile } from '../lib/types';

const UsersView: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>(MOCK_PROFILES);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'seller': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'buyer': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/40 flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <User className="text-blue-600" size={24} />
            User Management
          </h2>
          <p className="text-slate-500 text-sm">Control system access and user permissions</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search name, email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
           </div>
           <select 
             value={roleFilter}
             onChange={(e) => setRoleFilter(e.target.value)}
             className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
           >
             <option value="all">All Roles</option>
             <option value="admin">Admins</option>
             <option value="manager">Managers</option>
             <option value="seller">Sellers</option>
             <option value="buyer">Buyers</option>
           </select>
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all">
              <UserPlus size={18} />
              Invite
           </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tier</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Active</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/20">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar_url} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={user.full_name} />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{user.full_name}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                         <Mail size={12} />
                         {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border ${getRoleBadge(user.role)}`}>
                      {user.role}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                      {user.subscription_tier === 'enterprise' && <Crown size={14} className="text-amber-500" />}
                      <span className="capitalize">{user.subscription_tier}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                   {user.last_active}
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-1.5 text-xs">
                      {user.status === 'active' ? (
                        <CheckCircle size={14} className="text-emerald-500" />
                      ) : (
                        <XCircle size={14} className="text-red-500" />
                      )}
                      <span className={`font-bold capitalize ${user.status === 'active' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {user.status}
                      </span>
                   </div>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                      <MoreVertical size={18} />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="py-20 text-center text-slate-400">
             <Search size={48} className="mx-auto mb-4 opacity-10" />
             <p className="text-lg font-medium">No users found match your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersView;
