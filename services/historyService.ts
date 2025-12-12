
import { HistoryItem } from "../types";

const STORAGE_KEY = 'lumina_decor_history';
const MAX_HISTORY_ITEMS = 5; // Limit to 5 to prevent LocalStorage quota issues with images

export const saveHistoryItem = (item: Omit<HistoryItem, 'id' | 'timestamp'>): void => {
  try {
    const history = getHistory();
    
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    // Add new item to the beginning
    const updatedHistory = [newItem, ...history];

    // Trim to max size to save space
    if (updatedHistory.length > MAX_HISTORY_ITEMS) {
      updatedHistory.length = MAX_HISTORY_ITEMS;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save history (likely storage quota exceeded):", error);
    // Optionally handle quota exceeded by removing more old items, but for now we just log
  }
};

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
};

export const deleteHistoryItem = (id: string): HistoryItem[] => {
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
