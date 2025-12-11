import React, { useState } from 'react';
import { Cake, Heart, Baby, Sparkles, Building2, Flame, CalendarHeart, PartyPopper, Globe2, Flower2 } from 'lucide-react';

interface EventSelectionProps {
  onSelect: (eventType: string) => void;
  onBack: () => void;
}

const EVENTS = [
  { id: 'Birthday', label: 'Birthday Party', icon: Cake, color: 'bg-pink-100 text-pink-600' },
  { id: 'Wedding/Engagement', label: 'Wedding / Engagement', icon: Heart, color: 'bg-red-100 text-red-600' },
  { id: 'Anniversary', label: 'Anniversary', icon: CalendarHeart, color: 'bg-rose-100 text-rose-600' },
  { id: 'Baby Shower', label: 'Baby Shower', icon: Baby, color: 'bg-blue-100 text-blue-600' },
  { id: 'Memorial', label: 'Memorial / Remembrance', icon: Flower2, color: 'bg-slate-100 text-slate-600' },
  { id: 'Cultural Festival', label: 'Cultural / Festival', icon: Flame, color: 'bg-orange-100 text-orange-600' },
  { id: 'House Warming', label: 'House Warming', icon: Sparkles, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'Corporate', label: 'Office / Corporate', icon: Building2, color: 'bg-gray-100 text-gray-600' },
  { id: 'Date Night', label: 'Romantic Date Night', icon: Heart, color: 'bg-purple-100 text-purple-600' },
  { id: 'Get Together', label: 'Casual Get Together', icon: PartyPopper, color: 'bg-green-100 text-green-600' },
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
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">What's the Occasion?</h2>
        <p className="text-slate-600">Select the type of event you are planning.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {EVENTS.map((evt) => (
          <button
            key={evt.id}
            onClick={() => onSelect(evt.id)}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-500 hover:shadow-md transition-all group h-32"
          >
            <div className={`p-3 rounded-full mb-3 ${evt.color} group-hover:scale-110 transition-transform`}>
              <evt.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold text-slate-700 text-center">{evt.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-xl mx-auto">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">
          Or describe your specific event
        </h3>
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <div className="relative flex-grow">
            <Globe2 className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              placeholder="e.g. Diwali, Christmas, Retirement, Graduation..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <button 
            type="submit"
            disabled={!customEvent.trim()}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 text-sm font-medium px-4 py-2"
        >
          ← Back to Upload
        </button>
      </div>
    </div>
  );
};