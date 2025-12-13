
import React, { useState } from 'react';
import { DecorTheme, DecorationItem } from '../types';
import { IndianRupee, Sparkles, CheckCircle2, ShoppingBag, Wand2, Loader2, Download, ImageIcon, Check, ExternalLink, Palette, Layers, Lightbulb, Scissors, Hammer, Anchor, Clock, Hourglass, Copy, CheckCircle, LayoutTemplate, Map, Battery, Timer, Utensils, Cake, Flower, Music, Disc, Volume2, PlayCircle, Trash2, Recycle, Leaf, Eraser } from 'lucide-react';

export type ThemeSection = 'VISUALIZE' | 'DESIGN' | 'EXECUTION' | 'AMBIENCE' | 'SHOPPING' | 'CLEANUP';

interface ThemeDetailsProps {
  theme: DecorTheme;
  isRecommended: boolean;
  recommendationReason?: string;
  onGenerateImage: (themeId: string) => Promise<void>;
  isGeneratingImage: boolean;
  originalImagePreview: string | null;
  activeSection: ThemeSection;
}

export const ThemeDetails: React.FC<ThemeDetailsProps> = ({ 
  theme, 
  isRecommended, 
  recommendationReason,
  onGenerateImage,
  isGeneratingImage,
  originalImagePreview,
  activeSection
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedBlueprint, setCopiedBlueprint] = useState(false);

  // If we have images, use the selected one, otherwise null
  const currentPreviewUrl = theme.generatedImageUrls && theme.generatedImageUrls.length > 0 
    ? theme.generatedImageUrls[selectedImageIndex] 
    : null;

  const getSearchUrl = (item: DecorationItem) => {
    const query = encodeURIComponent(item.name);
    const sourceLower = item.source.toLowerCase();
    
    if (sourceLower.includes('amazon')) {
      return `https://www.amazon.in/s?k=${query}`;
    } else if (sourceLower.includes('flipkart')) {
      return `https://www.flipkart.com/search?q=${query}`;
    } else {
      return `https://www.google.com/search?tbm=shop&q=${query}`;
    }
  };

  const getMusicSearchUrl = (query: string) => {
    return `https://open.spotify.com/search/${encodeURIComponent(query)}`;
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const copyBlueprint = () => {
    if (theme.blueprint) {
      navigator.clipboard.writeText(theme.blueprint);
      setCopiedBlueprint(true);
      setTimeout(() => setCopiedBlueprint(false), 2000);
    }
  };

  // Compact Header for Context across slides
  const CompactHeader = () => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white leading-tight">
            {theme.name}
          </h2>
          {isRecommended && (
             <span className="bg-amber-900/30 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border border-amber-500/30 flex items-center gap-1">
               <Sparkles className="w-3 h-3" /> Editor's Choice
             </span>
          )}
        </div>
        <p className="text-sm text-slate-400 font-medium italic flex items-center gap-2 mt-1">
          {theme.mood} Mood
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
          theme.budgetCategory === 'Budget-Friendly' ? 'bg-emerald-900/30 text-emerald-300 border-emerald-500/30' :
          theme.budgetCategory === 'Moderate' ? 'bg-blue-900/30 text-blue-300 border-blue-500/30' :
          'bg-violet-900/30 text-violet-300 border-violet-500/30'
        }`}>
          {theme.budgetCategory}
        </span>
        <div className="text-xl font-heading font-bold text-white flex items-center">
          <IndianRupee className="w-5 h-5 mr-1 text-slate-400" />
          {theme.totalCost.toLocaleString('en-IN')}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in w-full max-w-5xl mx-auto min-h-[500px]">
      
      <CompactHeader />

      {/* ================= VISUALIZE SECTION ================= */}
      {activeSection === 'VISUALIZE' && (
        <div className="space-y-6 animate-fade-in">
           {isRecommended && recommendationReason && (
             <div className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-500/20 rounded-2xl p-4 flex gap-4 shadow-sm">
                <div className="p-2 bg-amber-900/40 rounded-full h-fit border border-amber-500/30">
                   <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wide mb-1">Why we chose this for your room</h4>
                  <p className="text-amber-200/80 leading-relaxed text-sm">
                    {recommendationReason}
                  </p>
                </div>
             </div>
          )}

          <div className="rounded-3xl shadow-2xl overflow-hidden relative bg-slate-950 text-white min-h-[400px] flex flex-col border border-white/10">
            {/* Abstract Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
               <div className="absolute top-0 right-0 p-40 bg-violet-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
               <div className="absolute bottom-0 left-0 p-40 bg-fuchsia-600 rounded-full blur-[100px] opacity-10 -ml-20 -mb-20"></div>
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>
            
            <div className="relative p-8 md:p-10 flex-grow flex flex-col">
              <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                <div>
                   <h3 className="text-2xl font-heading font-bold flex items-center gap-3 mb-2">
                     <Wand2 className="w-6 h-6 text-violet-400" />
                     AI Visualization Studio
                   </h3>
                   <p className="text-slate-400 font-light">See this exact theme applied to your room.</p>
                </div>
              </div>
              
              {(!theme.generatedImageUrls || theme.generatedImageUrls.length === 0) ? (
                <div className="flex flex-col items-center justify-center flex-grow text-center py-10">
                  <div className="w-20 h-20 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-violet-900/50 animate-pulse">
                    <ImageIcon className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-3">Visualize Reality</h4>
                  <p className="text-slate-400 max-w-md mb-8 text-lg font-light">
                    Our AI will generate 4 photo-realistic variations of this theme in your actual room.
                  </p>
                  <button
                    onClick={() => onGenerateImage(theme.id)}
                    disabled={isGeneratingImage}
                    className="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 text-lg hover:-translate-y-1 overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-slate-200/50 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Rendering Design...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-violet-600" />
                        Generate Previews
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-8 animate-fade-in">
                  {/* Main Preview Area */}
                  <div className="relative rounded-2xl overflow-hidden bg-black/50 aspect-video md:aspect-[16/9] shadow-2xl border border-white/10 group">
                    {currentPreviewUrl && (
                      <img 
                        src={showOriginal ? originalImagePreview || '' : currentPreviewUrl} 
                        alt="Decorated Room Preview" 
                        className="w-full h-full object-cover transition-all duration-700" 
                      />
                    )}
                    
                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                       <div className="flex justify-between items-end">
                          <div>
                            <span className="text-violet-300 font-bold tracking-wider text-xs uppercase mb-1 block">Variation {selectedImageIndex + 1}</span>
                            <h5 className="text-white font-heading font-bold text-xl">
                              {selectedImageIndex === 0 ? 'Balanced Composition' : 
                               selectedImageIndex === 1 ? 'Atmospheric Lighting' : 
                               selectedImageIndex === 2 ? 'Grand & Lavish' : 'Minimalist Chic'}
                            </h5>
                          </div>
                          <div className="flex gap-3">
                             {originalImagePreview && (
                              <button
                                onMouseDown={() => setShowOriginal(true)}
                                onMouseUp={() => setShowOriginal(false)}
                                onMouseLeave={() => setShowOriginal(false)}
                                onTouchStart={() => setShowOriginal(true)}
                                onTouchEnd={() => setShowOriginal(false)}
                                className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-md px-5 py-2.5 rounded-xl text-sm font-bold border border-white/20 transition-all flex items-center gap-2"
                              >
                                <Layers className="w-4 h-4" /> Compare
                              </button>
                             )}
                             {currentPreviewUrl && (
                              <a 
                                href={currentPreviewUrl} 
                                download={`lumina-decor-${theme.id}-v${selectedImageIndex + 1}.png`}
                                className="bg-white text-slate-900 hover:bg-slate-200 px-5 py-2.5 rounded-xl border border-white/20 transition-all flex items-center gap-2 text-sm font-bold shadow-lg"
                              >
                                <Download className="w-4 h-4" /> Save
                              </a>
                             )}
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Variations Selector */}
                  <div className="grid grid-cols-4 gap-4">
                    {theme.generatedImageUrls.map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative rounded-xl overflow-hidden aspect-video transition-all duration-300 ${
                          selectedImageIndex === idx 
                            ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-slate-900 scale-105 opacity-100' 
                            : 'opacity-50 hover:opacity-80'
                        }`}
                      >
                        <img src={url} alt={`Variation ${idx + 1}`} className="w-full h-full object-cover" />
                        {selectedImageIndex === idx && (
                          <div className="absolute inset-0 bg-violet-600/20 flex items-center justify-center">
                            <div className="bg-white text-violet-600 rounded-full p-1 shadow-lg">
                              <Check className="w-3 h-3 stroke-[4]" />
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= DESIGN & BLUEPRINT SECTION ================= */}
      {activeSection === 'DESIGN' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-sm h-full">
               <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                 <Palette className="w-5 h-5 text-violet-400" />
                 <h3 className="font-heading font-bold text-white">Color Palette & Mood</h3>
               </div>
               
               <div className="mb-6">
                 <div className="flex flex-wrap gap-3 mb-4">
                   {(theme.paletteDetails?.colors || theme.colorPalette.map(c => ({name: c, hex: c}))).map((color, idx) => (
                     <div key={idx} className="group/color relative flex flex-col items-center gap-1.5">
                       <button 
                         onClick={() => copyToClipboard(color.hex)}
                         className="w-12 h-12 rounded-xl border-2 border-slate-700 shadow-sm ring-1 ring-slate-800 transition-all group-hover/color:scale-110 group-hover/color:shadow-md relative overflow-hidden" 
                         style={{ backgroundColor: color.hex.toLowerCase() }} 
                         title={`Click to copy ${color.hex}`}
                       >
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity bg-black/10">
                             {copiedHex === color.hex ? <CheckCircle className="w-4 h-4 text-white drop-shadow-md" /> : <Copy className="w-3 h-3 text-white drop-shadow-md" />}
                          </div>
                       </button>
                       <span className="text-[10px] font-bold text-slate-400 block max-w-[60px] truncate">{color.name}</span>
                     </div>
                   ))}
                 </div>
                 <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5">
                    <p className="text-sm text-slate-300 italic">"{theme.paletteDetails?.whySuitsRoom || theme.visualDescription}"</p>
                 </div>
               </div>
            </div>

            <div className="glass-panel rounded-2xl p-6 shadow-sm border border-white/10 h-full">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-heading font-bold text-white">Decor Layout Plan</h3>
              </div>
              <ul className="space-y-4">
                <li className="group">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Backdrop</span>
                  <span className="text-slate-300 font-medium leading-relaxed group-hover:text-violet-300 transition-colors">{theme.backdropDesign}</span>
                </li>
                <li className="group">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Balloons & Props</span>
                  <span className="text-slate-300 font-medium leading-relaxed group-hover:text-violet-300 transition-colors">{theme.balloonArrangement}</span>
                </li>
                <li className="group">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Lighting Strategy</span>
                  <span className="text-slate-300 font-medium leading-relaxed group-hover:text-violet-300 transition-colors">{theme.lightingSetup}</span>
                </li>
              </ul>
            </div>
          </div>

           {/* Decor Blueprint Section */}
           {theme.blueprint && (
            <div className="glass-panel rounded-2xl p-6 border-2 border-slate-700 bg-slate-900 shadow-md">
               <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-slate-800 text-white rounded-lg shadow-md border border-white/5">
                     <LayoutTemplate className="w-5 h-5" />
                   </div>
                   <div>
                     <h3 className="text-lg font-heading font-bold text-white">Spatial Blueprint</h3>
                     <p className="text-xs text-slate-500 font-medium">Visual map of your layout</p>
                   </div>
                 </div>
                 <button 
                   onClick={copyBlueprint}
                   className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 hover:border-violet-500 transition-all"
                 >
                   {copiedBlueprint ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                   {copiedBlueprint ? 'Copied' : 'Copy'}
                 </button>
               </div>

               <div className="relative rounded-xl overflow-hidden bg-[#0f1016] border-4 border-slate-800 shadow-2xl">
                 <div className="p-6 overflow-x-auto relative">
                   <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                   <pre className="font-mono text-xs md:text-sm leading-relaxed text-emerald-400 whitespace-pre">
                     {theme.blueprint}
                   </pre>
                 </div>
                 <div className="bg-slate-800/80 px-4 py-3 border-t border-slate-700 flex flex-wrap gap-4 text-[10px] text-slate-400 font-mono">
                   <span className="flex items-center gap-1.5"><span className="text-blue-400">[ ]</span> Furniture</span>
                   <span className="flex items-center gap-1.5"><span className="text-emerald-400">* *</span> Decor</span>
                   <span className="flex items-center gap-1.5"><span className="text-amber-400">&gt; &lt;</span> Signs</span>
                 </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* ================= EXECUTION SECTION ================= */}
      {activeSection === 'EXECUTION' && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time & Difficulty */}
            <div className="glass-panel rounded-2xl p-6 border border-blue-500/20 bg-blue-900/10">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-900/40 text-blue-400 rounded-lg transform rotate-6 border border-blue-500/30">
                     <Clock className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-lg font-heading font-bold text-white">Time Estimate</h3>
                     <p className="text-xs text-slate-400">For 2 people</p>
                   </div>
                 </div>
                 {theme.timeEstimates && (
                   <div className="text-center bg-slate-800 px-4 py-2 rounded-xl shadow-sm border border-blue-900/50">
                     <span className="block text-xl font-bold text-blue-400 font-heading">
                       {Math.floor(theme.timeEstimates.totalTimeMinutes / 60) > 0 ? `${Math.floor(theme.timeEstimates.totalTimeMinutes / 60)}h ` : ''}
                       {theme.timeEstimates.totalTimeMinutes % 60}m
                     </span>
                   </div>
                 )}
              </div>

              {theme.timeEstimates && (
                 <div className="relative border-l-2 border-blue-800 ml-3 space-y-4 pb-2">
                   {theme.timeEstimates.breakdown.map((item, idx) => (
                     <div key={idx} className="relative pl-6">
                       <div className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-900 border-2 border-blue-500 rounded-full"></div>
                       <div className="flex justify-between items-start">
                         <span className="font-medium text-slate-300 text-sm">{item.task}</span>
                         <span className="text-xs font-bold text-blue-300 bg-blue-900/30 px-2 py-0.5 rounded-md whitespace-nowrap border border-blue-500/30">
                           {item.durationMinutes}m
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
              )}
            </div>

            {/* Pro Setup Tips */}
            <div className="glass-panel rounded-2xl p-6 border-2 border-dashed border-slate-700 bg-slate-800/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-800 text-slate-300 rounded-lg transform -rotate-6 border border-white/10">
                  <Hammer className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-white">Stability Guide</h3>
                  <p className="text-xs text-slate-500">Secure your decorations</p>
                </div>
              </div>
              <div className="space-y-3">
                {(theme.stabilityTips || ["Use painter's tape to protect your walls."]).map((tip, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-slate-900/50 p-3 rounded-xl shadow-sm border border-slate-700/50">
                      <div className="mt-0.5 min-w-[20px]">
                        <Anchor className="w-4 h-4 text-violet-400" />
                      </div>
                      <p className="text-slate-300 text-sm font-medium leading-snug">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* DIY Section */}
             {theme.diyOptions && theme.diyOptions.length > 0 && (
              <div className="glass-panel rounded-2xl p-6 border-2 border-dashed border-amber-500/30 bg-amber-900/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-amber-900/30 text-amber-400 rounded-lg transform -rotate-12 border border-amber-500/30">
                    <Scissors className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-white">DIY Craft Corner</h3>
                    <p className="text-xs text-slate-400">Budget hacks</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {theme.diyOptions.map((diy, idx) => (
                    <div key={idx} className="bg-slate-900/50 p-3 rounded-xl shadow-sm border border-amber-900/30 flex gap-3">
                        <div className="bg-amber-900/50 text-amber-300 w-6 h-6 flex items-center justify-center rounded-full font-bold flex-shrink-0 text-xs border border-amber-500/30">
                          {idx + 1}
                        </div>
                        <p className="text-slate-300 text-sm leading-snug">{diy}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Durability */}
            {theme.durabilityEstimates && theme.durabilityEstimates.length > 0 && (
               <div className="glass-panel rounded-2xl p-6 border border-green-500/20 bg-green-900/10">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-green-900/30 text-green-400 rounded-lg border border-green-500/30">
                        <Battery className="w-6 h-6" />
                     </div>
                     <div>
                        <h3 className="text-lg font-heading font-bold text-white">Durability Forecast</h3>
                        <p className="text-xs text-slate-400">Lifespan estimates</p>
                     </div>
                  </div>
                  <div className="space-y-3">
                     {theme.durabilityEstimates.map((item, idx) => (
                        <div key={idx} className="bg-slate-900/50 p-3 rounded-xl border border-green-900/30 shadow-sm flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <Timer className="w-4 h-4 text-green-500" />
                             <span className="font-bold text-slate-200 text-sm">{item.item}</span>
                           </div>
                           <span className="text-green-300 font-bold text-xs bg-green-900/30 px-2 py-0.5 rounded-md border border-green-500/30">{item.lifespan}</span>
                        </div>
                     ))}
                  </div>
               </div>
            )}
          </div>
        </div>
      )}

      {/* ================= AMBIENCE SECTION ================= */}
      {activeSection === 'AMBIENCE' && (
        <div className="space-y-6 animate-fade-in">
           {/* Table Setup */}
           {theme.tableSetupPlan && theme.tableSetupPlan.suitableTableFound && (
            <div className="glass-panel rounded-2xl p-6 border border-pink-500/20 bg-pink-900/10 shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-pink-900/30 text-pink-400 rounded-lg border border-pink-500/30">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-white">Table & Banquet Styling</h3>
                    <p className="text-sm text-slate-400">Professional layout for cake and food.</p>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 p-5 rounded-xl border border-pink-900/30 shadow-sm space-y-4">
                     <div className="flex items-start gap-3">
                        <div className="mt-1"><Cake className="w-5 h-5 text-pink-500" /></div>
                        <div>
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Cake Placement</span>
                           <p className="text-slate-300 leading-snug font-medium">{theme.tableSetupPlan.cakePlacement}</p>
                        </div>
                     </div>
                     <div className="flex items-start gap-3">
                        <div className="mt-1"><Flower className="w-5 h-5 text-fuchsia-500" /></div>
                        <div>
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Centerpiece Idea</span>
                           <p className="text-slate-300 leading-snug">{theme.tableSetupPlan.centerpieceIdeas}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-5 rounded-xl border border-pink-900/30 shadow-sm space-y-4">
                     <div className="flex items-start gap-3">
                        <div className="mt-1"><Sparkles className="w-5 h-5 text-amber-500" /></div>
                        <div>
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">Props Arrangement</span>
                           <p className="text-slate-300 leading-snug">{theme.tableSetupPlan.propsArrangement}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* Music Playlists */}
          {theme.musicPlaylists && theme.musicPlaylists.length > 0 && (
             <div className="glass-panel rounded-2xl p-6 border border-fuchsia-500/20 bg-fuchsia-900/10 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                   <div className="p-2 bg-fuchsia-900/30 text-fuchsia-400 rounded-lg border border-fuchsia-500/30">
                      <Music className="w-6 h-6" />
                   </div>
                   <div>
                      <h3 className="text-xl font-heading font-bold text-white">Soundscapes & Vibe</h3>
                      <p className="text-sm text-slate-400">Curated playlists for the perfect atmosphere.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {theme.musicPlaylists.map((playlist, idx) => (
                      <div key={idx} className="bg-slate-900/70 p-4 rounded-xl border border-fuchsia-900/30 shadow-sm hover:shadow-md hover:border-fuchsia-500/50 transition-all group flex flex-col h-full">
                         <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0 border border-fuchsia-500/30">
                               <Disc className="w-5 h-5 text-fuchsia-400 animate-[spin_5s_linear_infinite]" />
                            </div>
                            <div className="min-w-0">
                               <h4 className="font-bold text-white text-sm leading-tight truncate" title={playlist.name}>{playlist.name}</h4>
                               <span className="text-xs text-fuchsia-300 font-medium">{playlist.genre}</span>
                            </div>
                         </div>
                         <div className="space-y-2 flex-grow">
                            <p className="text-xs text-slate-400 leading-snug bg-slate-800 p-2 rounded-lg border border-white/5">
                               {playlist.reason}
                            </p>
                         </div>
                         <div className="mt-3 pt-3 border-t border-white/5">
                            <a 
                              href={getMusicSearchUrl(playlist.name)} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-lg shadow-fuchsia-900/30"
                            >
                               <PlayCircle className="w-3.5 h-3.5" /> Listen on Spotify
                            </a>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          )}
        </div>
      )}

      {/* ================= SHOPPING SECTION ================= */}
      {activeSection === 'SHOPPING' && (
        <div className="glass-panel rounded-2xl overflow-hidden shadow-sm animate-fade-in border border-white/10">
          <div className="p-6 bg-slate-800/50 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-violet-400" />
                Curated Shopping List
              </h3>
              <p className="text-sm text-slate-400 mt-1">Sourced from top Indian marketplaces.</p>
            </div>
            <div className="text-right">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Estimated Cost</p>
               <p className="text-2xl font-bold text-violet-300 font-heading">₹{theme.totalCost.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/80 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Item Details</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4 text-right">Est. Price</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {theme.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-200 text-sm md:text-base">{item.name}</div>
                      <div className="text-xs text-slate-500 mt-1 line-clamp-1">{item.reason}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">
                        {item.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium text-sm">{item.quantity}</td>
                    <td className="px-6 py-4 text-slate-200 font-bold text-right font-mono text-sm">
                      ₹{item.approxPriceINR.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <a 
                        href={getSearchUrl(item)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 bg-white text-slate-950 hover:bg-violet-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap"
                      >
                        Buy Now <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= CLEANUP SECTION ================= */}
      {activeSection === 'CLEANUP' && theme.cleaningPlan && (
         <div className="glass-panel rounded-2xl p-8 border border-teal-500/20 bg-teal-900/10 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-teal-900/30 text-teal-400 rounded-lg border border-teal-500/30">
                  <Trash2 className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-heading font-bold text-white">Post-Party Cleanup Guide</h3>
                  <p className="text-sm text-slate-400">Smart removal, recycling, and wall care tips.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-teal-900/30 shadow-sm flex gap-3">
                     <div className="mt-1"><Eraser className="w-5 h-5 text-teal-500" /></div>
                     <div>
                        <h4 className="font-bold text-slate-200 text-sm mb-1">Tape Removal</h4>
                        <p className="text-slate-400 text-sm leading-snug">{theme.cleaningPlan.tapeRemoval}</p>
                     </div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-teal-900/30 shadow-sm flex gap-3">
                     <div className="mt-1"><Recycle className="w-5 h-5 text-green-500" /></div>
                     <div>
                        <h4 className="font-bold text-slate-200 text-sm mb-1">Eco-Disposal</h4>
                        <p className="text-slate-400 text-sm leading-snug">{theme.cleaningPlan.disposalInstructions}</p>
                     </div>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-teal-900/30 shadow-sm flex gap-3">
                     <div className="mt-1"><Leaf className="w-5 h-5 text-emerald-500" /></div>
                     <div>
                        <h4 className="font-bold text-slate-200 text-sm mb-1">Reusable Items</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                           {theme.cleaningPlan.reusableItems.map((item, i) => (
                              <span key={i} className="text-xs font-medium bg-emerald-900/30 text-emerald-300 px-2 py-1 rounded-md border border-emerald-500/30">{item}</span>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-teal-900/30 shadow-sm flex gap-3">
                     <div className="mt-1"><Hammer className="w-5 h-5 text-amber-500" /></div>
                     <div>
                        <h4 className="font-bold text-slate-200 text-sm mb-1">Wall Care</h4>
                        <p className="text-slate-400 text-sm leading-snug">{theme.cleaningPlan.wallCare}</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="mt-8 text-center p-6 bg-slate-800/30 rounded-2xl border border-teal-500/10">
               <h4 className="text-lg font-heading font-bold text-white mb-2">Project Complete!</h4>
               <p className="text-slate-400 text-sm">We hope your event is spectacular. Don't forget to save your shopping list.</p>
            </div>
         </div>
      )}
    </div>
  );
};
