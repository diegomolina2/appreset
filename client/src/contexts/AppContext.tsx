import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { UserData, AppState, Challenge } from '../types';
import { loadUserData, saveUserData, defaultUserData } from '../utils/storage';
import challengesData from '../data/challenges.json';
import { checkAndUnlockBadges } from '../utils/storage';

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  updateUserProfile: (profile: Partial<UserData['userProfile']>) => void;
  startChallenge: (challengeId: string) => void;
  restartChallenge: (challengeId: string) => void;
  completeTask: (challengeId: string, day: number, taskIndex: number) => void;
  uncompleteTask: (challengeId: string, day: number, taskIndex: number) => void;
  toggleFavorite: (type: 'exercises' | 'meals' | 'quotes', id: string) => void;
  logWeight: (weight: number) => void;
  logMood: (mood: '😞' | '😐' | '🙂' | '😊' | '😄') => void;
  logWater: (liters: number) => void;
  logCalories: (calories: number) => void;
  unlockBadge: (badgeId: string) => void;
  importCSVData: (csvData: any[]) => Promise<{ success: boolean; imported: number; skipped: number; message?: string }>;
}

type AppAction = 
  | { type: 'SET_USER_DATA'; payload: UserData }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserData['userProfile']> }
  | { type: 'SET_LANGUAGE'; payload: 'en-NG' | 'fr-CI' }
  | { type: 'SET_DARK_MODE'; payload: boolean }
  | { type: 'SET_ONBOARDED'; payload: boolean }
  | { type: 'START_CHALLENGE'; payload: string }
  | { type: 'RESTART_CHALLENGE'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: { challengeId: string; day: number; taskIndex: number } }
  | { type: 'UNCOMPLETE_TASK'; payload: { challengeId: string; day: number; taskIndex: number } }
  | { type: 'TOGGLE_FAVORITE'; payload: { type: 'exercises' | 'meals' | 'quotes'; id: string } }
  | { type: 'LOG_WEIGHT'; payload: number }
  | { type: 'LOG_MOOD'; payload: '😞' | '😐' | '🙂' | '😊' | '😄' }
  | { type: 'LOG_WATER'; payload: number }
  | { type: 'LOG_CALORIES'; payload: number }
  | { type: 'UNLOCK_BADGE'; payload: string };

