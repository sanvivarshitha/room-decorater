export interface DecorationItem {
  name: string;
  source: string;
  approxPriceINR: number;
  quantity: string;
  reason: string;
}

export interface DecorTheme {
  id: string;
  name: string;
  mood: string;
  colorPalette: string[];
  visualDescription: string;
  placementInstructions: string[];
  backdropDesign: string;
  balloonArrangement: string;
  lightingSetup: string;
  tableStyling?: string;
  specialElements: string[];
  items: DecorationItem[];
  totalCost: number;
  budgetCategory: 'Budget-Friendly' | 'Moderate' | 'Premium';
  generatedImageUrls?: string[];
}

export interface RoomAnalysis {
  layout: string;
  lighting: string;
  colors: string;
  openSpaces: string;
  furniture: string;
  suitableAreas: string[];
}

export interface AnalysisResult {
  roomAnalysis: RoomAnalysis;
  themes: DecorTheme[];
  recommendedThemeId: string;
  recommendationReason: string;
}

export type AppState = 'UPLOAD' | 'EVENT_SELECTION' | 'BUDGET_SELECTION' | 'ANALYZING' | 'RESULTS' | 'ERROR';

export interface UserPreferences {
  imageBase64: string | null;
  imagePreview: string | null;
  eventType: string;
  budget: string;
}