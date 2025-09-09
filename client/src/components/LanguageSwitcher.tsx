import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { Button } from './ui/button';

export function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useTranslation();

  const languages = [
    { code: 'en-US', flag: '🇺🇸', name: 'English (US)' },
    { code: 'fr-FR', flag: '🇫🇷', name: 'Français (France)' },
    { code: 'es-ES', flag: '🇪🇸', name: 'Español (España)' }
  ];

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode);
    // Force page reload to apply language changes
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Current: {languages.find(l => l.code === currentLanguage)?.name || 'English (US)'}
      </div>
      
      <div className="grid gap-2">
        {languages.map((language) => (
          <Button
            key={language.code}
            variant={currentLanguage === language.code ? 'default' : 'outline'}
            onClick={() => handleLanguageChange(language.code)}
            className="w-full justify-start"
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </Button>
        ))}
      </div>
    </div>
  );
}