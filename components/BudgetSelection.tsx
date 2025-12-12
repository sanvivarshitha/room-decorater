import React, { useState } from 'react';
import { IndianRupee, Wallet, ArrowRight } from 'lucide-react';

interface BudgetSelectionProps {
  onSelect: (budget: string) => void;
  onBack: () => void;
}

const BUDGET_RANGES = [
  { id: 'Budget (< ₹2,000)', label: 'Under ₹2,000', desc: 'DIY & Wallet Friendly', color: 'border-green-200 hover:border-green-500 bg-green-50/50' },
  { id: 'Economy (₹2,000 - ₹5,000)', label: '₹2,000 - ₹5,000', desc: 'Simple & Elegant', color: 'border-blue-200 hover:border-blue-500 bg-blue-50/50' },
  { id: 'Moderate (₹5,000 - ₹15,000)', label: '₹5,000 - ₹15,000', desc: 'Standard Celebration', color: 'border-indigo-200 hover:border-indigo-500 bg-indigo-50/50' },
  { id: 'Premium (₹15,000 - ₹50,000)', label: '₹15,000 - ₹50,000', desc: 'Grand Setup', color: 'border-purple-200 hover:border-purple-500 bg-purple-50/50' },
  { id: 'Luxury (₹50,000+)', label: '₹50,000+', desc: 'Ultimate Luxury', color: 'border-amber-200 hover:border-amber-500 bg-amber-50/50' },
];

export const BudgetSelection: React.FC<BudgetSelectionProps> = ({ onSelect, onBack }) => {
  const [customAmount, setCustomAmount] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAmount.trim()) {
      onSelect(`Approx ₹${customAmount}`);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">Set Your Budget</h2>
        <p className="text-slate-600 text-lg">We'll find the best items that fit your price range.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-12">
        {BUDGET_RANGES.map((range) => (
          <button
            key={range.id}
            onClick={() => onSelect(range.id)}
            className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all duration-300 text-left group hover:shadow-lg ${range.color} glass-panel`}
          >
            <div className="bg-white p-2.5 rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
               <Wallet className="w-6 h-6 text-slate-700" />
            </div>
            <span className="font-heading font-bold text-slate-800 text-xl group-hover:text-slate-900">{range.label}</span>
            <span className="text-sm text-slate-500 mt-2 font-medium">{range.desc}</span>
          </button>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-2xl shadow-sm max-w-xl mx-auto">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 text-center">
          Or enter a specific amount
        </h3>
        <form onSubmit={handleCustomSubmit} className="flex gap-3">
          <div className="relative flex-grow">
            <IndianRupee className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="e.g. 10000"
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-slate-800 placeholder:text-slate-400 shadow-inner"
            />
          </div>
          <button 
            type="submit"
            disabled={!customAmount.trim()}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
             Analyze <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="mt-10 text-center">
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 text-sm font-medium px-6 py-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          ← Back to Event
        </button>
      </div>
    </div>
  );
};