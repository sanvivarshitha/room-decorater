import React, { useState } from 'react';
import { Cake, Heart, Baby, Sparkles, Building2, Flame, CalendarHeart, PartyPopper, Globe2, Flower2, ArrowRight } from 'lucide-react';

interface EventSelectionProps {
  onSelect: (eventType: string) => void;
  onBack: () => void;
}

const EVENTS = [
  { id: 'Birthday', label: 'Birthday Party', icon: Cake, gradient: 'from-pink-500 to-rose-500' },
  { id: 'Wedding/Engagement', label: 'Wedding / Engagement', icon: Heart, gradient: 'from-red-500 to-pink-600' },
  { id: 'Anniversary', label: 'Anniversary', icon: CalendarHeart, gradient: 'from-purple-500 to-indigo-600' },
  { id: 'Baby Shower', label: 'Baby Shower', icon: Baby, gradient: 'from-blue-400 to-cyan-500' },
  { id: 'Memorial', label: 'Memorial', icon: Flower2, gradient: 'from-slate-500 to-slate-700' },
  { id: 'Cultural Festival', label: 'Cultural Festival', icon: Flame, gradient: 'from-orange-500 to-amber-500' },
  { id: 'House Warming', label: 'House Warming', icon: Sparkles, gradient: 'from-emerald-400 to-teal-600' },
  { id: 'Corporate', label: 'Office Event', icon: Building2, gradient: 'from-gray-600 to-gray-800' },
  { id: 'Date Night', label: 'Romantic Date', icon: Heart, gradient: 'from-fuchsia-600 to-purple-600' },
  { id: 'Get Together', label: 'Casual Party', icon: PartyPopper, gradient: 'from-lime-500 to-green-600' },
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
        <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">What's the Occasion?</h2>
        <p className="text-slate-600 text-lg">Select the type of event to get personalized themes.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-12">
        {EVENTS.map((evt) => (
          <button
            key={evt.id}
            onClick={() => onSelect(evt.id)}
            className="group relative flex flex-col items-center justify-center p-6 rounded-2xl glass-panel hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${evt.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className={`p-4 rounded-2xl mb-4 bg-gradient-to-br ${evt.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <evt.icon className="w-7 h-7" />
            </div>
            <span className="text-sm font-bold text-slate-700 text-center group-hover:text-slate-900">{evt.label}</span>
          </button>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-2xl shadow-sm max-w-2xl mx-auto">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
          Or describe your specific event
        </h3>
        <form onSubmit={handleCustomSubmit} className="flex gap-3">
          <div className="relative flex-grow">
            <Globe2 className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              placeholder="e.g. Diwali, Christmas, Retirement, Graduation..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-slate-800 placeholder:text-slate-400 shadow-inner"
            />
          </div>
          <button 
            type="submit"
            disabled={!customEvent.trim()}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="mt-10 text-center">
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 text-sm font-medium px-6 py-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          ← Back to Upload
        </button>
      </div>
    </div>
  );
};