
import React, { useState } from 'react';
import { DecorTheme, DecorationItem } from '../types';
import { IndianRupee, Sparkles, CheckCircle2, ShoppingBag, Wand2, Loader2, Download, ImageIcon, Check, ExternalLink, Palette, Layers, Lightbulb, Scissors, Hammer, Anchor, Clock, Hourglass, Copy, CheckCircle, LayoutTemplate, Map, Battery, Timer, Utensils, Cake, Flower, Music, Disc, Volume2, PlayCircle, Trash2, Recycle, Leaf, Eraser } from 'lucide-react';

interface ThemeDetailsProps {
  theme: DecorTheme;
  isRecommended: boolean;
  recommendationReason?: string;
  onGenerateImage: (themeId: string) => Promise<void>;
  isGeneratingImage: boolean;
  originalImagePreview: string | null;
}

export const ThemeDetails: React.FC<ThemeDetailsProps> = ({ 
  theme, 
  isRecommended, 
  recommendationReason,
  onGenerateImage,
  isGeneratingImage,
  originalImagePreview
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

  return (
    <div className="animate-fade-in space-y-6">
      
      {/* Header Section */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 relative overflow-hidden group">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-200 to-fuchsia-200 rounded-full blur-3xl opacity-30 -mr-16 -mt-16 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 leading-tight">
                  {theme.name}
                </h2>
              </div>
              <p className="text-lg text-slate-600 font-light italic flex items-center gap-2">
                <span className="w-8 h-[1px] bg-slate-400"></span> 
                {theme.mood}
              </p>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-2 mb-2">
                 {isRecommended && (
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border border-amber-200 flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-600" /> Editor's Choice
                  </span>
                )}
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm border ${
                  theme.budgetCategory === 'Budget-Friendly' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                  theme.budgetCategory === 'Moderate' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  'bg-violet-100 text-violet-800 border-violet-200'
                }`}>
                  {theme.budgetCategory}
                </span>
              </div>
              <div className="text-3xl font-heading font-bold text-slate-900 flex items-center">
                <IndianRupee className="w-6 h-6 mr-1 text-slate-400" />
                {theme.totalCost.toLocaleString('en-IN')}
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Project Cost</span>
            </div>
          </div>

          {isRecommended && recommendationReason && (
             <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-4 mb-6 flex gap-4 shadow-sm">
                <div className="p-2 bg-amber-100 rounded-full h-fit">
                   <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wide mb-1">Why we love this</h4>
                  <p className="text-amber-800/80 leading-relaxed text-sm">
                    {recommendationReason}
                  </p>
                </div>
             </div>
          )}

          {/* Color Palette Generator Section - Compact Design */}
          <div className="mb-6 bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
             <div className="flex items-center gap-2 mb-3 border-b border-slate-200/50 pb-2">
               <Palette className="w-4 h-4 text-slate-500" />
               <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Color Palette Generator</h4>
             </div>
             
             <div className="flex flex-col md:flex-row gap-6 items-start">
               {/* Color Swatches - Smaller Size */}
               <div className="flex flex-wrap gap-3">
                 {(theme.paletteDetails?.colors || theme.colorPalette.map(c => ({name: c, hex: c}))).map((color, idx) => (
                   <div key={idx} className="group/color relative flex flex-col items-center gap-1.5">
                     <button 
                       onClick={() => copyToClipboard(color.hex)}
                       className="w-10 h-10 md:w-12 md:h-12 rounded-xl border-2 border-white shadow-sm ring-1 ring-slate-100 transition-all group-hover/color:scale-110 group-hover/color:shadow-md relative overflow-hidden" 
                       style={{ backgroundColor: color.hex.toLowerCase() }} 
                       title={`Click to copy ${color.hex}`}
                     >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity bg-black/10">
                           {copiedHex === color.hex ? <CheckCircle className="w-4 h-4 text-white drop-shadow-md" /> : <Copy className="w-3 h-3 text-white drop-shadow-md" />}
                        </div>
                     </button>
                     <div className="text-center">
                       <span className="text-[10px] font-bold text-slate-600 block max-w-[60px] truncate">{color.name}</span>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Palette Reasoning - Compact Text */}
               <div className="flex-1 border-l border-slate-200 pl-4 md:block hidden">
                  {theme.paletteDetails ? (
                    <div className="flex flex-col h-full justify-center">
                       <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Mood:</span>
                          <span className="text-slate-700 font-heading font-bold italic">{theme.paletteDetails.mood}</span>
                       </div>
                       <p className="text-xs text-slate-600 leading-snug">{theme.paletteDetails.whySuitsRoom}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Analysis available with advanced mode.</p>
                  )}
               </div>
             </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/50 shadow-sm">
             <p className="text-slate-700 leading-relaxed text-base font-light">
               {theme.visualDescription}
             </p>
          </div>
        </div>
      </div>

      {/* AI Preview Generation Section */}
      <div className="rounded-3xl shadow-2xl overflow-hidden relative bg-slate-900 text-white">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute top-0 right-0 p-40 bg-violet-600 rounded-full blur-[100px] opacity-30 -mr-20 -mt-20"></div>
           <div className="absolute bottom-0 left-0 p-40 bg-fuchsia-600 rounded-full blur-[100px] opacity-20 -ml-20 -mb-20"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        </div>
        
        <div className="relative p-8 md:p-10">
          <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
            <div>
               <h3 className="text-2xl font-heading font-bold flex items-center gap-3 mb-2">
                 <Wand2 className="w-6 h-6 text-violet-400" />
                 AI Visualization Studio
               </h3>
               <p className="text-slate-400 font-light">See this exact theme applied to your room.</p>
            </div>
            {theme.generatedImageUrls && theme.generatedImageUrls.length > 0 && (
               <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10">
                 4 Variations Ready
               </span>
            )}
          </div>
          
          {(!theme.generatedImageUrls || theme.generatedImageUrls.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
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
                className="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3 text-lg hover:-translate-y-1 overflow-hidden"
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
            <div className="space-y-8">
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
                            className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-md px-5 py-2.5 rounded-xl text-sm font-bold border border-white/20 transition-all flex items-center gap-2"
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

      {/* Decor Blueprint Section - ENHANCED VISIBILITY */}
      {theme.blueprint && (
        <div className="glass-panel rounded-2xl p-6 border-2 border-slate-200 bg-slate-50 shadow-md">
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <div className="p-2.5 bg-slate-800 text-white rounded-lg shadow-md">
                 <LayoutTemplate className="w-5 h-5" />
               </div>
               <div>
                 <h3 className="text-xl font-heading font-bold text-slate-900">Decor Layout Blueprint</h3>
                 <p className="text-sm text-slate-500 font-medium">Visual map of your decoration strategy</p>
               </div>
             </div>
             <button 
               onClick={copyBlueprint}
               className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-violet-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 hover:border-violet-300 transition-all"
             >
               {copiedBlueprint ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
               {copiedBlueprint ? 'Copied' : 'Copy Blueprint'}
             </button>
           </div>

           <div className="relative rounded-xl overflow-hidden bg-[#1e1e2e] border-4 border-slate-800 shadow-2xl">
             {/* Blueprint Header/Toolbar */}
             <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
               <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">LuminaCAD v2.0</span>
               <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
               </div>
             </div>
             
             {/* The Blueprint Content */}
             <div className="p-6 overflow-x-auto relative">
               <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
               <pre className="font-mono text-sm leading-relaxed text-emerald-300 whitespace-pre">
                 {theme.blueprint}
               </pre>
             </div>

             {/* Legend */}
             <div className="bg-slate-800/50 px-4 py-3 border-t border-slate-700 flex flex-wrap gap-4 text-[10px] md:text-xs text-slate-400 font-mono">
               <span className="flex items-center gap-1.5"><span className="text-blue-300">[ ]</span> Furniture/Structure</span>
               <span className="flex items-center gap-1.5"><span className="text-emerald-300">* *</span> Decoration Item</span>
               <span className="flex items-center gap-1.5"><span className="text-amber-300">&gt; &lt;</span> Signage/Focus</span>
               <span className="flex items-center gap-1.5"><span className="text-slate-500">----</span> Wall/Connection</span>
             </div>
           </div>
        </div>
      )}

      {/* AI Table Setup Designer Section (NEW) */}
      {theme.tableSetupPlan && theme.tableSetupPlan.suitableTableFound && (
        <div className="glass-panel rounded-2xl p-8 border border-pink-100 bg-pink-50/20 shadow-sm">
           <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                <Utensils className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold text-slate-800">Table & Banquet Styling</h3>
                <p className="text-sm text-slate-500">Professional layout for cake, food, and centerpieces.</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/70 p-5 rounded-xl border border-pink-100 shadow-sm space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="mt-1"><Cake className="w-5 h-5 text-pink-500" /></div>
                    <div>
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Cake Placement</span>
                       <p className="text-slate-700 leading-snug font-medium">{theme.tableSetupPlan.cakePlacement}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="mt-1"><Flower className="w-5 h-5 text-fuchsia-500" /></div>
                    <div>
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Centerpiece Idea</span>
                       <p className="text-slate-700 leading-snug">{theme.tableSetupPlan.centerpieceIdeas}</p>
                    </div>
                 </div>
              </div>
              
              <div className="bg-white/70 p-5 rounded-xl border border-pink-100 shadow-sm space-y-4">
                 <div className="flex items-start gap-3">
                    <div className="mt-1"><Sparkles className="w-5 h-5 text-amber-500" /></div>
                    <div>
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Props Arrangement</span>
                       <p className="text-slate-700 leading-snug">{theme.tableSetupPlan.propsArrangement}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3">
                    <div className="mt-1"><Utensils className="w-5 h-5 text-slate-500" /></div>
                    <div>
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block mb-1">Food & Tray Layout</span>
                       <p className="text-slate-700 leading-snug">{theme.tableSetupPlan.foodLayout}</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-100 text-xs text-pink-800 italic flex items-center gap-2">
             <Map className="w-4 h-4" />
             <span>Suggested Location: {theme.tableSetupPlan.placement}</span>
           </div>
        </div>
      )}

      {/* AI Sound Ambience Recommender (NEW) */}
      {theme.musicPlaylists && theme.musicPlaylists.length > 0 && (
         <div className="glass-panel rounded-2xl p-8 border border-fuchsia-100 bg-fuchsia-50/20 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-fuchsia-100 text-fuchsia-600 rounded-lg">
                  <Music className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-heading font-bold text-slate-800">Soundscapes & Vibe</h3>
                  <p className="text-sm text-slate-500">Perfect music playlists to match your theme.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {theme.musicPlaylists.map((playlist, idx) => (
                  <div key={idx} className="bg-white/80 p-4 rounded-xl border border-fuchsia-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                           <Disc className="w-5 h-5 text-fuchsia-400 animate-[spin_5s_linear_infinite]" />
                        </div>
                        <div className="min-w-0">
                           <h4 className="font-bold text-slate-900 text-sm leading-tight truncate" title={playlist.name}>{playlist.name}</h4>
                           <span className="text-xs text-fuchsia-600 font-medium">{playlist.genre}</span>
                        </div>
                     </div>
                     <div className="space-y-2 flex-grow">
                        <div className="flex items-start gap-2">
                           <Volume2 className="w-3 h-3 text-slate-400 mt-0.5" />
                           <p className="text-xs text-slate-600 italic">"{playlist.mood}"</p>
                        </div>
                        <p className="text-xs text-slate-500 leading-snug bg-fuchsia-50 p-2 rounded-lg border border-fuchsia-50">
                           {playlist.reason}
                        </p>
                     </div>
                     <div className="mt-3 pt-3 border-t border-fuchsia-100">
                        <a 
                          href={getMusicSearchUrl(playlist.name)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-fuchsia-600 transition-colors"
                        >
                           <PlayCircle className="w-3.5 h-3.5" /> Listen on Spotify
                        </a>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* Template & Placement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-800">Design Elements</h3>
          </div>
          <ul className="space-y-6">
            <li className="group">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Backdrop</span>
              <span className="text-slate-800 font-medium leading-relaxed group-hover:text-violet-700 transition-colors">{theme.backdropDesign}</span>
            </li>
            <li className="group">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Balloons</span>
              <span className="text-slate-800 font-medium leading-relaxed group-hover:text-violet-700 transition-colors">{theme.balloonArrangement}</span>
            </li>
            <li className="group">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Lighting</span>
              <span className="text-slate-800 font-medium leading-relaxed group-hover:text-violet-700 transition-colors">{theme.lightingSetup}</span>
            </li>
            <li className="group">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Special Touches</span>
               <div className="flex flex-wrap gap-2 mt-1">
                 {theme.specialElements.map((el, idx) => (
                   <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-sm">{el}</span>
                 ))}
               </div>
            </li>
          </ul>
        </div>

        <div className="glass-panel rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
           <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-heading font-bold text-slate-800">Stylist Instructions</h3>
          </div>
          <div className="space-y-4">
            {theme.placementInstructions.map((instruction, idx) => (
              <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-white transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-slate-600 leading-relaxed">{instruction}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Stability & Execution Guide */}
        <div className="glass-panel rounded-2xl p-8 border-2 border-dashed border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-slate-200 text-slate-700 rounded-lg transform -rotate-6">
              <Hammer className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-slate-800">Pro Setup & Stability</h3>
              <p className="text-sm text-slate-500">Expert tricks to keep your decorations secure.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {theme.stabilityTips && theme.stabilityTips.length > 0 ? (
              theme.stabilityTips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 items-start bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                    <div className="mt-0.5 min-w-[20px]">
                      <Anchor className="w-4 h-4 text-violet-500" />
                    </div>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed">{tip}</p>
                </div>
              ))
            ) : (
              <div className="flex gap-3 items-start bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                  <div className="mt-0.5 min-w-[20px]"><Anchor className="w-4 h-4 text-violet-500" /></div>
                  <p className="text-slate-700 text-sm font-medium">Use painter's tape to protect your walls.</p>
              </div>
            )}
          </div>
        </div>

        {/* Time Calculator */}
        <div className="glass-panel rounded-2xl p-8 border border-blue-100 bg-blue-50/30">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-3">
               <div className="p-2 bg-blue-100 text-blue-600 rounded-lg transform rotate-6">
                 <Clock className="w-6 h-6" />
               </div>
               <div>
                 <h3 className="text-xl font-heading font-bold text-slate-800">Time Calculator</h3>
                 <p className="text-sm text-slate-500">Estimated setup time for 2 people.</p>
               </div>
             </div>
             {theme.timeEstimates && (
               <div className="text-center bg-white px-4 py-2 rounded-xl shadow-sm border border-blue-100">
                 <span className="block text-2xl font-bold text-blue-600 font-heading">
                   {Math.floor(theme.timeEstimates.totalTimeMinutes / 60) > 0 ? `${Math.floor(theme.timeEstimates.totalTimeMinutes / 60)}h ` : ''}
                   {theme.timeEstimates.totalTimeMinutes % 60}m
                 </span>
                 <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Time</span>
               </div>
             )}
          </div>

          <div className="space-y-4">
            {theme.timeEstimates ? (
              <>
                 <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Difficulty Level:</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      theme.timeEstimates.difficultyLevel === 'Easy' ? 'bg-green-100 text-green-700' :
                      theme.timeEstimates.difficultyLevel === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {theme.timeEstimates.difficultyLevel}
                    </span>
                 </div>
                 <div className="relative border-l-2 border-blue-200 ml-3 space-y-6 pb-2">
                   {theme.timeEstimates.breakdown.map((item, idx) => (
                     <div key={idx} className="relative pl-6">
                       <div className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded-full"></div>
                       <div className="flex justify-between items-start">
                         <span className="font-medium text-slate-700">{item.task}</span>
                         <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                           {item.durationMinutes} mins
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
              </>
            ) : (
               <div className="text-center py-6 text-slate-500 text-sm">
                 <Hourglass className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                 Time estimates not available for this theme.
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Durability Forecast Section (NEW) */}
      {theme.durabilityEstimates && theme.durabilityEstimates.length > 0 && (
         <div className="glass-panel rounded-2xl p-8 border border-green-100 bg-green-50/20">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Battery className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-heading font-bold text-slate-800">Durability Forecast</h3>
                  <p className="text-sm text-slate-500">When to set up for maximum freshness.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {theme.durabilityEstimates.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-green-50 shadow-sm flex items-start gap-3">
                     <div className="mt-1"><Timer className="w-4 h-4 text-green-500" /></div>
                     <div>
                        <h4 className="font-bold text-slate-800 text-sm">{item.item}</h4>
                        <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-md mt-1 inline-block border border-green-100">{item.lifespan}</span>
                        {item.note && <p className="text-xs text-slate-500 mt-1 italic">{item.note}</p>}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}

      {/* DIY Section - Conditional Rendering */}
      {theme.diyOptions && theme.diyOptions.length > 0 && (
        <div className="glass-panel rounded-2xl p-8 border-2 border-dashed border-amber-200 bg-amber-50/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg transform -rotate-12">
              <Scissors className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-slate-800">DIY Craft Corner</h3>
              <p className="text-sm text-slate-500">Budget-friendly handmade ideas to save costs!</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {theme.diyOptions.map((diy, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl shadow-sm border border-amber-100 hover:border-amber-300 transition-colors">
                <div className="flex gap-3">
                  <div className="bg-amber-100 text-amber-700 w-8 h-8 flex items-center justify-center rounded-full font-bold flex-shrink-0 text-sm">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{diy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shopping List */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-xl font-heading font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-violet-600" />
            Curated Shopping List
          </h3>
          <span className="text-xs font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full">*Estimated Indian Market Rates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-5">Item Details</th>
                <th className="px-6 py-5">Source</th>
                <th className="px-6 py-5">Qty</th>
                <th className="px-6 py-5 text-right">Est. Price</th>
                <th className="px-6 py-5 text-center">Buy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {theme.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-white/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800 text-base">{item.name}</div>
                    <div className="text-sm text-slate-500 mt-1">{item.reason}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      {item.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.quantity}</td>
                  <td className="px-6 py-4 text-slate-800 font-bold text-right font-mono">
                    ₹{item.approxPriceINR.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <a 
                      href={getSearchUrl(item)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 bg-slate-900 text-white hover:bg-violet-600 text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Buy <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50/80">
                <td colSpan={3} className="px-6 py-5 text-right font-bold text-slate-500 uppercase tracking-wide text-xs">Total Estimated Budget</td>
                <td className="px-6 py-5 text-right text-violet-700 text-xl font-bold font-heading">
                  ₹{theme.totalCost.toLocaleString('en-IN')}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Cleaning & Removal Plan (Moved to Bottom) */}
      {theme.cleaningPlan && (
         <div className="glass-panel rounded-2xl p-8 border border-teal-100 bg-teal-50/20">
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-teal-100 text-teal-600 rounded-lg">
                  <Trash2 className="w-6 h-6" />
               </div>
               <div>
                  <h3 className="text-xl font-heading font-bold text-slate-800">Post-Party Cleanup Guide</h3>
                  <p className="text-sm text-slate-500">Smart removal and reusable tips.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-4">
                  <div className="bg-white/70 p-4 rounded-xl border border-teal-50 shadow-sm flex gap-3">
                     <div className="mt-1"><Eraser className="w-5 h-5 text-teal-500" /></div>
                     <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Tape Removal</h4>
                        <p className="text-slate-600 text-sm leading-snug">{theme.cleaningPlan.tapeRemoval}</p>
                     </div>
                  </div>
                  <div className="bg-white/70 p-4 rounded-xl border border-teal-50 shadow-sm flex gap-3">
                     <div className="mt-1"><Recycle className="w-5 h-5 text-green-500" /></div>
                     <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Eco-Disposal</h4>
                        <p className="text-slate-600 text-sm leading-snug">{theme.cleaningPlan.disposalInstructions}</p>
                     </div>
                  </div>
               </div>
               
               <div className="space-y-4">
                  <div className="bg-white/70 p-4 rounded-xl border border-teal-50 shadow-sm flex gap-3">
                     <div className="mt-1"><Leaf className="w-5 h-5 text-emerald-500" /></div>
                     <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Reusable Items</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                           {theme.cleaningPlan.reusableItems.map((item, i) => (
                              <span key={i} className="text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md">{item}</span>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="bg-white/70 p-4 rounded-xl border border-teal-50 shadow-sm flex gap-3">
                     <div className="mt-1"><Hammer className="w-5 h-5 text-amber-500" /></div>
                     <div>
                        <h4 className="font-bold text-slate-800 text-sm mb-1">Wall Care</h4>
                        <p className="text-slate-600 text-sm leading-snug">{theme.cleaningPlan.wallCare}</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};
