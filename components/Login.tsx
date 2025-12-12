import React, { useState } from 'react';
import { User, Mail, Sparkles, ArrowRight, Star } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginProps {
  onLogin: (profile: UserProfile) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Homeowner');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      onLogin({
        name,
        email,
        role,
        avatarInitials: initials,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-2xl shadow-lg shadow-violet-500/30 mb-6">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-heading font-bold text-slate-900 mb-2">
            Create Your Profile
          </h1>
          <p className="text-slate-600">
            Join LuminaDecor to start styling your events with AI.
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl shadow-xl backdrop-blur-md border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-bold text-slate-700 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full pl-12 pr-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-slate-800 placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-slate-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aditi@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-slate-800 placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                I am a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Homeowner', 'Event Planner', 'Student', 'Just Browsing'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      role === r
                        ? 'bg-violet-600 text-white border-violet-600 shadow-md transform scale-[1.02]'
                        : 'bg-white/50 text-slate-600 border-slate-200 hover:bg-white hover:border-violet-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              Start Styling <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Trusted by 10,000+ Decorators in India</span>
          </div>
        </div>
      </div>
    </div>
  );
};