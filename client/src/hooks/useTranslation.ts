import { useState, useEffect } from 'react';

type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

interface TranslationData {
  [key: string]: any;
}

const translations: Record<string, TranslationData> = {};

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<'en-NG' | 'fr-CI'>('en-NG');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        if (!translations['en-NG']) {
          const enNgModule = await import('../data/translations/en-NG.json');
          translations['en-NG'] = enNgModule.default;
        }
        
        if (!translations['fr-CI']) {
          const frCiModule = await import('../data/translations/fr-CI.json');
          translations['fr-CI'] = frCiModule.default;
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load translations:', error);
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('wellness_tracker_language') as 'en-NG' | 'fr-CI';
    if (savedLanguage && (savedLanguage === 'en-NG' || savedLanguage === 'fr-CI')) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language: 'en-NG' | 'fr-CI') => {
    setCurrentLanguage(language);
    localStorage.setItem('wellness_tracker_language', language);
  };

  const t = (key: TranslationKey, params?: TranslationParams): string => {
    if (isLoading) return key;
    
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Replace parameters if provided
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return value;
  };

  const getRandomQuote = (): string => {
    if (isLoading) return '';
    
    const quotes = translations[currentLanguage]?.cultural?.motivationalQuotes || [];
    if (quotes.length === 0) return '';
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    isLoading,
    getRandomQuote
  };
}
