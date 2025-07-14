import React, { useState } from 'react';
import { Home, Award, Target, BarChart3, Settings, Utensils, Globe, Dumbbell } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from './ui/dialog';

export default function BottomNavigation() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const navItems = [
    { id: 'home', path: '/dashboard', icon: Home, label: t('navigation.home') },
    { id: 'challenges', path: '/challenges', icon: Target, label: t('navigation.challenges') },
    { id: 'exercises', path: '/exercises', icon: Dumbbell, label: t('navigation.exercises') },
    { id: 'meals', path: '/meals', icon: Utensils, label: t('navigation.meals') },
    { id: 'progress', path: '/progress', icon: BarChart3, label: t('navigation.progress') },
    { id: 'badges', path: '/badges', icon: Award, label: t('navigation.badges') },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="flex items-center justify-around py-2 px-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}


        </div>
      </nav>
    </>
  );
}