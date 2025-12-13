
import React, { useState } from 'react';
import { UserProfile, UserSettings } from '../types';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  LogOut, 
  Check, 
  Moon, 
  Globe, 
  Zap, 
  Trash2, 
  Save,
  CreditCard
} from 'lucide-react';

interface SettingsViewProps {
  user: UserProfile;
  settings: UserSettings;
  onUpdateProfile: (profile: UserProfile) => void;
  onUpdateSettings: (settings: UserSettings) => void;
  onClearHistory: () => void;
  onLogout: () => void;
  onBack: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  user, 
  settings, 
  onUpdateProfile, 
  onUpdateSettings, 
  onClearHistory,
  onLogout,
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'app' | 'data'>('profile');
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    
    onUpdateProfile({ ...user, name, role, avatarInitials: initials });
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const toggleSetting = (key: keyof UserSettings) => {
    if (typeof settings[key] === 'boolean') {
      onUpdateSettings({ ...settings, [key]: !settings[key] });
    }
  };

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-violet-400" />
            Settings
          </h2>
          <p className="text-slate-400 mt-1">Manage your account and preferences</p>
        </div>
        <button 
          onClick={onBack}
          className="px-5 py-2 rounded-full border border-slate-700 text-slate-400 hover:bg-white hover:text-slate-900 transition-colors font-medium text-sm"
        >
          Close
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'profile' 
                ? 'bg-violet-900/30 text-white shadow-md border border-violet-500/30' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <User className="w-5 h-5" /> Profile
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'app' 
                ? 'bg-violet-900/30 text-white shadow-md border border-violet-500/30' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Zap className="w-5 h-5" /> Preferences
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'data' 
                ? 'bg-violet-900/30 text-white shadow-md border border-violet-500/30' 
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Database className="w-5 h-5" /> Data & Storage
          </button>
          
          <div className="pt-4 mt-4 border-t border-white/10">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          
          {/* PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="glass-panel p-8 rounded-2xl shadow-sm space-y-8 animate-fade-in border border-white/10">
              <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg border border-white/10">
                  {user.avatarInitials}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{user.name}</h3>
                  <p className="text-slate-400">{user.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-violet-900/40 text-violet-300 text-xs font-bold rounded-full uppercase tracking-wide border border-violet-500/30">
                    {user.role}
                  </span>
                </div>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-300">Role / Profession</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all text-white"
                    >
                      <option value="Homeowner">Homeowner</option>
                      <option value="Event Planner">Event Planner</option>
                      <option value="Interior Designer">Interior Designer</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-green-400 font-bold flex items-center gap-2" style={{ opacity: showSaveSuccess ? 1 : 0, transition: 'opacity 0.3s' }}>
                    <Check className="w-4 h-4" /> Profile Updated Successfully
                  </div>
                  <button
                    type="submit"
                    className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold hover:bg-violet-200 transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* APP PREFERENCES */}
          {activeTab === 'app' && (
            <div className="glass-panel p-8 rounded-2xl shadow-sm space-y-6 animate-fade-in border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Application Preferences</h3>

              {/* Toggle Item */}
              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-900/30 text-blue-400 rounded-lg border border-blue-500/30">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">Notifications</h4>
                    <p className="text-xs text-slate-500">Get tips and trend alerts (Simulated)</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('enableNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.enableNotifications ? 'bg-violet-600' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.enableNotifications ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-900/30 text-emerald-400 rounded-lg border border-emerald-500/30">
                    <Save className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">Auto-Save Projects</h4>
                    <p className="text-xs text-slate-500">Automatically save your analysis to history</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('autoSave')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoSave ? 'bg-violet-600' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoSave ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-white/5 opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-amber-900/30 text-amber-400 rounded-lg border border-amber-500/30">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200">Currency</h4>
                    <p className="text-xs text-slate-500">Locked to INR (₹) for Indian Market</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">FIXED</span>
              </div>
            </div>
          )}

          {/* DATA SETTINGS */}
          {activeTab === 'data' && (
            <div className="glass-panel p-8 rounded-2xl shadow-sm space-y-6 animate-fade-in border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Data & Privacy</h3>

              <div className="p-6 bg-red-900/10 border border-red-500/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-900/30 text-red-400 rounded-lg border border-red-500/30">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-red-400 text-lg">Clear Project History</h4>
                    <p className="text-sm text-red-300/70 mt-1 mb-4">
                      This will permanently delete all your saved room analyses and generated themes from this browser. This action cannot be undone.
                    </p>
                    <button 
                      onClick={() => {
                        if(window.confirm('Are you sure you want to delete all history?')) {
                          onClearHistory();
                        }
                      }}
                      className="px-4 py-2 bg-transparent border border-red-500/50 text-red-400 font-bold rounded-lg hover:bg-red-500 hover:text-white transition-colors text-sm shadow-sm"
                    >
                      Delete All Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900/50 border border-white/5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Shield className="w-5 h-5 text-slate-400" />
                   <div>
                      <h4 className="font-bold text-slate-200">Privacy Policy</h4>
                      <p className="text-xs text-slate-500">We do not store your photos on any server.</p>
                   </div>
                </div>
                <button className="text-violet-400 text-sm font-bold hover:underline">Read</button>
              </div>

               <div className="text-center pt-8">
                  <p className="text-xs text-slate-600 font-mono">LuminaDecor v1.0.2</p>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
