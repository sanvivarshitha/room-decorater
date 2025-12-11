import React, { useState } from 'react';
import { DecorTheme } from '../types';
import { IndianRupee, Sparkles, CheckCircle2, ShoppingBag, Wand2, Loader2, Download, ImageIcon, Check } from 'lucide-react';

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

  // If we have images, use the selected one, otherwise null
  const currentPreviewUrl = theme.generatedImageUrls && theme.generatedImageUrls.length > 0 
    ? theme.generatedImageUrls[selectedImageIndex] 
    : null;

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-lg border-t-4 border-indigo-500 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-slate-800">{theme.name}</h2>
                {isRecommended && (
                  <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide border border-amber-200 shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Best Match
                  </span>
                )}
              </div>
              <p className="text-lg text-slate-600 font-medium italic">{theme.mood}</p>
            </div>
            
            <div className="flex flex-col items-end">
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                theme.budgetCategory === 'Budget-Friendly' ? 'bg-green-100 text-green-700' :
                theme.budgetCategory === 'Moderate' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {theme.budgetCategory}
              </span>
              <div className="mt-2 text-2xl font-bold text-slate-800 flex items-center">
                <IndianRupee className="w-5 h-5 mr-1" />
                {theme.totalCost.toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-slate-400">Est. Total Cost</span>
            </div>
          </div>

          {isRecommended && recommendationReason && (
             <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-6">
                <p className="text-amber-800 text-sm">
                  <strong>Why we recommend this:</strong> {recommendationReason}
                </p>
             </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {theme.colorPalette.map((color, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200">
                <div 
                  className="w-4 h-4 rounded-full border border-slate-300 shadow-sm" 
                  style={{ backgroundColor: color.toLowerCase() }} 
                ></div>
                <span className="text-sm font-medium text-slate-700">{color}</span>
              </div>
            ))}
          </div>

          <p className="text-slate-700 leading-relaxed text-lg">
            {theme.visualDescription}
          </p>
        </div>
      </div>

      {/* AI Preview Generation Section */}
      <div className="bg-indigo-900 rounded-2xl shadow-xl overflow-hidden text-white relative">
        <div className="absolute top-0 right-0 p-32 bg-indigo-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 p-32 bg-purple-500 rounded-full blur-3xl opacity-20 -ml-16 -mb-16"></div>
        
        <div className="relative p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-indigo-300" />
              AI Design Studio
            </h3>
            {theme.generatedImageUrls && theme.generatedImageUrls.length > 0 && (
               <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium">
                 4 Variations Generated
               </span>
            )}
          </div>
          
          {(!theme.generatedImageUrls || theme.generatedImageUrls.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-indigo-500/30 rounded-xl bg-indigo-800/20">
              <div className="mb-4 p-4 bg-white/10 rounded-full backdrop-blur-sm">
                <ImageIcon className="w-8 h-8 text-indigo-200" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Visualize this theme</h4>
              <p className="text-indigo-200 max-w-md mb-8">
                Generate 4 different design templates for this theme to see how it fits your room.
              </p>
              <button
                onClick={() => onGenerateImage(theme.id)}
                disabled={isGeneratingImage}
                className="px-8 py-4 bg-white text-indigo-900 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 text-lg transform hover:scale-105"
              >
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating 4 Designs...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Generate 4 Templates
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Preview Area */}
              <div className="relative rounded-xl overflow-hidden bg-black/50 aspect-video md:aspect-[16/9] shadow-2xl border border-white/10 group">
                {currentPreviewUrl && (
                  <img 
                    src={showOriginal ? originalImagePreview || '' : currentPreviewUrl} 
                    alt="Decorated Room Preview" 
                    className="w-full h-full object-cover transition-transform duration-700" 
                  />
                )}
                
                <div className="absolute bottom-4 right-4 flex gap-2">
                   {originalImagePreview && (
                    <button
                      onMouseDown={() => setShowOriginal(true)}
                      onMouseUp={() => setShowOriginal(false)}
                      onMouseLeave={() => setShowOriginal(false)}
                      onTouchStart={() => setShowOriginal(true)}
                      onTouchEnd={() => setShowOriginal(false)}
                      className="bg-black/60 hover:bg-black/80 text-white backdrop-blur-md px-4 py-2 rounded-lg text-sm font-bold border border-white/20 transition-all"
                    >
                      Hold to Compare
                    </button>
                   )}
                   {currentPreviewUrl && (
                    <a 
                      href={currentPreviewUrl} 
                      download={`ai-decor-${theme.id}-v${selectedImageIndex + 1}.png`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 transition-all flex items-center gap-2 text-sm font-bold"
                      title="Download Image"
                    >
                      <Download className="w-4 h-4" /> Download
                    </a>
                   )}
                </div>

                <div className="absolute top-4 left-4">
                   <span className="bg-indigo-600/90 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-lg border border-indigo-400/30">
                     ✨ Variation {selectedImageIndex + 1}
                   </span>
                </div>
              </div>

              {/* Variations Selector */}
              <div className="grid grid-cols-4 gap-4">
                {theme.generatedImageUrls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative rounded-lg overflow-hidden aspect-video border-2 transition-all ${
                      selectedImageIndex === idx 
                        ? 'border-amber-400 ring-2 ring-amber-400/50 scale-105 z-10' 
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Variation ${idx + 1}`} className="w-full h-full object-cover" />
                    {selectedImageIndex === idx && (
                      <div className="absolute inset-0 bg-indigo-900/20 flex items-center justify-center">
                        <div className="bg-amber-400 rounded-full p-1">
                          <Check className="w-3 h-3 text-indigo-900 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <p className="text-center text-indigo-200 text-sm">
                Select a variation above to view it in full size.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Template & Placement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Decoration Setup</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="font-semibold text-indigo-600 min-w-[5rem]">Backdrop:</span>
              <span className="text-slate-600">{theme.backdropDesign}</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-indigo-600 min-w-[5rem]">Balloons:</span>
              <span className="text-slate-600">{theme.balloonArrangement}</span>
            </li>
            <li className="flex gap-3">
              <span className="font-semibold text-indigo-600 min-w-[5rem]">Lighting:</span>
              <span className="text-slate-600">{theme.lightingSetup}</span>
            </li>
            {theme.tableStyling && (
              <li className="flex gap-3">
                <span className="font-semibold text-indigo-600 min-w-[5rem]">Table:</span>
                <span className="text-slate-600">{theme.tableStyling}</span>
              </li>
            )}
            <li className="flex gap-3">
              <span className="font-semibold text-indigo-600 min-w-[5rem]">Specials:</span>
              <span className="text-slate-600">{theme.specialElements.join(', ')}</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Placement Guide</h3>
          <ul className="space-y-3">
            {theme.placementInstructions.map((instruction, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Shopping List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-600" />
            Shopping List
          </h3>
          <span className="text-xs text-slate-500">*Prices are estimated Indian market rates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">Item</th>
                <th className="px-6 py-4 font-semibold">Source</th>
                <th className="px-6 py-4 font-semibold">Qty</th>
                <th className="px-6 py-4 font-semibold text-right">Price (INR)</th>
                <th className="px-6 py-4 font-semibold">Why?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {theme.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{item.name}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    <span className="inline-block px-2 py-1 rounded-md bg-white border border-slate-200 text-xs">
                      {item.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{item.quantity}</td>
                  <td className="px-6 py-4 text-slate-800 font-semibold text-right">
                    ₹{item.approxPriceINR.toLocaleString('en-IN')}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm italic">{item.reason}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold">
                <td colSpan={3} className="px-6 py-4 text-right text-slate-800">Total Estimated Budget</td>
                <td className="px-6 py-4 text-right text-indigo-700 text-lg">
                  ₹{theme.totalCost.toLocaleString('en-IN')}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};