
import React from 'react';
import { RoomAnalysis } from '../types';
import { Home, Lightbulb, MapPin, Palette, Shield, AlertTriangle, CheckCircle2, Ruler, Scan, Info, Sun, Zap, Camera, Focus, Aperture, Users, Move, ArrowRightLeft, Eraser, MoveRight, ImageIcon } from 'lucide-react';

interface RoomAnalysisViewProps {
  analysis: RoomAnalysis;
  imageUrl?: string | null;
}

export const RoomAnalysisView: React.FC<RoomAnalysisViewProps> = ({ analysis, imageUrl }) => {
  return (
    <div className="space-y-6">
      
      {/* Uploaded Image Preview */}
      {imageUrl && (
        <div className="glass-panel rounded-2xl p-4 shadow-sm border border-slate-700/50 mb-6 bg-slate-900/40">
           <div className="flex items-center gap-2 mb-3 px-2">
              <ImageIcon className="w-5 h-5 text-violet-400" />
              <h3 className="font-heading font-bold text-white">Your Space</h3>
           </div>
           <div className="rounded-xl overflow-hidden border-2 border-slate-700 shadow-lg relative aspect-video bg-slate-900">
             <img 
               src={imageUrl} 
               alt="Uploaded Room" 
               className="w-full h-full object-cover" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
             <div className="absolute bottom-4 left-4 text-white">
                <span className="text-xs font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md px-2 py-1 rounded-md border border-white/20">
                  Analysis Source
                </span>
             </div>
           </div>
        </div>
      )}

      {/* Basic Room Analysis */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm border border-white/5">
        <h2 className="text-lg font-heading font-bold text-white mb-5 flex items-center gap-2 border-b border-white/10 pb-2">
          <Home className="w-5 h-5 text-violet-400" />
          Room Analysis
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Layout & Colors</h3>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">{analysis.layout} {analysis.colors}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" /> Lighting
            </h3>
            <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">{analysis.lighting}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Furniture & Space</h3>
            <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">{analysis.furniture}. {analysis.openSpaces}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Suggested Areas</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.suitableAreas.map((area, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-900/30 text-violet-300 text-xs font-bold border border-violet-500/30 shadow-sm">
                  <MapPin className="w-3 h-3" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decluttering Insights (Conditional: Only if clutter found) */}
      {analysis.clutterCheck && analysis.clutterCheck.hasClutter && (
        <div className="glass-panel rounded-2xl p-6 shadow-sm border border-orange-500/30 bg-orange-900/10">
           <h2 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
             <Eraser className="w-5 h-5 text-orange-400" />
             Decluttering Insights
           </h2>
           <p className="text-sm text-slate-400 mb-4">
             We noticed a few items that, if moved, would drastically improve the final look.
           </p>
           <div className="space-y-3">
             {analysis.clutterCheck.recommendations.map((tip, idx) => (
                <div key={idx} className="flex gap-3 items-start bg-slate-800/80 p-3 rounded-xl border border-orange-900/50 shadow-sm">
                   <div className="mt-0.5 min-w-[18px]">
                     <MoveRight className="w-4 h-4 text-orange-500" />
                   </div>
                   <p className="text-sm text-slate-300 font-medium leading-relaxed">{tip}</p>
                </div>
             ))}
           </div>
        </div>
      )}

      {/* AI Crowd Capacity Planner (NEW) */}
      {analysis.crowdCapacity && (
        <div className="glass-panel rounded-2xl p-6 shadow-sm border border-cyan-500/30 bg-cyan-900/10">
           <h2 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
             <Users className="w-5 h-5 text-cyan-400" />
             Crowd & Flow Planner
           </h2>
           
           <div className="grid grid-cols-3 gap-3 mb-4">
             <div className="bg-slate-800/50 p-3 rounded-xl border border-cyan-900/50 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Capacity</div>
                <div className="text-cyan-400 font-bold text-sm md:text-base">{analysis.crowdCapacity.totalCapacity}</div>
             </div>
             <div className="bg-slate-800/50 p-3 rounded-xl border border-cyan-900/50 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Standing</div>
                <div className="text-slate-300 font-bold text-sm md:text-base">{analysis.crowdCapacity.standingCapacity}</div>
             </div>
             <div className="bg-slate-800/50 p-3 rounded-xl border border-cyan-900/50 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Seated</div>
                <div className="text-slate-300 font-bold text-sm md:text-base">{analysis.crowdCapacity.seatingCapacity}</div>
             </div>
           </div>

           <div className="space-y-3">
              <div className="flex gap-3 items-start bg-slate-800/50 p-3 rounded-xl border border-cyan-900/30">
                 <div className="mt-0.5 min-w-[18px]">
                   <Move className="w-4 h-4 text-cyan-500" />
                 </div>
                 <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Movement Advice</span>
                    <p className="text-sm text-slate-300 leading-relaxed">{analysis.crowdCapacity.movementAdvice}</p>
                 </div>
              </div>
              <div className="flex gap-3 items-start bg-slate-800/50 p-3 rounded-xl border border-cyan-900/30">
                 <div className="mt-0.5 min-w-[18px]">
                   <ArrowRightLeft className="w-4 h-4 text-cyan-500" />
                 </div>
                 <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Zone Control</span>
                    <p className="text-sm text-slate-300 leading-relaxed">{analysis.crowdCapacity.zoneAdvice}</p>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* AI Spatial Intelligence Section */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm border border-indigo-500/30 bg-indigo-900/10">
        <h2 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
          <Scan className="w-5 h-5 text-indigo-400" />
          AI Spatial Intelligence
        </h2>
        
        {analysis.estimatedDimensions ? (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-indigo-900/50 text-center">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">Est. Width</div>
                 <div className="text-indigo-400 font-bold">{analysis.estimatedDimensions.estimatedWidth}</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-indigo-900/50 text-center">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">Est. Height</div>
                 <div className="text-indigo-400 font-bold">{analysis.estimatedDimensions.estimatedHeight}</div>
              </div>
              <div className="bg-slate-800/50 p-3 rounded-xl border border-indigo-900/50 text-center">
                 <div className="text-xs text-slate-500 uppercase font-bold mb-1">Wall Space</div>
                 <div className="text-indigo-400 font-bold text-xs">{analysis.estimatedDimensions.wallSpaceAvailable}</div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg italic">
              <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
              <span>{analysis.estimatedDimensions.notes}</span>
            </div>

            {analysis.decorFitAdvice && analysis.decorFitAdvice.length > 0 && (
              <div className="space-y-2 mt-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Decor Fit Advice</h3>
                {analysis.decorFitAdvice.map((advice, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Ruler className="w-3.5 h-3.5 text-indigo-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-slate-300 leading-snug">{advice}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 text-slate-500 text-sm">
            Dimensions could not be estimated from this image.
          </div>
        )}
      </div>

      {/* AI Photo Zone Scout (NEW) */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm border border-pink-500/30 bg-pink-900/10">
         <h2 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
          <Camera className="w-5 h-5 text-pink-400" />
          AI Photo Zone Scout
        </h2>
        {analysis.photoZones && analysis.photoZones.length > 0 ? (
          <div className="space-y-4">
             {analysis.photoZones.map((zone, idx) => (
               <div key={idx} className="bg-slate-800/60 p-4 rounded-xl border border-pink-900/50 relative overflow-hidden group">
                  <div className="flex gap-3 items-start mb-2">
                     <div className="mt-1"><Focus className="w-4 h-4 text-pink-500" /></div>
                     <div>
                        <h4 className="font-bold text-slate-200 text-sm">Spot {idx + 1}: {zone.location}</h4>
                        <p className="text-xs text-slate-400">{zone.reason}</p>
                     </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-pink-900/30">
                     <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Lighting</span>
                        <div className="flex gap-1.5 items-start">
                           <Sun className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
                           <p className="text-xs text-slate-300 leading-snug">{zone.lighting}</p>
                        </div>
                     </div>
                     <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Where to Stand</span>
                        <div className="flex gap-1.5 items-start">
                           <Aperture className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0" />
                           <p className="text-xs text-slate-300 leading-snug">{zone.standingSpot}</p>
                        </div>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        ) : (
           <div className="text-center py-4 text-slate-500 text-sm">
             <Camera className="w-8 h-8 mx-auto mb-2 text-slate-600" />
             AI is identifying the best angles...
           </div>
        )}
      </div>

      {/* AI Lighting Strategy Section */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm border border-amber-500/30 bg-amber-900/10">
         <h2 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-400" />
          Luminous Ambience
        </h2>
        {analysis.lightingSuggestions && analysis.lightingSuggestions.length > 0 ? (
          <div className="space-y-3">
             {analysis.lightingSuggestions.map((suggestion, idx) => (
               <div key={idx} className="flex gap-3 items-start bg-slate-800/60 p-3 rounded-xl border border-amber-900/30">
                  <div className="mt-0.5 min-w-[18px]">
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-sm text-slate-300 font-medium leading-relaxed">{suggestion}</p>
               </div>
             ))}
          </div>
        ) : (
          <div className="flex gap-3 items-start bg-slate-800/60 p-3 rounded-xl border border-amber-900/30">
             <div className="mt-0.5 min-w-[18px]"><Zap className="w-4 h-4 text-amber-500" /></div>
             <p className="text-sm text-slate-300 font-medium">Use warm fairy lights in corners to soften room shadows.</p>
          </div>
        )}
      </div>

      {/* Safety Recommendations Section */}
      <div className="glass-panel rounded-2xl p-6 shadow-sm border border-emerald-500/30 bg-emerald-900/10">
        <h2 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          Safety First
        </h2>
        <div className="space-y-3">
          {analysis.safetyTips && analysis.safetyTips.length > 0 ? (
            analysis.safetyTips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-emerald-900/30">
                <div className="mt-0.5 min-w-[18px]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-300 font-medium leading-relaxed">{tip}</p>
              </div>
            ))
          ) : (
            <>
              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-emerald-900/30">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                <p className="text-sm text-slate-300 font-medium">Ensure curtains and drapes are kept away from candles or heat sources.</p>
              </div>
              <div className="flex items-start gap-3 bg-slate-800/60 p-3 rounded-xl border border-emerald-900/30">
                <Shield className="w-4 h-4 text-emerald-500 mt-0.5" />
                <p className="text-sm text-slate-300 font-medium">Use command hooks or damage-free strips instead of nails to protect wall integrity.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
