
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ImageUpload } from './components/ImageUpload';
import { RoomAnalysisView } from './components/RoomAnalysisView';
import { ThemeDetails, ThemeSection } from './components/ThemeDetails';
import { EventSelection } from './components/EventSelection';
import { BudgetSelection } from './components/BudgetSelection';
import { Login } from './components/Login';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
import { HelpDeskView } from './components/HelpDeskView';
import { analyzeRoomImage, generateDecoratedRoomVariations } from './services/geminiService';
import { saveHistoryItem, getHistory, deleteHistoryItem, clearHistory } from './services/historyService';
import { AnalysisResult, AppState, UserPreferences, UserProfile, HistoryItem, UserSettings } from './types';
import { Sparkles, RotateCcw, LogOut, History, Settings as SettingsIcon, HelpCircle, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

// Define the logical steps for the Result Wizard
const WIZARD_STEPS = [
  { id: 'ROOM_ANALYSIS', title: 'Room Analysis' },
  { id: 'THEME_SELECTION', title: 'Select Theme' },
  { id: 'VISUALIZE', title: 'Visualization' },
  { id: 'DESIGN', title: 'Design Plan' },
  { id: 'EXECUTION', title: 'Setup Guide' },
  { id: 'AMBIENCE', title: 'Ambience' },
  { id: 'SHOPPING', title: 'Shopping List' },
  { id: 'CLEANUP', title: 'Cleanup' },
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('LOGIN');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');

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
  
  // Wizard State
  const [currentWizardStep, setCurrentWizardStep] = useState(0);

  // Load history on mount
  useEffect(() => {
    setHistoryItems(getHistory());
  }, []);

  // Step 0: Login
  const handleLogin = (profile: UserProfile, language: string) => {
    setUser(profile);
    setCurrentLanguage(language);
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
        updatedPrefs.budget,
        currentLanguage // Pass the selected language here
      );
      
      setAnalysisResult(result);
      // Auto-select the recommended theme
      setSelectedThemeId(result.recommendedThemeId);
      
      // Start at Step 0 (Room Analysis)
      setCurrentWizardStep(0);
      
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
    setCurrentWizardStep(0);
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
    setCurrentWizardStep(0);
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

  // Wizard Navigation
  const nextStep = () => {
    if (currentWizardStep < WIZARD_STEPS.length - 1) {
      setCurrentWizardStep(curr => curr + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentWizardStep > 0) {
      setCurrentWizardStep(curr => curr - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (index: number) => {
    // Prevent jumping ahead of theme selection if no theme is selected (logic mostly handled by disabled states)
    setCurrentWizardStep(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden selection:bg-violet-500 selection:text-white">
      
      {/* Background Blobs - Dark & Vibrant */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/30 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-900/30 rounded-full blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-fuchsia-900/30 rounded-full blur-[100px] opacity-40"></div>
      </div>

      {/* Navbar */}
      <nav className="glass-nav sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => user && handleReset()}>
              <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-600 p-2.5 rounded-xl shadow-lg shadow-violet-900/40">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-white tracking-tight leading-none">
                  Lumina<span className="text-violet-400">Decor</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium tracking-wide">AI INTERIOR STYLIST</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden md:flex items-center gap-3 bg-slate-800/50 pl-2 pr-4 py-1.5 rounded-full border border-white/10 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold shadow-sm ring-2 ring-violet-500/20">
                    {user.avatarInitials}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-200 leading-tight">{user.name}</span>
                    <span className="text-[10px] text-slate-400 leading-tight">{user.role}</span>
                  </div>
                </div>
              )}

              {user && appState !== 'LOGIN' && (
                <>
                  <button
                    onClick={handleOpenHistory}
                    className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                    title="History"
                  >
                    <History className="w-5 h-5" />
                  </button>
                  <button 
                     onClick={handleOpenHelp}
                     className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                     title="Help"
                   >
                     <HelpCircle className="w-5 h-5" />
                   </button>
                  <button 
                     onClick={handleOpenSettings}
                     className="p-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-full"
                     title="Settings"
                   >
                     <SettingsIcon className="w-5 h-5" />
                   </button>
                   <button 
                     onClick={handleLogout}
                     className="p-2 text-slate-400 hover:text-red-400 transition-colors hover:bg-red-500/10 rounded-full"
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
        
        {/* LOGIN */}
        {appState === 'LOGIN' && <Login onLogin={handleLogin} />}

        {/* UPLOAD */}
        {appState === 'UPLOAD' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
            <div className="text-center mb-12 max-w-3xl">
              <span className="inline-block px-4 py-1.5 rounded-full bg-violet-900/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-4 border border-violet-500/30 shadow-lg shadow-violet-500/10">
                Welcome back, {user?.name.split(' ')[0]}
              </span>
              <h2 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
                Reimagine Your Space <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  Instantly with AI
                </span>
              </h2>
              <ImageUpload onImageSelected={handleImageSelected} />
            </div>
          </div>
        )}

        {/* SELECTION SCREENS */}
        {appState === 'EVENT_SELECTION' && <EventSelection onSelect={handleEventSelected} onBack={handleBackToUpload} />}
        {appState === 'BUDGET_SELECTION' && <BudgetSelection onSelect={handleBudgetSelected} onBack={handleBackToEvent} />}

        {/* ANALYZING */}
        {appState === 'ANALYZING' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-violet-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-violet-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Sparkles className="w-10 h-10 text-violet-400 animate-pulse" />
              </div>
            </div>
            <h3 className="text-3xl font-heading font-bold text-white mb-3">Dreaming up ideas...</h3>
            <p className="text-slate-400 text-lg">Curating themes for your budget.</p>
          </div>
        )}

        {/* SUB-VIEWS */}
        {appState === 'HISTORY' && <HistoryView historyItems={historyItems} onSelect={handleRestoreHistoryItem} onDelete={handleDeleteHistoryItem} onBack={handleCloseSubView} />}
        {appState === 'SETTINGS' && user && <SettingsView user={user} settings={settings} onUpdateProfile={handleUpdateProfile} onUpdateSettings={handleUpdateSettings} onClearHistory={handleClearHistory} onLogout={handleLogout} onBack={handleCloseSubView} />}
        {appState === 'HELP' && <HelpDeskView onBack={handleCloseSubView} />}
        {appState === 'ERROR' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={handleReset} className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold">Try Again</button>
          </div>
        )}

        {/* RESULTS WIZARD */}
        {appState === 'RESULTS' && analysisResult && (
          <div className="animate-fade-in-up pb-24">
            
            {/* Wizard Stepper */}
            <div className="flex justify-center mb-8 overflow-x-auto pb-4">
               <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md p-2 rounded-full border border-white/10 shadow-lg">
                  {WIZARD_STEPS.map((step, idx) => {
                     const isActive = idx === currentWizardStep;
                     const isCompleted = idx < currentWizardStep;
                     return (
                        <div key={step.id} className="flex items-center">
                           <button 
                              onClick={() => goToStep(idx)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all whitespace-nowrap ${
                                 isActive ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-900/50' : 
                                 isCompleted ? 'bg-violet-900/20 text-violet-300 hover:bg-violet-900/40' : 
                                 'text-slate-500 hover:text-slate-300'
                              }`}
                           >
                              {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                              <span className="text-xs md:text-sm font-medium">{step.title}</span>
                           </button>
                           {idx < WIZARD_STEPS.length - 1 && (
                              <div className={`w-8 h-[1px] mx-1 ${isCompleted ? 'bg-violet-800' : 'bg-slate-800'}`}></div>
                           )}
                        </div>
                     );
                  })}
               </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[500px]">
               {/* 1. ROOM ANALYSIS */}
               {WIZARD_STEPS[currentWizardStep].id === 'ROOM_ANALYSIS' && (
                  <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
                     <div className="text-center mb-6">
                        <h2 className="text-3xl font-heading font-bold text-white">Room Analysis</h2>
                        <p className="text-slate-400">What our AI sees in your space.</p>
                     </div>
                     <RoomAnalysisView analysis={analysisResult.roomAnalysis} imageUrl={prefs.imagePreview} />
                  </div>
               )}

               {/* 2. THEME SELECTION CARD GRID */}
               {WIZARD_STEPS[currentWizardStep].id === 'THEME_SELECTION' && (
                  <div className="max-w-6xl mx-auto animate-fade-in">
                     <div className="text-center mb-8">
                        <h2 className="text-3xl font-heading font-bold text-white">Select Your Theme</h2>
                        <p className="text-slate-400">We curated {analysisResult.themes.length} styles for your event.</p>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {analysisResult.themes.map((theme) => {
                           const isSelected = selectedThemeId === theme.id;
                           const isRec = analysisResult.recommendedThemeId === theme.id;
                           return (
                              <div 
                                 key={theme.id}
                                 onClick={() => setSelectedThemeId(theme.id)}
                                 className={`cursor-pointer rounded-3xl p-6 transition-all duration-300 border relative overflow-hidden group hover:-translate-y-1 ${
                                    isSelected 
                                    ? 'bg-violet-900/20 border-violet-500 shadow-2xl shadow-violet-900/20' 
                                    : 'glass-panel border-white/5 hover:border-violet-500/30 hover:bg-slate-800/60'
                                 }`}
                              >
                                 {isRec && (
                                    <div className="absolute top-4 right-4 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                       <Sparkles className="w-3 h-3" /> Best Match
                                    </div>
                                 )}
                                 <h3 className={`text-2xl font-heading font-bold mb-2 ${isSelected ? 'text-white' : 'text-slate-100'}`}>{theme.name}</h3>
                                 <p className={`text-sm mb-4 italic ${isSelected ? 'text-violet-200' : 'text-slate-400'}`}>{theme.mood}</p>
                                 
                                 <div className="flex gap-2 mb-6">
                                    {(theme.paletteDetails?.colors || theme.colorPalette.slice(0,3)).map((c, i) => (
                                       <div 
                                          key={i} 
                                          className="w-8 h-8 rounded-full border-2 border-slate-700 shadow-sm" 
                                          style={{ backgroundColor: typeof c === 'string' ? c : c.hex }}
                                       ></div>
                                    ))}
                                 </div>

                                 <div className={`flex justify-between items-center border-t pt-4 ${isSelected ? 'border-violet-500/30' : 'border-white/10'}`}>
                                    <span className={`text-lg font-bold ${isSelected ? 'text-violet-300' : 'text-white'}`}>₹{theme.totalCost.toLocaleString()}</span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-violet-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                       {isSelected ? <CheckCircle2 className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                    </div>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               )}

               {/* 3-8. THEME DETAILS SECTIONS */}
               {currentWizardStep > 1 && selectedThemeId && analysisResult.themes.find(t => t.id === selectedThemeId) && (
                  <ThemeDetails 
                     theme={analysisResult.themes.find(t => t.id === selectedThemeId)!} 
                     isRecommended={analysisResult.recommendedThemeId === selectedThemeId}
                     recommendationReason={analysisResult.recommendedThemeId === selectedThemeId ? analysisResult.recommendationReason : undefined}
                     onGenerateImage={handleGeneratePreview}
                     isGeneratingImage={isGeneratingImage}
                     originalImagePreview={prefs.imagePreview}
                     activeSection={WIZARD_STEPS[currentWizardStep].id as ThemeSection}
                  />
               )}
            </div>

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 backdrop-blur-md p-2 rounded-full shadow-2xl border border-white/10 z-40">
               <button 
                  onClick={prevStep}
                  disabled={currentWizardStep === 0}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                  <ChevronLeft className="w-6 h-6" />
               </button>
               
               <div className="px-4 text-center">
                  <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Step {currentWizardStep + 1} of {WIZARD_STEPS.length}</span>
                  <span className="block text-sm font-bold text-white">{WIZARD_STEPS[currentWizardStep].title}</span>
               </div>

               <button 
                  onClick={nextStep}
                  disabled={currentWizardStep === WIZARD_STEPS.length - 1 || (WIZARD_STEPS[currentWizardStep].id === 'THEME_SELECTION' && !selectedThemeId)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                     currentWizardStep === WIZARD_STEPS.length - 1 
                     ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                     : 'bg-white text-slate-950 hover:bg-violet-400 hover:text-slate-950 hover:scale-105'
                  }`}
               >
                  <ChevronRight className="w-6 h-6" />
               </button>
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
