
import React, { useState } from 'react';
import { Cake, Heart, Baby, Sparkles, Building2, Flame, CalendarHeart, PartyPopper, Globe2, Flower2, ArrowRight } from 'lucide-react';

interface EventSelectionProps {
  onSelect: (eventType: string) => void;
  onBack: () => void;
}

const EVENTS = [
  { id: 'Birthday', label: 'Birthday Party', icon: Cake, gradient: 'from-pink-600 to-rose-600' },
  { id: 'Wedding/Engagement', label: 'Wedding / Engagement', icon: Heart, gradient: 'from-red-600 to-pink-700' },
  { id: 'Anniversary', label: 'Anniversary', icon: CalendarHeart, gradient: 'from-purple-600 to-indigo-700' },
  { id: 'Baby Shower', label: 'Baby Shower', icon: Baby, gradient: 'from-blue-500 to-cyan-600' },
  { id: 'Memorial', label: 'Memorial', icon: Flower2, gradient: 'from-slate-600 to-slate-800' },
  { id: 'Cultural Festival', label: 'Cultural Festival', icon: Flame, gradient: 'from-orange-600 to-amber-600' },
  { id: 'House Warming', label: 'House Warming', icon: Sparkles, gradient: 'from-emerald-500 to-teal-700' },
  { id: 'Corporate', label: 'Office Event', icon: Building2, gradient: 'from-gray-700 to-gray-900' },
  { id: 'Date Night', label: 'Romantic Date', icon: Heart, gradient: 'from-fuchsia-600 to-purple-700' },
  { id: 'Get Together', label: 'Casual Party', icon: PartyPopper, gradient: 'from-lime-600 to-green-700' },
];

export const EventSelection: React.FC<EventSelectionProps> = ({ onSelect, onBack }) => {
  const [customEvent, setCustomEvent] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEvent.trim()) {
      onSelect(customEvent.trim());
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-white mb-4">What's the Occasion?</h2>
        <p className="text-slate-400 text-lg">Select the type of event to get personalized themes.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-12">
        {EVENTS.map((evt) => (
          <button
            key={evt.id}
            onClick={() => onSelect(evt.id)}
            className="group relative flex flex-col items-center justify-center p-6 rounded-2xl glass-panel hover:shadow-xl hover:shadow-violet-900/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-white/5 hover:border-violet-500/30"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${evt.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            
            <div className={`p-4 rounded-2xl mb-4 bg-gradient-to-br ${evt.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <evt.icon className="w-7 h-7" />
            </div>
            <span className="text-sm font-bold text-slate-300 text-center group-hover:text-white transition-colors">{evt.label}</span>
          </button>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-2xl shadow-sm max-w-2xl mx-auto border border-white/10">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 text-center">
          Or describe your specific event
        </h3>
        <form onSubmit={handleCustomSubmit} className="flex gap-3">
          <div className="relative flex-grow">
            <Globe2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              placeholder="e.g. Diwali, Christmas, Retirement, Graduation..."
              className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-white placeholder:text-slate-500 shadow-inner"
            />
          </div>
          <button 
            type="submit"
            disabled={!customEvent.trim()}
            className="px-8 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="mt-10 text-center">
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-white text-sm font-medium px-6 py-2 rounded-full hover:bg-slate-800 transition-colors"
        >
          ← Back to Upload
        </button>
      </div>
    </div>
  );
};
