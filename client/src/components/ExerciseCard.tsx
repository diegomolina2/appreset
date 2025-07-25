
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Play, Heart, Info, Timer, Pause, RotateCcw, Star } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { hasAccessToContent } from '../utils/planManager';

interface Exercise {
  id: string;
  name: string;
  category: string;
  duration?: string;
  reps?: string;
  rest?: string;
  description: string;
  media?: string;
  accessPlans?: number[];
}

interface ExerciseCardProps {
  exercise: Exercise;
  onStart: () => void;
}

export function ExerciseCard({ exercise, onStart }: ExerciseCardProps) {
  const { state, toggleFavorite } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  const isFavorite = state.userData.favorites.exercises.includes(exercise.id);
  const hasAccess = hasAccessToContent(exercise);
  
  // Convert duration to seconds for timer
  const getDurationInSeconds = () => {
    if (!exercise.duration) return 60; // default 1 minute
    const match = exercise.duration.match(/(\d+)/);
    return match ? parseInt(match[1]) * 60 : 60;
  };

  const handleStartTimer = () => {
    setTimer(getDurationInSeconds());
    setShowTimer(true);
    setIsRunning(true);
    
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setShowTimer(false);
          clearInterval(interval);
          onStart(); // Call the original onStart function
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(interval);
  };

  const handlePauseTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsRunning(!isRunning);
    
    if (!isRunning) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowTimer(false);
            clearInterval(interval);
            onStart();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimerInterval(interval);
    }
  };

  const handleResetTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimer(getDurationInSeconds());
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = () => {
    switch (exercise.category) {
      case 'Light': return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Moderate': return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
    }
  };

  return (
    <>
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${!hasAccess ? 'opacity-75' : 'hover:scale-[1.02]'}`}>
        <div className="relative">
          {/* Exercise Image/GIF Preview */}
          <div className="h-48 bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center relative overflow-hidden">
            {exercise.media ? (
              <img 
                src={exercise.media} 
                alt={exercise.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Demonstração em breve</p>
              </div>
            )}
            
            {/* Overlay with action buttons */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
              <Button
                size="sm"
                onClick={() => setShowDetails(true)}
                className="bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
              >
                <Info className="w-4 h-4 mr-1" />
                Info
              </Button>
              
              <Button
                size="sm"
                onClick={handleStartTimer}
                className="bg-green-500/80 backdrop-blur-sm text-white hover:bg-green-600/80"
                disabled={!hasAccess}
              >
                <Play className="w-4 h-4 mr-1" />
                Iniciar
              </Button>
            </div>
          </div>

          {/* Category Badge */}
          <Badge className={`absolute top-3 left-3 ${getCategoryColor()}`}>
            {exercise.category}
          </Badge>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite('exercises', exercise.id)}
            className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </Button>
        </div>

        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {exercise.name}
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {exercise.description}
          </p>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {exercise.duration && (
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Timer className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Duração</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {exercise.duration}
                </p>
              </div>
            )}
            
            {exercise.reps && (
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Star className="w-4 h-4 mx-auto mb-1 text-green-500" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Repetições</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {exercise.reps}
                </p>
              </div>
            )}
            
            {exercise.rest && (
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Pause className="w-4 h-4 mx-auto mb-1 text-orange-500" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Descanso</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {exercise.rest}
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              onClick={handleStartTimer}
              disabled={!hasAccess}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar Exercício
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowDetails(true)}
              className="flex-shrink-0"
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{exercise.name}</DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre o exercício
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Exercise GIF */}
            {exercise.media && (
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={exercise.media} 
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Exercise Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">Categoria</p>
                <p className="font-semibold">{exercise.category}</p>
              </div>
              
              {exercise.duration && (
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duração</p>
                  <p className="font-semibold">{exercise.duration}</p>
                </div>
              )}
            </div>
            
            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Descrição:</h4>
              <p className="text-gray-600 dark:text-gray-400">{exercise.description}</p>
            </div>
            
            <Button
              onClick={() => {
                setShowDetails(false);
                handleStartTimer();
              }}
              disabled={!hasAccess}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar Exercício
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Timer Dialog */}
      <Dialog open={showTimer} onOpenChange={setShowTimer}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{exercise.name}</DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-6">
            {/* Exercise GIF */}
            {exercise.media && (
              <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={exercise.media} 
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            {/* Timer Display */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray={`${(timer / getDurationInSeconds()) * 100}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    {formatTime(timer)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Timer Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={handlePauseTimer}
                variant="outline"
                size="sm"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                onClick={handleResetTimer}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
