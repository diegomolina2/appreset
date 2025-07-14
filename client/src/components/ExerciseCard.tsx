import { useState } from 'react';
import { Exercise } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Heart, Play, Clock, RotateCcw } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { ExerciseTimer } from './ExerciseTimer';

interface ExerciseCardProps {
  exercise: Exercise;
  onStart?: () => void;
  showCategory?: boolean;
}

interface Exercise {
  id: string;
  name: string;
  category: string;
  duration: number;
  instructions: string;
  tips: string;
  difficulty: string;
  media?: string;
}

export function ExerciseCard({ exercise, onStart, showCategory = true }: ExerciseCardProps) {
  const { t } = useTranslation();
  const { state, toggleFavorite } = useApp();
  const [showTimer, setShowTimer] = useState(false);

  const isFavorite = state.userData.favorites.exercises.includes(exercise.id);

  const handleToggleFavorite = () => {
    toggleFavorite('exercises', exercise.id);
  };

  const handleStart = () => {
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
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-poppins font-bold text-gray-800 dark:text-gray-100 mb-1">
              {exercise.name}
            </CardTitle>
            {exercise.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {exercise.description}
              </p>
            )}
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
          {/* Category Badge */}
          {showCategory && (
            <div className="flex items-center justify-between">
              <Badge className={`text-xs ${getCategoryColor(exercise.category)}`}>
                {t(`exercises.categories.${exercise.category}`)}
              </Badge>
            </div>
          )}

          {/* Exercise Details */}
          <div className="grid grid-cols-2 gap-4">
            {exercise.duration && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('exercises.duration')}
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {exercise.duration}
                  </p>
                </div>
              </div>
            )}

            {exercise.reps && (
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('exercises.reps')}
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {exercise.reps}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Rest Time */}
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('exercises.rest')}
              </p>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {exercise.rest}
              </p>
            </div>
          </div>

          {/* Action Button */}
          <Button onClick={handleStart} className="w-full bg-primary hover:bg-primary/90">
            <Play className="w-4 h-4 mr-2" />
            {t('exercises.startExercise')}
          </Button>
        </div>
              {exercise.media && (
            <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img 
                src={exercise.media} 
                alt={`${exercise.name} demonstration`}
                className="w-full h-32 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
      </CardContent>

      {/* Exercise Timer Modal */}
      <ExerciseTimer
        exercise={exercise}
        isOpen={showTimer}
        onClose={() => setShowTimer(false)}
        onComplete={handleTimerComplete}
      />
    </Card>
  );
}