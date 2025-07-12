import { UserData, AppState } from '../types';

const STORAGE_KEY = 'wellness_tracker_data';

export const defaultUserData: UserData = {
  userProfile: {
    name: '',
    age: 0,
    height: 0,
    weight: 0,
    targetWeight: 0,
    gender: 'other',
    exerciseLevel: 'sedentary',
    diet: [],
    language: 'en-NG'
  },
  challenges: {},
  weights: [],
  moods: [],
  measurements: [],
  waterLog: [],
  caloriesLog: [],
  badges: [],
  favorites: {
    exercises: [],
    meals: [],
    quotes: []
  },
  exerciseHistory: [],
  mealHistory: []
};

export const saveUserData = (userData: UserData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

export const loadUserData = (): UserData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultUserData, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load user data:', error);
  }
  return defaultUserData;
};

export const clearUserData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const exportUserData = (): string => {
  const userData = loadUserData();
  return JSON.stringify(userData, null, 2);
};

export const importUserData = (jsonData: string): boolean => {
  try {
    const userData = JSON.parse(jsonData);
    saveUserData(userData);
    return true;
  } catch (error) {
    console.error('Failed to import user data:', error);
    return false;
  }
};

// Helper functions for specific data operations
export const logWeight = (weight: number): void => {
  const userData = loadUserData();
  const today = new Date().toISOString().split('T')[0];
  
  // Remove existing entry for today if it exists
  userData.weights = userData.weights.filter(w => w.date !== today);
  
  // Add new entry
  userData.weights.push({ date: today, weight });
  
  saveUserData(userData);
};

export const logMood = (mood: '😞' | '😐' | '🙂' | '😊' | '😄'): void => {
  const userData = loadUserData();
  const today = new Date().toISOString().split('T')[0];
  
  // Remove existing entry for today if it exists
  userData.moods = userData.moods.filter(m => m.date !== today);
  
  // Add new entry
  userData.moods.push({ date: today, mood });
  
  saveUserData(userData);
};

export const logWater = (liters: number): void => {
  const userData = loadUserData();
  const today = new Date().toISOString().split('T')[0];
  
  // Remove existing entry for today if it exists
  userData.waterLog = userData.waterLog.filter(w => w.date !== today);
  
  // Add new entry
  userData.waterLog.push({ date: today, liters });
  
  saveUserData(userData);
};

export const logCalories = (calories: number): void => {
  const userData = loadUserData();
  const today = new Date().toISOString().split('T')[0];
  
  // Remove existing entry for today if it exists
  userData.caloriesLog = userData.caloriesLog.filter(c => c.date !== today);
  
  // Add new entry
  userData.caloriesLog.push({ date: today, calories });
  
  saveUserData(userData);
};

export const toggleFavorite = (type: 'exercises' | 'meals' | 'quotes', id: string): void => {
  const userData = loadUserData();
  const favorites = userData.favorites[type];
  
  if (favorites.includes(id)) {
    userData.favorites[type] = favorites.filter(fav => fav !== id);
  } else {
    userData.favorites[type] = [...favorites, id];
  }
  
  saveUserData(userData);
};

export const unlockBadge = (badgeId: string): void => {
  const userData = loadUserData();
  const existingBadge = userData.badges.find(b => b.id === badgeId);
  
  if (!existingBadge) {
    userData.badges.push({
      id: badgeId,
      name: badgeId,
      description: '',
      icon: '',
      isUnlocked: true,
      unlockedAt: new Date().toISOString()
    });
    
    saveUserData(userData);
  }
};

export const getCurrentStreak = (): number => {
  const userData = loadUserData();
  const today = new Date();
  let streak = 0;
  
  // Check consecutive days with any activity (weight, mood, water, or exercise)
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const hasActivity = userData.weights.some(w => w.date === dateStr) ||
                       userData.moods.some(m => m.date === dateStr) ||
                       userData.waterLog.some(w => w.date === dateStr) ||
                       userData.exerciseHistory.some(e => e.date === dateStr);
    
    if (hasActivity) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};
