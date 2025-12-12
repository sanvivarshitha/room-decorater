
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
          <h2 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-violet-600" />
            Settings
          </h2>
          <p className="text-slate-500 mt-1">Manage your account and preferences</p>
        </div>
        <button 
          onClick={onBack}
          className="px-5 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 transition-colors font-medium text-sm"
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
                ? 'bg-white text-violet-700 shadow-md border border-violet-100' 
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <User className="w-5 h-5" /> Profile
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'app' 
                ? 'bg-white text-violet-700 shadow-md border border-violet-100' 
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Zap className="w-5 h-5" /> Preferences
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'data' 
                ? 'bg-white text-violet-700 shadow-md border border-violet-100' 
                : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Database className="w-5 h-5" /> Data & Storage
          </button>
          
          <div className="pt-4 mt-4 border-t border-slate-200/50">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          
          {/* PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div className="glass-panel p-8 rounded-2xl shadow-sm space-y-8 animate-fade-in">
              <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {user.avatarInitials}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{user.name}</h3>
                  <p className="text-slate-500">{user.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-violet-100 text-violet-700 text-xs font-bold rounded-full uppercase tracking-wide">
                    {user.role}
                  </span>
                </div>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Display Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Role / Profession</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all"
                    >
                      <option value="Homeowner">Homeowner</option>
                      <option value="Event Planner">Event Planner</option>
                      <option value="Interior Designer">Interior Designer</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-green-600 font-bold flex items-center gap-2" style={{ opacity: showSaveSuccess ? 1 : 0, transition: 'opacity 0.3s' }}>
                    <Check className="w-4 h-4" /> Profile Updated Successfully
                  </div>
                  <button
                    type="submit"
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* APP PREFERENCES */}
          {activeTab === 'app' && (
            <div className="glass-panel p-8 rounded-2xl shadow-sm space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Application Preferences</h3>

              {/* Toggle Item */}
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Notifications</h4>
                    <p className="text-xs text-slate-500">Get tips and trend alerts (Simulated)</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('enableNotifications')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.enableNotifications ? 'bg-violet-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.enableNotifications ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Save className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Auto-Save Projects</h4>
                    <p className="text-xs text-slate-500">Automatically save your analysis to history</p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleSetting('autoSave')}
                  className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoSave ? 'bg-violet-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoSave ? 'left-7' : 'left-1'}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-slate-100 opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Currency</h4>
                    <p className="text-xs text-slate-500">Locked to INR (₹) for Indian Market</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">FIXED</span>
              </div>
            </div>
          )}

          {/* DATA SETTINGS */}
          {activeTab === 'data' && (
            <div className="glass-panel p-8 rounded-2xl shadow-sm space-y-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Data & Privacy</h3>

              <div className="p-6 bg-red-50 border border-red-100 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-red-900 text-lg">Clear Project History</h4>
                    <p className="text-sm text-red-800/70 mt-1 mb-4">
                      This will permanently delete all your saved room analyses and generated themes from this browser. This action cannot be undone.
                    </p>
                    <button 
                      onClick={() => {
                        if(window.confirm('Are you sure you want to delete all history?')) {
                          onClearHistory();
                        }
                      }}
                      className="px-4 py-2 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-colors text-sm shadow-sm"
                    >
                      Delete All Data
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Shield className="w-5 h-5 text-slate-400" />
                   <div>
                      <h4 className="font-bold text-slate-700">Privacy Policy</h4>
                      <p className="text-xs text-slate-500">We do not store your photos on any server.</p>
                   </div>
                </div>
                <button className="text-violet-600 text-sm font-bold hover:underline">Read</button>
              </div>

               <div className="text-center pt-8">
                  <p className="text-xs text-slate-400 font-mono">LuminaDecor v1.0.2</p>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
