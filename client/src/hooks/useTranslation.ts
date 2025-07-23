
import { useState, useEffect } from 'react';

type TranslationKey = string;
type TranslationParams = Record<string, string | number>;

interface TranslationData {
  [key: string]: any;
}

const translations: Record<string, TranslationData> = {};

type SupportedLanguage = 'en-NG' | 'en-ZA' | 'en-KE' | 'en-GH' | 'fr-CI';

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en-NG');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const languages: SupportedLanguage[] = ['en-NG', 'en-ZA', 'en-KE', 'en-GH', 'fr-CI'];
        
        for (const lang of languages) {
          if (!translations[lang]) {
            const module = await import(`../data/translations/${lang}.json`);
            translations[lang] = module.default;
          }
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
    const savedLanguage = localStorage.getItem('wellness_tracker_language') as SupportedLanguage;
    if (savedLanguage && ['en-NG', 'en-ZA', 'en-KE', 'en-GH', 'fr-CI'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (language: string) => {
    const supportedLang = language as SupportedLanguage;
    setCurrentLanguage(supportedLang);
    localStorage.setItem('wellness_tracker_language', supportedLang);
  };

  const t = (key: TranslationKey, params?: TranslationParams): string => {
    if (isLoading) return key;
    
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Try fallback to en-NG if current language doesn't have the key
        if (currentLanguage !== 'en-NG' && translations['en-NG']) {
          let fallbackValue = translations['en-NG'];
          for (const fallbackK of keys) {
            if (fallbackValue && typeof fallbackValue === 'object' && fallbackK in fallbackValue) {
              fallbackValue = fallbackValue[fallbackK];
            } else {
              return key; // Return key if translation not found even in fallback
            }
          }
          value = fallbackValue;
          break;
        }
        return key; // Return key if translation not found
      }
    }
    
    // Ensure we return a string, not an object
    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" resolved to non-string value:`, value);
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
    return quotes[randomIndex] || '';
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    isLoading,
    getRandomQuote
  };
}
