import React from 'react';
import { Challenge } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Circle, Play, ArrowRight, RotateCcw } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';

interface ChallengeCardProps {
  challenge: Challenge;
  onStart?: () => void;
  onContinue?: () => void;
  onViewDetails?: () => void;
  onRestart?: () => void;
}

export function ChallengeCard({ challenge, onStart, onContinue, onViewDetails, onRestart }: ChallengeCardProps) {
  const { t } = useTranslation();
  const { completeTask, uncompleteTask } = useApp();

  const progressPercentage = (challenge.completedDays.length / challenge.days) * 100;
  const currentDayTasks = challenge.dailyTasks.find(task => task.day === challenge.currentDay);

  const handleTaskToggle = (taskIndex: number) => {
    if (currentDayTasks?.completed[taskIndex]) {
      uncompleteTask(challenge.id, challenge.currentDay, taskIndex);
    } else {
      completeTask(challenge.id, challenge.currentDay, taskIndex);
    }
  };

  return (
    <Card className="w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-poppins font-bold text-gray-800 dark:text-gray-100">
              {challenge.name}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('challenges.dayOf', { current: challenge.currentDay, total: challenge.days })}
            </p>
          </div>
          <div className="relative w-16 h-16">
            <Progress value={progressPercentage} className="w-16 h-16" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3 mb-4">
          {currentDayTasks?.tasks.map((task, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleTaskToggle(index)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    currentDayTasks.completed[index]
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                >
                  {currentDayTasks.completed[index] ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Circle className="w-3 h-3" />
                  )}
                </button>
                <span className={`text-sm ${
                  currentDayTasks.completed[index] 
                    ? 'line-through text-gray-500 dark:text-gray-400' 
                    : 'text-gray-700 dark:text-gray-200'
                }`}>
                  {task}
                </span>
              </div>
              {currentDayTasks.completed[index] && (
                <Badge variant="secondary" className="text-xs">
                  {t('challenges.completed')}
                </Badge>
              )}
            </div>
          ))}
        </div>

        <div className="flex space-x-2">
          {!challenge.isActive && onStart && (
            <Button onClick={onStart} className="flex-1 bg-primary hover:bg-primary/90">
              <Play className="w-4 h-4 mr-2" />
              {t('challenges.startChallenge')}
            </Button>
          )}
          
          {challenge.isActive && onContinue && (
            <Button onClick={onContinue} className="flex-1 bg-secondary hover:bg-secondary/90">
              {t('challenges.continueChallenge')}
            </Button>
          )}
          
          {challenge.isActive && onRestart && (
            <Button onClick={onRestart} variant="outline" className="flex-shrink-0">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          )}
          
          {onViewDetails && (
            <Button onClick={onViewDetails} variant="outline" className="flex-1">
              {t('challenges.viewDetails')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
