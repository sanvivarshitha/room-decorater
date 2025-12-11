import React, { useState } from 'react';
import { IndianRupee, Wallet } from 'lucide-react';

interface BudgetSelectionProps {
  onSelect: (budget: string) => void;
  onBack: () => void;
}

const BUDGET_RANGES = [
  { id: 'Budget (< ₹2,000)', label: 'Under ₹2,000', desc: 'DIY & Budget Friendly' },
  { id: 'Economy (₹2,000 - ₹5,000)', label: '₹2,000 - ₹5,000', desc: 'Simple & Elegant' },
  { id: 'Moderate (₹5,000 - ₹15,000)', label: '₹5,000 - ₹15,000', desc: 'Standard Celebration' },
  { id: 'Premium (₹15,000 - ₹50,000)', label: '₹15,000 - ₹50,000', desc: 'Grand Setup' },
  { id: 'Luxury (₹50,000+)', label: '₹50,000+', desc: 'Luxury Experience' },
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
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">Set Your Budget</h2>
        <p className="text-slate-600">How much would you like to spend on decorations?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {BUDGET_RANGES.map((range) => (
          <button
            key={range.id}
            onClick={() => onSelect(range.id)}
            className="flex flex-col items-start p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group"
          >
            <span className="font-bold text-slate-800 text-lg group-hover:text-indigo-700">{range.label}</span>
            <span className="text-sm text-slate-500 mt-1">{range.desc}</span>
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-md mx-auto">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 text-center">
          Or enter a specific amount
        </h3>
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <div className="relative flex-grow">
            <IndianRupee className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="e.g. 10000"
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <button 
            type="submit"
            disabled={!customAmount.trim()}
            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Analyze
          </button>
        </form>
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={onBack}
          className="text-slate-500 hover:text-slate-800 text-sm font-medium px-4 py-2"
        >
          ← Back to Event
        </button>
      </div>
    </div>
  );
};