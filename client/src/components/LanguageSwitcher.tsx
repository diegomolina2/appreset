import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from './ui/button';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />
      <Button
        variant={currentLanguage === 'en-NG' ? 'default' : 'outline'}
        size="sm"
        onClick={() => changeLanguage('en-NG')}
        className="text-xs"
      >
        🇳🇬 EN
      </Button>
      <Button
        variant={currentLanguage === 'fr-CI' ? 'default' : 'outline'}
        size="sm"
        onClick={() => changeLanguage('fr-CI')}
        className="text-xs"
      >
        🇨🇮 FR
      </Button>
    </div>
  );
}
