import React from 'react';
import { RoomAnalysis } from '../types';
import { Home, Lightbulb, MapPin, Palette } from 'lucide-react';

interface RoomAnalysisViewProps {
  analysis: RoomAnalysis;
}

export const RoomAnalysisView: React.FC<RoomAnalysisViewProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Home className="w-5 h-5 text-indigo-600" />
        Room Analysis
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Layout & Colors</h3>
            <p className="text-slate-700">{analysis.layout} {analysis.colors}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Lighting</h3>
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
              <p className="text-slate-700">{analysis.lighting}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Furniture & Open Spaces</h3>
            <p className="text-slate-700">{analysis.furniture}. {analysis.openSpaces}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Suggested Areas for Decor</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {analysis.suitableAreas.map((area, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100">
                  <MapPin className="w-3 h-3" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