const initialState: AppState = {
  userData: defaultUserData,
  currentLanguage: 'en-NG',
  isDarkMode: false,
  isOnboarded: false,
  currentChallenge: undefined
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER_DATA':
      return { ...state, userData: action.payload };

    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userData: {
          ...state.userData,
          userProfile: { ...state.userData.userProfile, ...action.payload }
        }
      };

    case 'SET_LANGUAGE':
      return { ...state, currentLanguage: action.payload };

    case 'SET_DARK_MODE':
      return { ...state, isDarkMode: action.payload };

    case 'SET_ONBOARDED':
      return { ...state, isOnboarded: action.payload };

    case 'START_CHALLENGE':
      const challengeTemplate = challengesData.find(c => c.id === action.payload);
      if (!challengeTemplate) return state;

      const newChallenge: Challenge = {
        ...challengeTemplate,
        currentDay: 1,
        completedDays: [],
        isActive: true,
        startDate: new Date().toISOString().split('T')[0],
        dailyTasks: challengeTemplate.dailyTasks.map(task => ({
          ...task,
          completed: new Array(task.tasks.length).fill(false)
        }))
      };

      return {
        ...state,
        userData: {
          ...state.userData,
          challenges: {
            ...state.userData.challenges,
            [action.payload]: newChallenge
          }
        },
        currentChallenge: action.payload
      };

    case 'COMPLETE_TASK':
      const { challengeId, day, taskIndex } = action.payload;
      const challenge = state.userData.challenges[challengeId];
      if (!challenge) return state;

      const updatedChallenge = { ...challenge };
      const dayTask = updatedChallenge.dailyTasks.find(t => t.day === day);
      if (dayTask) {
        dayTask.completed[taskIndex] = true;

        // Check if all tasks for the day are completed
        const allTasksCompleted = dayTask.completed.every(c => c);
        if (allTasksCompleted && !updatedChallenge.completedDays.includes(day)) {
          updatedChallenge.completedDays.push(day);
          updatedChallenge.currentDay = Math.min(day + 1, updatedChallenge.days);
        }
      }

      return {
        ...state,
        userData: {
          ...state.userData,
          challenges: {
            ...state.userData.challenges,
            [challengeId]: updatedChallenge
          }
        }
      };

    case 'RESTART_CHALLENGE':
      const restartChallengeTemplate = challengesData.find(c => c.id === action.payload);
      if (!restartChallengeTemplate) return state;

      const restartedChallenge: Challenge = {
        ...restartChallengeTemplate,
        currentDay: 1,
        completedDays: [],
        isActive: true,
        startDate: new Date().toISOString().split('T')[0],
        dailyTasks: restartChallengeTemplate.dailyTasks.map(task => ({
          ...task,
          completed: new Array(task.tasks.length).fill(false)
        }))
      };

      return {
        ...state,
        userData: {
          ...state.userData,
          challenges: {
            ...state.userData.challenges,
            [action.payload]: restartedChallenge
          }
        },
        currentChallenge: action.payload
      };

    case 'UNCOMPLETE_TASK':
      const { challengeId: uncompleteId, day: uncompleteDay, taskIndex: uncompleteIndex } = action.payload;
      const uncompleteChallenge = state.userData.challenges[uncompleteId];
      if (!uncompleteChallenge) return state;

      const updatedUncompleteChallenge = { ...uncompleteChallenge };
      const uncompleteDayTask = updatedUncompleteChallenge.dailyTasks.find(t => t.day === uncompleteDay);
      if (uncompleteDayTask) {
        uncompleteDayTask.completed[uncompleteIndex] = false;

        // Remove day from completed days if it was completed
        if (updatedUncompleteChallenge.completedDays.includes(uncompleteDay)) {
          updatedUncompleteChallenge.completedDays = updatedUncompleteChallenge.completedDays.filter(d => d !== uncompleteDay);
        }
      }

      return {
        ...state,
        userData: {
          ...state.userData,
          challenges: {
            ...state.userData.challenges,
            [uncompleteId]: updatedUncompleteChallenge
          }
        }
      };

    case 'TOGGLE_FAVORITE':
      const { type, id } = action.payload;
      const currentFavorites = state.userData.favorites[type];
      const newFavorites = currentFavorites.includes(id)
        ? currentFavorites.filter(fav => fav !== id)
        : [...currentFavorites, id];

      return {
        ...state,
        userData: {
          ...state.userData,
          favorites: {
            ...state.userData.favorites,
            [type]: newFavorites
          }
        }
      };

    case 'LOG_WEIGHT':
      const today = new Date().toISOString().split('T')[0];
      const updatedWeights = state.userData.weights.filter(w => w.date !== today);
      updatedWeights.push({ date: today, weight: action.payload });

      return {
        ...state,
        userData: {
          ...state.userData,
          weights: updatedWeights
        }
      };

    case 'LOG_MOOD':
      const todayMood = new Date().toISOString().split('T')[0];
      const updatedMoods = state.userData.moods.filter(m => m.date !== todayMood);
      updatedMoods.push({ date: todayMood, mood: action.payload });

      return {
        ...state,
        userData: {
          ...state.userData,
          moods: updatedMoods
        }
      };

    case 'LOG_WATER':
      const todayWater = new Date().toISOString().split('T')[0];
      const filteredWaterLog = state.userData.waterLog.filter(w => w.date !== todayWater);
      filteredWaterLog.push({ date: todayWater, liters: action.payload });

      const updatedUserDataWater = {
        ...state.userData,
        waterLog: filteredWaterLog
      };

      saveUserData(updatedUserDataWater);
      checkAndUnlockBadges(updatedUserDataWater, dispatch);

      return {
        ...state,
        userData: updatedUserDataWater
      };

    case 'LOG_CALORIES':
      const todayCalories = new Date().toISOString().split('T')[0];
      const updatedCaloriesLog = state.userData.caloriesLog.filter(c => c.date !== todayCalories);
      updatedCaloriesLog.push({ date: todayCalories, calories: action.payload });

      return {
        ...state,
        userData: {
          ...state.userData,
          caloriesLog: updatedCaloriesLog
        }
      };

    case 'UNLOCK_BADGE':
      const existingBadge = state.userData.badges.find(b => b.id === action.payload);
      if (existingBadge) return state;

      const newBadge = {
        id: action.payload,
        name: action.payload,
        description: '',
        icon: '',
        isUnlocked: true,
        unlockedAt: new Date().toISOString()
      };

      return {
        ...state,
        userData: {
          ...state.userData,
          badges: [...state.userData.badges, newBadge]
        }
      };

    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const userData = loadUserData();
    dispatch({ type: 'SET_USER_DATA', payload: userData });

    if (userData.userProfile.name) {
      dispatch({ type: 'SET_ONBOARDED', payload: true });
    }

    if (userData.userProfile.language) {
      dispatch({ type: 'SET_LANGUAGE', payload: userData.userProfile.language });
    }
  }, []);

  useEffect(() => {
    saveUserData(state.userData);
  }, [state.userData]);

  const updateUserProfile = (profile: Partial<UserData['userProfile']>) => {
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: profile });
  };

  const startChallenge = (challengeId: string) => {
    dispatch({ type: 'START_CHALLENGE', payload: challengeId });
  };

  const restartChallenge = (challengeId: string) => {
    dispatch({ type: 'RESTART_CHALLENGE', payload: challengeId });
  };

  const completeTask = useCallback((challengeId: string, day: number, taskIndex: number) => {
    const challenge = state.userData.challenges[challengeId];

    if (!challenge) return;

    const updatedChallenge = { ...challenge };
    const dayTask = updatedChallenge.dailyTasks.find(t => t.day === day);
    if (dayTask) {
      dayTask.completed[taskIndex] = true;

      // Check if all tasks for the day are completed
      const allTasksCompleted = dayTask.completed.every(c => c);
      if (allTasksCompleted && !updatedChallenge.completedDays.includes(day)) {
        updatedChallenge.completedDays.push(day);
        updatedChallenge.currentDay = Math.min(day + 1, updatedChallenge.days);
      }
    }

    dispatch({
      type: 'SET_USER_DATA',
      payload: {
        ...state.userData,
        challenges: {
          ...state.userData.challenges,
          [challengeId]: updatedChallenge
        }
      }
    });

    // Check for badge unlocks
    import('../utils/storage').then(({ checkAndUnlockBadges }) => {
      checkAndUnlockBadges(state.userData, dispatch);
    });
  }, [state.userData, dispatch]);

  const uncompleteTask = (challengeId: string, day: number, taskIndex: number) => {
    dispatch({ type: 'UNCOMPLETE_TASK', payload: { challengeId, day, taskIndex } });
  };

  const toggleFavorite = (type: 'exercises' | 'meals' | 'quotes', id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: { type, id } });
  };

  const logWeight = useCallback((weight: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedWeights = state.userData.weights.filter(w => w.date !== today);
    updatedWeights.push({ date: today, weight });

    dispatch({
      type: 'SET_USER_DATA',
      payload: {
        ...state.userData,
        weights: updatedWeights
      }
    });
        // Check for badge unlocks
        import('../utils/storage').then(({ checkAndUnlockBadges }) => {
          checkAndUnlockBadges(state.userData, dispatch);
        });
  }, [state.userData, dispatch]);

  const logMood = (mood: '😞' | '😐' | '🙂' | '😊' | '😄') => {
    dispatch({ type: 'LOG_MOOD', payload: mood });
  };

  const logWater = useCallback((liters: number) => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = state.userData.waterLog.find(w => w.date === today);

    if (existingEntry) {
      // Update existing entry by adding to it
      dispatch({ 
        type: 'LOG_WATER', 
        payload: existingEntry.liters + liters 
      });
    } else {
      // Create new entry
      dispatch({ type: 'LOG_WATER', payload: liters });
    }
  }, [state, dispatch]);

  const logCalories = (calories: number) => {
    dispatch({ type: 'LOG_CALORIES', payload: calories });
  };

  const unlockBadge = (badgeId: string) => {
    dispatch({ type: 'UNLOCK_BADGE', payload: badgeId });
  };

  const importCSVData = async (csvData: any[]) => {
    try {
      let imported = 0;
      let skipped = 0;

      // Helper function to parse date with potential extra characters
      const parseDate = (dateStr: string) => {
        const parsedDate = new Date(dateStr);
        if (isNaN(parsedDate.getTime())) {
          // Attempt to extract date part if the date string has extra characters
          const datePart = dateStr.split(' ')[0]; // Split by space and take first part
          const newParsedDate = new Date(datePart);
          if (!isNaN(newParsedDate.getTime())) {
            return newParsedDate.toISOString().split('T')[0]; // Return in 'YYYY-MM-DD' format
          }
          return null;
        }
        return parsedDate.toISOString().split('T')[0];
      };

      csvData.forEach(row => {
        try {
          // Import weight data
          if (row.date && row.weight) {
            const parsedDate = parseDate(row.date);
            if (parsedDate) {
              const existingWeightIndex = state.userData.weights.findIndex(w => w.date === parsedDate);
              if (existingWeightIndex === -1) {
                state.userData.weights.push({
                  date: parsedDate,
                  weight: parseFloat(row.weight)
                });
                imported++;
              } else {
                skipped++;
              }
            } else {
              skipped++;
            }
          }

          // Import water data
          if (row.date && row.waterIntake) {
            const parsedDate = parseDate(row.date);
            if (parsedDate) {
              const existingWaterIndex = state.userData.waterLog.findIndex(w => w.date === parsedDate);
              if (existingWaterIndex === -1) {
                state.userData.waterLog.push({
                  date: parsedDate,
                  liters: parseFloat(row.waterIntake)
                });
                imported++;
              } else {
                skipped++;
              }
            } else {
              skipped++;
            }
          }

          // Import exercise data
          if (row.date && row.exerciseId && row.exerciseDuration) {
            const parsedDate = parseDate(row.date);
            if (parsedDate) {
              const existingExerciseIndex = state.userData.exercises.findIndex(
                e => e.date === parsedDate && e.exerciseId === row.exerciseId
              );
              if (existingExerciseIndex === -1) {
                state.userData.exercises.push({
                  date: parsedDate,
                  exerciseId: row.exerciseId,
                  duration: parseInt(row.exerciseDuration),
                  completed: row.exerciseCompleted === 'true'
                });
                imported++;
              } else {
                skipped++;
              }
            } else {
              skipped++;
            }
          }

          // Import meal data
          if (row.date && row.mealId) {
            const parsedDate = parseDate(row.date);
            if (parsedDate) {
              const existingMealIndex = state.userData.meals.findIndex(
                m => m.date === parsedDate && m.mealId === row.mealId
              );
              if (existingMealIndex === -1) {
                state.userData.meals.push({
                  date: parsedDate,
                  mealId: row.mealId,
                  calories: row.mealCalories ? parseInt(row.mealCalories) : undefined
                });
                imported++;
              } else {
                skipped++;
              }
            } else {
              skipped++;
            }
          }
        } catch (error) {
          skipped++;
        }
      });

      saveUserData(state.userData);
      return { success: true, imported, skipped };
    } catch (error) {
      return {
        success: false,
        imported: 0,
        skipped: 0,
        message: error instanceof Error ? error.message : 'Import failed'
      };
    }
  };

  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      updateUserProfile,
      startChallenge,
      restartChallenge,
      completeTask,
      uncompleteTask,
      toggleFavorite,
      logWeight,
      logMood,
      logWater,
      logCalories,
      unlockBadge,
      importCSVData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}