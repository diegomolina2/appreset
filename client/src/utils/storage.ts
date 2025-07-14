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

export const checkAndUnlockBadges = (userData?: UserData, dispatch?: any): void => {
  const currentUserData = userData || loadUserData();
  
  // Check for "First Step" badge - completed day 1 of any challenge
  const hasCompletedFirstDay = Object.values(currentUserData.challenges).some(challenge => 
    challenge.completedDays.length > 0
  );
  if (hasCompletedFirstDay && !currentUserData.badges.find(b => b.id === 'first_step')) {
    if (dispatch) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'first_step' });
    } else {
      unlockBadge('first_step');
    }
  }
  
  // Check for "Hydrated" badge - 7 consecutive days of water logging
  const waterStreak = getConsecutiveWaterDays(currentUserData);
  if (waterStreak >= 7 && !currentUserData.badges.find(b => b.id === 'hydrated')) {
    if (dispatch) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'hydrated' });
    } else {
      unlockBadge('hydrated');
    }
  }
  
  // Check for "Consistent" badge - 7 day activity streak
  const activityStreak = getCurrentStreak(currentUserData);
  if (activityStreak >= 7 && !currentUserData.badges.find(b => b.id === 'consistent')) {
    if (dispatch) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'consistent' });
    } else {
      unlockBadge('consistent');
    }
  }
  
  // Check for "Week Warrior" badge - completed any 7-day challenge
  const completedWeekChallenge = Object.values(currentUserData.challenges).some(challenge => 
    challenge.completedDays.length >= 7
  );
  if (completedWeekChallenge && !currentUserData.badges.find(b => b.id === 'week_warrior')) {
    if (dispatch) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'week_warrior' });
    } else {
      unlockBadge('week_warrior');
    }
  }
  
  // Check for "Month Master" badge - completed any 30-day challenge
  const completedMonthChallenge = Object.values(currentUserData.challenges).some(challenge => 
    challenge.completedDays.length >= 30
  );
  if (completedMonthChallenge && !currentUserData.badges.find(b => b.id === 'month_master')) {
    if (dispatch) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'month_master' });
    } else {
      unlockBadge('month_master');
    }
  }
  
  // Check for "Exercise Enthusiast" badge - completed 20 different exercises
  const uniqueExercises = new Set(currentUserData.exerciseHistory.map(e => e.exerciseId));
  if (uniqueExercises.size >= 20 && !currentUserData.badges.find(b => b.id === 'exercise_enthusiast')) {
    if (dispatch) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'exercise_enthusiast' });
    } else {
      unlockBadge('exercise_enthusiast');
    }
  }
  
  // Check for "Healthy Eater" badge - logged meals for 14 consecutive days
  const mealStreak = getConsecutiveMealDays(currentUserData);
  if (mealStreak >= 14 && !currentUserData.badges.find(b => b.id === 'healthy_eater')) {
    if (dispatch) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'healthy_eater' });
    } else {
      unlockBadge('healthy_eater');
    }
  }
  
  // Check for "Water Champion" badge - hit water goal for 30 days
  const waterGoalDays = getWaterGoalDays(currentUserData);
  if (waterGoalDays >= 30 && !currentUserData.badges.find(b => b.id === 'water_champion')) {
    if (dispatch) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'water_champion' });
    } else {
      unlockBadge('water_champion');
    }
  }
};

const getConsecutiveWaterDays = (userData?: UserData): number => {
  const currentUserData = userData || loadUserData();
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const hasWaterLog = currentUserData.waterLog.some(w => w.date === dateStr && w.liters >= 2);
    
    if (hasWaterLog) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

const getConsecutiveMealDays = (userData?: UserData): number => {
  const currentUserData = userData || loadUserData();
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const hasMealLog = currentUserData.mealHistory.some(m => m.date === dateStr);
    
    if (hasMealLog) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

const getWaterGoalDays = (userData?: UserData): number => {
  const currentUserData = userData || loadUserData();
  return currentUserData.waterLog.filter(w => w.liters >= 2).length;
};

export const getCurrentStreak = (userData?: UserData): number => {
  const currentUserData = userData || loadUserData();
  const today = new Date();
  let streak = 0;
  
  // Check consecutive days with any activity (weight, mood, water, or exercise)
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    const hasActivity = currentUserData.weights.some(w => w.date === dateStr) ||
                       currentUserData.moods.some(m => m.date === dateStr) ||
                       currentUserData.waterLog.some(w => w.date === dateStr) ||
                       currentUserData.exerciseHistory.some(e => e.date === dateStr);
    
    if (hasActivity) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};
