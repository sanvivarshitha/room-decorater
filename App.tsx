
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ImageUpload } from './components/ImageUpload';
import { RoomAnalysisView } from './components/RoomAnalysisView';
import { ThemeDetails } from './components/ThemeDetails';
import { EventSelection } from './components/EventSelection';
import { BudgetSelection } from './components/BudgetSelection';
import { Login } from './components/Login';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { HelpDeskView } from './components/HelpDeskView';
import { analyzeRoomImage, generateDecoratedRoomVariations } from './services/geminiService';
import { saveHistoryItem, getHistory, deleteHistoryItem, clearHistory } from './services/historyService';
import { AnalysisResult, AppState, UserPreferences, UserProfile, HistoryItem, UserSettings } from './types';
import { Sparkles, RotateCcw, LogOut, History, Settings as SettingsIcon, HelpCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LOGIN');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    currency: 'INR',
    enableNotifications: true,
    autoSave: true,
    highContrast: false,
  });
  
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
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    setHistoryItems(getHistory());
  }, []);

  // Step 0: Login
  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    setAppState('UPLOAD');
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('LOGIN');
    handleReset();
  };

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
      
      // SAVE TO HISTORY (if autoSave is enabled)
      if (settings.autoSave && updatedPrefs.imageBase64 && updatedPrefs.imagePreview) {
        saveHistoryItem({
          eventType: updatedPrefs.eventType,
          budget: updatedPrefs.budget,
          imageBase64: updatedPrefs.imageBase64,
          imagePreview: updatedPrefs.imagePreview,
          analysisResult: result
        });
        // Refresh local history state
        setHistoryItems(getHistory());
      }

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

  // History Handlers
  const handleOpenHistory = () => {
    setHistoryItems(getHistory());
    setAppState('HISTORY');
  };

  const handleRestoreHistoryItem = (item: HistoryItem) => {
    setPrefs({
      imageBase64: item.imageBase64,
      imagePreview: item.imagePreview,
      eventType: item.eventType,
      budget: item.budget
    });
    setAnalysisResult(item.analysisResult);
    setSelectedThemeId(item.analysisResult.recommendedThemeId);
    setAppState('RESULTS');
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteHistoryItem(id);
    setHistoryItems(updated);
  };

  const handleCloseSubView = () => {
    // Return to the appropriate state
    if (analysisResult) {
      setAppState('RESULTS');
    } else {
      setAppState('UPLOAD');
    }
  };

  // Settings Handlers
  const handleOpenSettings = () => {
    setAppState('SETTINGS');
  };

  const handleOpenHelp = () => {
    setAppState('HELP');
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
  };

  const handleUpdateSettings = (updatedSettings: UserSettings) => {
    setSettings(updatedSettings);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistoryItems([]);
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden selection:bg-violet-200 selection:text-violet-900">
      
      {/* Background Blobs for Visual Interest */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-200/40 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-pink-200/40 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Glass Navbar */}
      <nav className="glass-nav sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => user && handleReset()}>
              <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-2.5 rounded-xl shadow-lg shadow-violet-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight leading-none">
                  Lumina<span className="text-violet-600">Decor</span>
                </h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">AI INTERIOR STYLIST</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden md:flex items-center gap-3 bg-white/50 pl-2 pr-4 py-1.5 rounded-full border border-slate-200/50 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {user.avatarInitials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 leading-tight">{user.name}</span>
                    <span className="text-[10px] text-slate-500 leading-tight">{user.role}</span>
                  </div>
                </div>
              )}

              {user && appState !== 'LOGIN' && (
                <>
                  <button
                    onClick={handleOpenHistory}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                      appState === 'HISTORY' 
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'text-slate-600 hover:text-white hover:bg-slate-900'
                    }`}
                    title="History"
                  >
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline">History</span>
                  </button>

                  <button 
                     onClick={handleOpenHelp}
                     className={`p-2 rounded-full transition-colors ${
                       appState === 'HELP' ? 'text-slate-900 bg-slate-200' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                     }`}
                     title="Help Desk"
                   >
                     <HelpCircle className="w-5 h-5" />
                   </button>

                  <button 
                     onClick={handleOpenSettings}
                     className={`p-2 rounded-full transition-colors ${
                       appState === 'SETTINGS' ? 'text-slate-900 bg-slate-200' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
                     }`}
                     title="Settings"
                   >
                     <SettingsIcon className="w-5 h-5" />
                   </button>

                  {appState !== 'UPLOAD' && appState !== 'EVENT_SELECTION' && appState !== 'BUDGET_SELECTION' && appState !== 'HISTORY' && appState !== 'SETTINGS' && appState !== 'HELP' && (
                    <button 
                      onClick={handleReset}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-white hover:bg-slate-900 rounded-full transition-all duration-300"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="hidden sm:inline">New Project</span>
                    </button>
                  )}

                   <button 
                     onClick={handleLogout}
                     className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                     title="Logout"
                   >
                     <LogOut className="w-5 h-5" />
                   </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Step 0: Login */}
        {appState === 'LOGIN' && (
          <Login onLogin={handleLogin} />
        )}

        {/* Step 1: Upload */}
        {appState === 'UPLOAD' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center mb-12 max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-200 shadow-sm">
                Welcome back, {user?.name.split(' ')[0]}
              </span>
              <h2 className="text-5xl md:text-6xl font-heading font-bold text-slate-900 mb-6 leading-tight">
                Reimagine Your Space <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
                  Instantly with AI
                </span>
              </h2>
              <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
                Upload a photo of your room. We'll generate stunning decoration themes, 
                curated shopping lists, and budget estimates in seconds.
              </p>
            </div>
            
            <ImageUpload onImageSelected={handleImageSelected} />
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full max-w-5xl">
              <div className="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-indigo-600 font-bold text-lg shadow-sm">1</div>
                <h3 className="font-heading font-bold text-lg text-slate-800">Upload Photo</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">Simply drag & drop a clear picture of the room you want to style.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-fuchsia-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-fuchsia-600 font-bold text-lg shadow-sm">2</div>
                <h3 className="font-heading font-bold text-lg text-slate-800">Choose Vibe</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">Tell us about the event—birthday, date night, or festival.</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 font-bold text-lg shadow-sm">3</div>
                <h3 className="font-heading font-bold text-lg text-slate-800">Get The Look</h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">Receive a complete shopping list and visualization within your budget.</p>
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
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-violet-100 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-violet-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Sparkles className="w-10 h-10 text-violet-600 animate-pulse" />
              </div>
            </div>
            <h3 className="text-3xl font-heading font-bold text-slate-900 mb-3">Dreaming up ideas...</h3>
            <p className="text-slate-500 text-lg">Curating <span className="text-violet-600 font-semibold">{prefs.eventType}</span> themes for your budget.</p>
          </div>
        )}

        {/* State: HISTORY */}
        {appState === 'HISTORY' && (
          <HistoryView 
            historyItems={historyItems}
            onSelect={handleRestoreHistoryItem}
            onDelete={handleDeleteHistoryItem}
            onBack={handleCloseSubView}
          />
        )}

        {/* State: SETTINGS */}
        {appState === 'SETTINGS' && user && (
          <SettingsView
            user={user}
            settings={settings}
            onUpdateProfile={handleUpdateProfile}
            onUpdateSettings={handleUpdateSettings}
            onClearHistory={handleClearHistory}
            onLogout={handleLogout}
            onBack={handleCloseSubView}
          />
        )}

        {/* State: HELP */}
        {appState === 'HELP' && (
          <HelpDeskView onBack={handleCloseSubView} />
        )}

        {/* State: ERROR */}
        {appState === 'ERROR' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center max-w-md">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Connection Interrupted</h3>
              <p className="text-slate-600 mb-6">{error}</p>
              <button 
                onClick={handleReset}
                className="bg-slate-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* State: RESULTS */}
        {appState === 'RESULTS' && analysisResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
            
            {/* Sidebar / Top Section for Mobile */}
            <div className="lg:col-span-4 space-y-6">
              {/* Image Preview Card */}
              <div className="glass-panel p-4 rounded-2xl shadow-sm">
                 <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="font-heading font-bold text-slate-800">Your Space</h3>
                    <div className="flex gap-2">
                       <span className="text-xs font-bold px-2 py-1 bg-violet-100 text-violet-700 rounded-md uppercase tracking-wide">{prefs.eventType}</span>
                    </div>
                 </div>
                 {prefs.imagePreview && (
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shadow-inner group">
                    <img src={prefs.imagePreview} alt="Room Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                  </div>
                 )}
                 <div className="mt-4 px-1">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Budget Target</p>
                    <p className="text-lg font-heading font-semibold text-slate-800">{prefs.budget}</p>
                 </div>
              </div>

              {/* Room Analysis */}
              <RoomAnalysisView analysis={analysisResult.roomAnalysis} />

              {/* Theme Navigation */}
              <div className="glass-panel rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-white/50">
                  <h3 className="font-heading font-bold text-slate-800 text-lg">Curated Collections</h3>
                </div>
                <div className="max-h-[500px] overflow-y-auto p-2 space-y-2">
                  {analysisResult.themes.map((theme) => {
                    const isSelected = selectedThemeId === theme.id;
                    const isRec = analysisResult.recommendedThemeId === theme.id;
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedThemeId(theme.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                          isSelected 
                            ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 transform scale-[1.02]' 
                            : 'hover:bg-white hover:shadow-md text-slate-600 bg-transparent'
                        }`}
                      >
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className={`font-bold font-heading text-lg ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                              {theme.name}
                            </h4>
                            {isRec && (
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isSelected ? 'bg-amber-400 text-slate-900' : 'bg-amber-100 text-amber-700'
                              }`}>
                                <Sparkles className="w-3 h-3" /> Best
                              </span>
                            )}
                          </div>
                          
                          <div className={`flex items-center gap-3 text-sm mt-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                             <span>{theme.items.length} Items</span>
                             <span className="opacity-50">•</span>
                             <span className={`font-medium ${isSelected ? 'text-emerald-300' : 'text-slate-700'}`}>₹{theme.totalCost.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
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
