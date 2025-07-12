import React from 'react';
import { useLocation } from 'wouter';
import { Home, Target, Dumbbell, Utensils, TrendingUp, Award } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export function BottomNavigation() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();

  const navItems = [
    { id: 'home', path: '/dashboard', icon: Home, label: t('navigation.home') },
    { id: 'challenges', path: '/challenges', icon: Target, label: t('navigation.challenges') },
    { id: 'exercises', path: '/exercises', icon: Dumbbell, label: t('navigation.exercises') },
    { id: 'meals', path: '/meals', icon: Utensils, label: t('navigation.meals') },
    { id: 'progress', path: '/progress', icon: TrendingUp, label: t('navigation.progress') },
    { id: 'badges', path: '/badges', icon: Award, label: t('navigation.badges') }
  ];

  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
