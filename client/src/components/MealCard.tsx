
import React, { useState } from "react";
import { Meal } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Heart, Plus, Clock, Utensils } from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useApp } from "../contexts/AppContext";
import { MealLogDialog } from "./MealLogDialog";

interface MealCardProps {
  meal: Meal;
  onLogMeal?: () => void;
  showCategory?: boolean;
}

export function MealCard({
  meal,
  onLogMeal,
  showCategory = true,
}: MealCardProps) {
  const { t, currentLanguage } = useTranslation();
  const { state, toggleFavorite } = useApp();
  const [showLogDialog, setShowLogDialog] = useState(false);

  // All meals are now accessible
  const isLocked = false;

  const isFavorite = state.userData.favorites.meals.includes(meal.id);

  const handleToggleFavorite = () => {
    toggleFavorite("meals", meal.id);
  };

  const handleLogMealOriginal = () => {
    setShowLogDialog(true);
  };

  const handleConfirmLog = (date: string) => {
    // Create meal log entry
    const { dispatch } = useApp();
    const mealLog = {
      id: `${meal.id}-${Date.now()}`,
      mealId: meal.id,
      mealName: getMealName(),
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      date: date,
      time: new Date().toLocaleTimeString(),
      timestamp: new Date().toISOString(),
    };

    // For now, just call the callback
    // TODO: Implement proper meal logging if needed

    if (onLogMeal) {
      onLogMeal();
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "breakfast":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100";
      case "lunch":
        return "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100";
      case "dinner":
        return "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100";
      case "snack":
        return "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  // Get the meal name for the current language, fallback to English Nigeria
  const getMealName = () => {
    if (typeof meal.name === 'string') {
      return meal.name;
    }
    return meal.name[currentLanguage] || meal.name['en-NG'] || 'Meal';
  };

  // Get the meal description for the current language, fallback to English Nigeria
  const getMealDescription = () => {
    if (typeof meal.description === 'string') {
      return meal.description;
    }
    return meal.description?.[currentLanguage] || meal.description?.['en-NG'] || '';
  };


  return (
    <Card
      className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-poppins font-bold text-gray-800 dark:text-gray-100 mb-1">
                {getMealName()}
              </CardTitle>
            </div>
            
            {/* Show category */}
            {showCategory && meal.category && (
              <Badge className={`text-xs mb-2 ${getCategoryColor(meal.category)}`}>
                {t(`meals.categories.${meal.category}`)}
              </Badge>
            )}

          </div>
          
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite
                ? "bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-800 dark:text-red-300"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-500"
            }`}
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Meal Image */}
          <div className="relative h-40 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {meal.image ? (
              <img
                src={meal.image}
                alt={getMealName()}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Utensils className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Meal Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Utensils className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-primary">
                  {meal.calories} {t("common.calories")}
                </span>
              </div>
            </div>
          </div>

          {/* Nutritional Info */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="text-sm font-bold text-blue-600">{meal.protein}g</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Protein</div>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="text-sm font-bold text-green-600">{meal.carbs}g</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Carbs</div>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              <div className="text-sm font-bold text-purple-600">{meal.fats}g</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Fats</div>
            </div>
          </div>

          {/* Instructions */}
          {meal.instructions && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof meal.instructions === 'string' 
                  ? meal.instructions 
                  : (Array.isArray(meal.instructions) 
                    ? meal.instructions.join(', ') 
                    : meal.instructions[currentLanguage] || meal.instructions['en-NG'] || '')}
              </p>
            </div>
          )}

          {/* Action Button */}
          {onLogMeal && (
            <Button
              onClick={handleLogMealOriginal}
              className="w-full bg-secondary hover:bg-secondary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t("meals.logMeal")}
            </Button>
          )}
        </div>
      </CardContent>


      {/* Meal Log Dialog */}
      <MealLogDialog
        isOpen={showLogDialog}
        onClose={() => setShowLogDialog(false)}
        onConfirm={handleConfirmLog}
        mealName={getMealName()}
      />
    </Card>
  );
}
