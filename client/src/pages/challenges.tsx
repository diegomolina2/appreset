import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Play, CheckCircle, Calendar, Target, Award, Trophy, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { ChallengeCard } from '../components/ChallengeCard';
import challengesData from '../data/challenges.json';

export default function Challenges() {
  const { t } = useTranslation();
  const { state, startChallenge, restartChallenge } = useApp();
  const [selectedTab, setSelectedTab] = useState('available');
  // All challenges are now accessible

  // Helper function to ensure translation returns a string, not an object
  // If object is received, get the first valid string or convert to JSON string to avoid React error
  const safeTranslate = (key: string) => {
    const result = t(key);
    if (typeof result === 'string') return result;
    if (typeof result === 'object' && result !== null) {
      // If object, try to get the first key value
      const firstKey = Object.keys(result)[0];
      if (firstKey && typeof result[firstKey] === 'string') return result[firstKey];
      // fallback to convert object to string
      return JSON.stringify(result);
    }
    return '';
  };

  // All challenges are accessible - no need to check access

  const { userData } = state;
  const activeChallenges = Object.values(userData.challenges).filter(c => c.isActive);
  const completedChallenges = Object.values(userData.challenges).filter(c => c.completedDays.length === c.days);
  const availableChallenges = challengesData.filter(c => !userData.challenges[c.id] || !userData.challenges[c.id].isActive);

  // No plan restrictions needed

  const handleStartChallenge = (challengeId: string) => {
    // All challenges are accessible
    startChallenge(challengeId);
  };

  const handleRestartChallenge = (challengeId: string) => {
    restartChallenge(challengeId);
  };

  const ChallengeStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-3">
            <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{activeChallenges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('challenges.activeChallengesLabel')}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-3">
            <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">{completedChallenges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('challenges.completedChallengesLabel')}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">{availableChallenges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('challenges.availableChallengesLabel')}</div>
        </CardContent>
      </Card>
    </div>
  );

  const AvailableChallengeCard = ({ challenge }: { challenge: any }) => {
    return (
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
        <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-500" />

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {typeof challenge.name === 'string' ? challenge.name : safeTranslate(challenge.name)}
                </CardTitle>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{challenge.days} {t('challenges.daysLabel')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>{t('challenges.completeChallengeLabel')}</span>
                </div>
              </div>
            </div>

            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {typeof challenge.description === 'string' ? challenge.description : safeTranslate(challenge.description)}
          </p>

          <div className="space-y-3 mb-6">
            {challenge.dailyTasks && challenge.dailyTasks.slice(0, 3).map((task: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {typeof task.tasks[0] === 'string' ? task.tasks[0] : safeTranslate(task.tasks[0])}
                </span>
              </div>
            ))}
          </div>

          <Button
            className="w-full"
            onClick={() => handleStartChallenge(challenge.id)}
          >
            {t('challenges.startChallenge')}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const ActiveChallengeCard = ({ challenge }: { challenge: any }) => {
    const progress = (challenge.completedDays.length / challenge.days) * 100;

    return (
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
        <div className="h-2 bg-gradient-to-r from-green-400 to-teal-500" />

        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            {typeof challenge.name === 'string' ? challenge.name : safeTranslate(challenge.name)}
          </CardTitle>

          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {typeof challenge.description === 'string' ? challenge.description : safeTranslate(challenge.description)}
          </p>

          <Progress value={progress} className="mb-4" />

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{challenge.completedDays.length} / {challenge.days} {t('challenges.daysCompleted')}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Button className="w-full" onClick={() => restartChallenge(challenge.id)}>
            {t('challenges.restartChallenge')}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-8">{t('challenges.title')}</h1>

      <ChallengeStats />

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
        <TabsList>
          <TabsTrigger value="available">{t('challenges.available')}</TabsTrigger>
          <TabsTrigger value="active">{t('challenges.active')}</TabsTrigger>
          <TabsTrigger value="completed">{t('challenges.completed')}</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          {availableChallenges.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400">{t('challenges.noAvailable')}</p>
          )}

          {availableChallenges.map(challenge => (
            <AvailableChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          {activeChallenges.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400">{t('challenges.noActive')}</p>
          )}

          {activeChallenges.map(challenge => (
            <ActiveChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedChallenges.length === 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400">{safeTranslate('noCompletedChallenges') || 'Nenhum desafio concluído ainda.'}</p>
          )}

          {completedChallenges.map(challenge => (
            <Card key={challenge.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle>
                  {typeof challenge.name === 'string' ? challenge.name : safeTranslate(challenge.name)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{typeof challenge.description === 'string' ? challenge.description : safeTranslate(challenge.description)}</p>
                <Badge variant="secondary" className="mt-2">
                  {safeTranslate('completedBadge') || 'Concluído'}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Plan system removed - no upgrade popups needed */}
    </div>
  );
}
