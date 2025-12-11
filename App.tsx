import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ImageUpload } from './components/ImageUpload';
import { RoomAnalysisView } from './components/RoomAnalysisView';
import { ThemeDetails } from './components/ThemeDetails';
import { EventSelection } from './components/EventSelection';
import { BudgetSelection } from './components/BudgetSelection';
import { analyzeRoomImage, generateDecoratedRoomVariations } from './services/geminiService';
import { AnalysisResult, AppState, UserPreferences } from './types';
import { Sparkles, Image as ImageIcon, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('UPLOAD');
  const [prefs, setPrefs] = useState<UserPreferences>({
    imageBase64: null,
    imagePreview: null,
    eventType: '',
    budget: '',
  });
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Step 1: Image Uploaded
  const handleImageSelected = (base64: string, preview: string) => {
    setPrefs(prev => ({ ...prev, imageBase64: base64, imagePreview: preview }));
    setAppState('EVENT_SELECTION');
    setError(null);
  };

  // Step 2: Event Selected
  const handleEventSelected = (eventType: string) => {
    setPrefs(prev => ({ ...prev, eventType }));
    setAppState('BUDGET_SELECTION');
  };

  // Step 3: Budget Selected -> Trigger Analysis
  const handleBudgetSelected = async (budget: string) => {
    const updatedPrefs = { ...prefs, budget };
    setPrefs(updatedPrefs);
    setAppState('ANALYZING');
    setError(null);

    try {
      if (!updatedPrefs.imageBase64) throw new Error("Image missing");
      
      const result = await analyzeRoomImage(
        updatedPrefs.imageBase64,
        updatedPrefs.eventType,
        updatedPrefs.budget
      );
      
      setAnalysisResult(result);
      // Auto-select the recommended theme
      setSelectedThemeId(result.recommendedThemeId);
      setAppState('RESULTS');
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the room. Please try again with a clearer image or check your API Key.");
      setAppState('ERROR');
    }
  };

  const handleGeneratePreview = async (themeId: string) => {
    if (!analysisResult || !prefs.imageBase64) return;
    
    const theme = analysisResult.themes.find(t => t.id === themeId);
    if (!theme) return;

    setIsGeneratingImage(true);
    try {
      const generatedImages = await generateDecoratedRoomVariations(
        prefs.imageBase64,
        theme.name,
        theme.visualDescription,
        prefs.eventType
      );

      // Update the state with the new image URLs array
      setAnalysisResult(prev => {
        if (!prev) return null;
        return {
          ...prev,
          themes: prev.themes.map(t => 
            t.id === themeId ? { ...t, generatedImageUrls: generatedImages } : t
          )
        };
      });

    } catch (err) {
      console.error("Failed to generate preview image", err);
      // Optionally show a toast error here
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleReset = () => {
    setAppState('UPLOAD');
    setPrefs({
      imageBase64: null,
      imagePreview: null,
      eventType: '',
      budget: '',
    });
    setAnalysisResult(null);
    setSelectedThemeId(null);
  };

  const handleBackToUpload = () => {
    setAppState('UPLOAD');
  };

  const handleBackToEvent = () => {
    setAppState('EVENT_SELECTION');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">
                AI Room Stylist
              </h1>
            </div>
            {appState !== 'UPLOAD' && appState !== 'EVENT_SELECTION' && appState !== 'BUDGET_SELECTION' && (
              <button 
                onClick={handleReset}
                className="flex items-center gap-2 my-auto px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Step 1: Upload */}
        {appState === 'UPLOAD' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center mb-10 max-w-2xl">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
                Transform Your Space with AI
              </h2>
              <p className="text-lg text-slate-600">
                Upload a photo of your room. We'll generate stunning decoration themes, 
                shopping lists, and budget estimates instantly.
              </p>
            </div>
            <ImageUpload onImageSelected={handleImageSelected} />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center w-full max-w-4xl">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3 text-indigo-600 font-bold">1</div>
                <h3 className="font-semibold text-slate-800">Upload Photo</h3>
                <p className="text-sm text-slate-500 mt-1">Take a clear picture of the room you want to decorate.</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-600 font-bold">2</div>
                <h3 className="font-semibold text-slate-800">Choose Event</h3>
                <p className="text-sm text-slate-500 mt-1">Select from birthdays, festivals, memorials, and more.</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600 font-bold">3</div>
                <h3 className="font-semibold text-slate-800">Set Budget</h3>
                <p className="text-sm text-slate-500 mt-1">Get plans that match your budget and shopping list.</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Event Selection */}
        {appState === 'EVENT_SELECTION' && (
          <EventSelection 
            onSelect={handleEventSelected} 
            onBack={handleBackToUpload} 
          />
        )}

        {/* Step 3: Budget Selection */}
        {appState === 'BUDGET_SELECTION' && (
          <BudgetSelection 
            onSelect={handleBudgetSelected} 
            onBack={handleBackToEvent} 
          />
        )}

        {/* State: ANALYZING */}
        {appState === 'ANALYZING' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Designing your {prefs.eventType}...</h3>
            <p className="text-slate-500">Curating themes for your budget of {prefs.budget}.</p>
          </div>
        )}

        {/* State: ERROR */}
        {appState === 'ERROR' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center max-w-md">
              <h3 className="text-lg font-bold text-red-700 mb-2">Oops! Something went wrong.</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={handleReset}
                className="bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* State: RESULTS */}
        {appState === 'RESULTS' && analysisResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sidebar / Top Section for Mobile */}
            <div className="lg:col-span-4 space-y-6">
              {/* Image Preview */}
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                 {prefs.imagePreview && (
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                    <img src={prefs.imagePreview} alt="Room Preview" className="w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-white text-xs font-medium">
                       <ImageIcon className="w-3 h-3" /> Original Photo
                    </div>
                  </div>
                 )}
                 <div className="mt-3 flex justify-between px-1">
                   <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">Event</p>
                      <p className="text-sm font-medium text-slate-800">{prefs.eventType}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-slate-500 uppercase font-bold">Budget</p>
                      <p className="text-sm font-medium text-slate-800">{prefs.budget}</p>
                   </div>
                 </div>
              </div>

              {/* Room Analysis */}
              <RoomAnalysisView analysis={analysisResult.roomAnalysis} />

              {/* Theme Navigation */}
              <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">Generated Themes</h3>
                </div>
                <div className="max-h-[500px] overflow-y-auto">
                  {analysisResult.themes.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    const isRec = analysisResult.recommendedThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedThemeId(theme.id)}
                        className={`w-full text-left p-4 border-b border-slate-50 transition-all hover:bg-indigo-50 flex items-start justify-between group ${
                          isSelected ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'
                        }`}
                      >
                        <div>
                          <h4 className={`font-semibold ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                            {theme.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-xs text-slate-500">{theme.items.length} Items</span>
                             <span className="text-xs text-slate-300">•</span>
                             <span className="text-xs font-medium text-slate-600">₹{theme.totalCost.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                        {isRec && <Sparkles className="w-4 h-4 text-amber-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8">
              {selectedThemeId && analysisResult.themes.find(t => t.id === selectedThemeId) && (
                <ThemeDetails 
                  theme={analysisResult.themes.find(t => t.id === selectedThemeId)!} 
                  isRecommended={analysisResult.recommendedThemeId === selectedThemeId}
                  recommendationReason={
                    analysisResult.recommendedThemeId === selectedThemeId 
                    ? analysisResult.recommendationReason 
                    : undefined
                  }
                  onGenerateImage={handleGeneratePreview}
                  isGeneratingImage={isGeneratingImage}
                  originalImagePreview={prefs.imagePreview}
                />
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

// Render
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}