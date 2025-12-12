
import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Calendar, Trash2, ArrowRight, Wallet, History } from 'lucide-react';

interface HistoryViewProps {
  historyItems: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ historyItems, onSelect, onDelete, onBack }) => {
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="animate-fade-in w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-heading font-bold text-slate-900 flex items-center gap-3">
            <History className="w-8 h-8 text-violet-600" />
            Project History
          </h2>
          <p className="text-slate-500 mt-1">Pick up where you left off</p>
        </div>
        <button 
          onClick={onBack}
          className="px-5 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 transition-colors font-medium text-sm"
        >
          Close History
        </button>
      </div>

      {historyItems.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No History Yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-8">
            Your completed room designs will appear here automatically. Start a new project to see it in action!
          </p>
          <button 
            onClick={onBack}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
          >
            Start New Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {historyItems.map((item) => (
            <div key={item.id} className="glass-panel rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 border border-white/60">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={item.imagePreview} 
                  alt={item.eventType} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <span className="text-white text-xs font-bold px-2 py-1 bg-white/20 backdrop-blur-md rounded-md border border-white/20">
                    {item.analysisResult.themes.length} Themes Generated
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-heading font-bold text-lg text-slate-800 line-clamp-1" title={item.eventType}>
                    {item.eventType}
                  </h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(item.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Wallet className="w-4 h-4" />
                    <span>{item.budget}</span>
                  </div>
                </div>

                <button 
                  onClick={() => onSelect(item)}
                  className="w-full py-3 rounded-xl bg-violet-50 text-violet-700 font-bold hover:bg-violet-600 hover:text-white transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Open Project 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
