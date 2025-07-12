import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { UserData, AppState, Challenge } from '../types';
import { loadUserData, saveUserData, defaultUserData } from '../utils/storage';
import challengesData from '../data/challenges.json';

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
      const updatedWaterLog = state.userData.waterLog.filter(w => w.date !== todayWater);
      updatedWaterLog.push({ date: todayWater, liters: action.payload });
      
      return {
        ...state,
        userData: {
          ...state.userData,
          waterLog: updatedWaterLog
        }
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

  const completeTask = (challengeId: string, day: number, taskIndex: number) => {
    dispatch({ type: 'COMPLETE_TASK', payload: { challengeId, day, taskIndex } });
  };

  const uncompleteTask = (challengeId: string, day: number, taskIndex: number) => {
    dispatch({ type: 'UNCOMPLETE_TASK', payload: { challengeId, day, taskIndex } });
  };

  const toggleFavorite = (type: 'exercises' | 'meals' | 'quotes', id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: { type, id } });
  };

  const logWeight = (weight: number) => {
    dispatch({ type: 'LOG_WEIGHT', payload: weight });
  };

  const logMood = (mood: '😞' | '😐' | '🙂' | '😊' | '😄') => {
    dispatch({ type: 'LOG_MOOD', payload: mood });
  };

  const logWater = (liters: number) => {
    dispatch({ type: 'LOG_WATER', payload: liters });
  };

  const logCalories = (calories: number) => {
    dispatch({ type: 'LOG_CALORIES', payload: calories });
  };

  const unlockBadge = (badgeId: string) => {
    dispatch({ type: 'UNLOCK_BADGE', payload: badgeId });
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
      unlockBadge
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
