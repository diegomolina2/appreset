import React from 'react';
import { Meal } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Plus, Clock, Utensils } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';

interface MealCardProps {
  meal: Meal;
  onLogMeal?: () => void;
  showCategory?: boolean;
}

export function MealCard({ meal, onLogMeal, showCategory = true }: MealCardProps) {
  const { t } = useTranslation();
  const { state, toggleFavorite } = useApp();

  const isFavorite = state.userData.favorites.meals.includes(meal.id);

  const handleToggleFavorite = () => {
    toggleFavorite('meals', meal.id);
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'breakfast':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'lunch':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'dinner':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'snack':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-poppins font-bold text-gray-800 dark:text-gray-100 mb-1">
              {meal.name}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {meal.description}
            </p>
          </div>
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite 
                ? 'bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-800 dark:text-red-300' 
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-500'
            }`}
          >
            <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Meal Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Utensils className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-primary">
                  {meal.calories} {t('common.calories')}
                </span>
              </div>
              {showCategory && meal.category && (
                <Badge className={`text-xs ${getCategoryColor(meal.category)}`}>
                  {t(`meals.categories.${meal.category}`)}
                </Badge>
              )}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t('meals.ingredients')}:
            </p>
            <div className="flex flex-wrap gap-1">
              {meal.ingredients.slice(0, 4).map((ingredient, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {ingredient}
                </Badge>
              ))}
              {meal.ingredients.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{meal.ingredients.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            {meal.additionalInfo}
          </p>

          {/* Action Button */}
          {onLogMeal && (
            <Button onClick={onLogMeal} className="w-full bg-secondary hover:bg-secondary/90">
              <Plus className="w-4 h-4 mr-2" />
              {t('meals.logMeal')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
