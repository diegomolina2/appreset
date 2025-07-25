
import { useState } from 'react';
import { Exercise } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Play, Clock, RotateCcw, Lock, Crown, Info } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { ExerciseTimer } from './ExerciseTimer';
import { hasAccessToContent } from '../utils/planManager';
import { UpgradePopup } from './UpgradePopup';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';

interface ExerciseCardProps {
  exercise: Exercise;
  onStart?: () => void;
  showCategory?: boolean;
}

export function ExerciseCard({ exercise, onStart, showCategory = true }: ExerciseCardProps) {
  const { t } = useTranslation();
  const { state, toggleFavorite } = useApp();
  const [showTimer, setShowTimer] = useState(false);
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const hasAccess = hasAccessToContent(exercise);
  const isLocked = !hasAccess;

  const isFavorite = state.userData.favorites.exercises.includes(exercise.id);

  const handleToggleFavorite = () => {
    if (isLocked) {
      setShowUpgradePopup(true);
      return;
    }
    toggleFavorite('exercises', exercise.id);
  };

  const handleStart = () => {
    if (isLocked) {
      setShowUpgradePopup(true);
      return;
    }
    
    setShowTimer(true);
    if (onStart) {
      onStart();
    }
  };

  const handleTimerComplete = () => {
    console.log('Exercise completed:', exercise.id);
    setShowTimer(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Light':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <Card className={`w-full shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden ${isLocked ? 'opacity-90' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-poppins font-bold text-gray-800 dark:text-gray-100 mb-1">
                {exercise.name}
              </CardTitle>
              {isLocked && <Lock className="w-4 h-4 text-gray-500" />}
            </div>
            
            {/* Show category */}
            {showCategory && exercise.category && (
              <Badge className={`text-xs mb-2 ${getCategoryColor(exercise.category)}`}>
                {t(`exercises.categories.${exercise.category}`)}
              </Badge>
            )}

            {/* Show unlock message if locked */}
            {isLocked && (
              <div className="space-y-2">
                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                  {t("exercises.upgradeRequired")}
                </Badge>
              </div>
            )}
          </div>
          
          <button
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full transition-colors ${
              isFavorite && !isLocked
                ? "bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-800 dark:text-red-300"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-500"
            }`}
          >
            <Heart
              className="w-5 h-5"
              fill={isFavorite && !isLocked ? "currentColor" : "none"}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Exercise Media - Show GIF or placeholder */}
          <div className="relative h-40 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
            {isLocked ? (
              <div className="flex items-center justify-center h-full">
                <Lock className="w-16 h-16 text-gray-400" />
              </div>
            ) : exercise.media ? (
              <img
                src={exercise.media}
                alt={`${exercise.name} demonstration`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Play className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Exercise Details */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
              {isLocked ? (
                <Lock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
              ) : (
                <Clock className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              )}
              <div className="text-sm font-bold text-blue-600">
                {isLocked ? "???" : exercise.duration}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {t('exercises.duration')}
              </div>
            </div>
            
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
              {isLocked ? (
                <Lock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
              ) : (
                <RotateCcw className="w-4 h-4 mx-auto text-green-600 mb-1" />
              )}
              <div className="text-sm font-bold text-green-600">
                {isLocked ? "???" : exercise.reps}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {t('exercises.reps')}
              </div>
            </div>
            
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
              {isLocked ? (
                <Lock className="w-4 h-4 mx-auto text-gray-400 mb-1" />
              ) : (
                <div className="w-4 h-4 mx-auto bg-purple-600 rounded-full mb-1"></div>
              )}
              <div className="text-sm font-bold text-purple-600">
                {isLocked ? "???" : exercise.rest}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {t('exercises.rest')}
              </div>
            </div>
          </div>

          {/* Instructions Preview - Show lock if locked */}
          {isLocked ? (
            <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded">
              <Lock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Instructions locked</span>
            </div>
          ) : (
            exercise.instructions && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {exercise.instructions}
                </p>
              </div>
            )
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            {isLocked ? (
              <Button
                onClick={() => setShowUpgradePopup(true)}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Crown className="w-4 h-4 mr-2" />
                {t("exercises.upgradeRequired")}
              </Button>
            ) : (
              <>
                <Button onClick={handleStart} className="flex-1 bg-primary hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-2" />
                  {t('exercises.startExercise')}
                </Button>
                
                <Dialog open={showDetails} onOpenChange={setShowDetails}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Info className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>{exercise.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {exercise.media && (
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={exercise.media}
                            alt={`${exercise.name} demonstration`}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-semibold mb-2">{t('exercises.instructions')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {exercise.instructions}
                        </p>
                      </div>
                      
                      {exercise.tips && (
                        <div>
                          <h4 className="font-semibold mb-2">{t('exercises.tips')}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {exercise.tips}
                          </p>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </CardContent>

      {/* Exercise Timer Modal */}
      <ExerciseTimer
        exercise={exercise}
        isOpen={showTimer}
        onClose={() => setShowTimer(false)}
        onComplete={handleTimerComplete}
      />
      
      {/* Upgrade Popup */}
      <UpgradePopup 
        isOpen={showUpgradePopup} 
        onClose={() => setShowUpgradePopup(false)}
        onUpgrade={() => {
          setShowUpgradePopup(false);
          window.location.reload();
        }}
      />
    </Card>
  );
}
