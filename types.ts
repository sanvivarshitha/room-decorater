

export interface DecorationItem {
  name: string;
  source: string;
  approxPriceINR: number;
  quantity: string;
  reason: string;
}

export interface TimeEstimate {
  task: string;
  durationMinutes: number;
}

export interface DecorationTimeEstimates {
  breakdown: TimeEstimate[];
  totalTimeMinutes: number;
  difficultyLevel: 'Easy' | 'Moderate' | 'Hard';
}

export interface DurabilityEstimate {
  item: string;
  lifespan: string; // e.g., "8-12 hours"
  note?: string; // e.g., "Keep away from heat"
}

export interface CleaningPlan {
  tapeRemoval: string; // Advice on removing adhesive safely
  reusableItems: string[]; // List of items to save
  disposalInstructions: string; // How to handle trash/balloons
  wallCare: string; // Tips for checking/cleaning wall paint
}

export interface ColorInfo {
  name: string;
  hex: string;
}

export interface PaletteDetails {
  colors: ColorInfo[];
  mood: string;
  whySuitsRoom: string;
}

export interface TableSetup {
  suitableTableFound: boolean; // Did AI find a table in the image?
  placement: string; // Where to set up if no table, or which table to use
  cakePlacement: string;
  centerpieceIdeas: string;
  propsArrangement: string;
  foodLayout: string; // Tray/snacks
}

export interface MusicPlaylist {
  name: string; // e.g., "Bollywood Romantic Acoustic"
  genre: string; // e.g., "Indie Pop"
  mood: string; // e.g., "Soulful, Intimate"
  reason: string;
}

export interface DecorTheme {
  id: string;
  name: string;
  mood: string;
  colorPalette: string[]; // Kept for legacy/fallback
  paletteDetails?: PaletteDetails; // New rich color data
  visualDescription: string;
  placementInstructions: string[];
  blueprint?: string; // New text-based ASCII blueprint
  backdropDesign: string;
  balloonArrangement: string;
  lightingSetup: string;
  tableStyling?: string; // Legacy string
  tableSetupPlan?: TableSetup; // New structured plan
  specialElements: string[];
  items: DecorationItem[];
  diyOptions?: string[]; 
  stabilityTips?: string[];
  timeEstimates?: DecorationTimeEstimates;
  durabilityEstimates?: DurabilityEstimate[]; // New field for lifespan prediction
  musicPlaylists?: MusicPlaylist[]; // New field for sound ambience
  cleaningPlan?: CleaningPlan; // New field for post-party cleanup
  totalCost: number;
  budgetCategory: 'Budget-Friendly' | 'Moderate' | 'Premium';
  generatedImageUrls?: string[];
}

export interface RoomDimensions {
  estimatedWidth: string; // e.g., "10-12 feet"
  estimatedHeight: string; // e.g., "9 feet"
  wallSpaceAvailable: string; // e.g., "Approx 8ft on main wall"
  notes: string; // e.g., "Based on standard queen bed size"
}

export interface PhotoZone {
  location: string;
  lighting: string;
  standingSpot: string;
  reason: string;
}

export interface CrowdCapacity {
  totalCapacity: string; // e.g. "15-20 people"
  standingCapacity: string;
  seatingCapacity: string;
  movementAdvice: string; // e.g. "Keep center clear"
  zoneAdvice: string; // e.g. "Place cake table near window to avoid congestion"
}

export interface ClutterCheck {
  hasClutter: boolean;
  recommendations: string[];
}

export interface RoomAnalysis {
  layout: string;
  lighting: string;
  colors: string;
  openSpaces: string;
  furniture: string;
  suitableAreas: string[];
  safetyTips: string[];
  estimatedDimensions?: RoomDimensions;
  decorFitAdvice?: string[];
  lightingSuggestions?: string[]; // New field for lighting simulation tips
  photoZones?: PhotoZone[]; // New AI Photo Zone recommendations
  crowdCapacity?: CrowdCapacity; // New AI Crowd Capacity Planner
  clutterCheck?: ClutterCheck; // New AI Clutter Removal Recommendation
}

export interface AnalysisResult {
  roomAnalysis: RoomAnalysis;
  themes: DecorTheme[];
  recommendedThemeId: string;
  recommendationReason: string;
}

export type AppState = 'LOGIN' | 'UPLOAD' | 'EVENT_SELECTION' | 'BUDGET_SELECTION' | 'ANALYZING' | 'RESULTS' | 'HISTORY' | 'SETTINGS' | 'HELP' | 'ERROR';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarInitials: string;
}

export interface UserPreferences {
  imageBase64: string | null;
  imagePreview: string | null;
  eventType: string;
  budget: string;
}

export interface UserSettings {
  currency: 'INR' | 'USD';
  enableNotifications: boolean;
  autoSave: boolean;
  highContrast: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  eventType: string;
  budget: string;
  imagePreview: string; // Stores the base64 string
  imageBase64: string; // Stores the raw base64 for API reuse
  analysisResult: AnalysisResult;
}