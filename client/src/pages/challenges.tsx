import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Play, CheckCircle, Calendar, Target, Award, Lock } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { ChallengeCard } from '../components/ChallengeCard';
import challengesData from '../data/challenges.json';
import { hasAccessToChallenge, getCurrentPlan, isAccessExpired } from '../utils/planManager';
import { UpgradePopup } from '../components/UpgradePopup';
import { PlanActivationDialog } from '../components/PlanActivation';

export default function Challenges() {
  const { t } = useTranslation();
  const { state, startChallenge, restartChallenge } = useApp();
  const [selectedTab, setSelectedTab] = useState('available');
  const [showUpgradePopup, setShowUpgradePopup] = useState(false);
  const [accessExpired, setAccessExpired] = useState(false);

  useEffect(() => {
    const checkAccess = () => {
      const expired = isAccessExpired();
      setAccessExpired(expired);
      if (expired) {
        setShowUpgradePopup(true);
      }
    };

    checkAccess();
    // Verificar a cada minuto
    const interval = setInterval(checkAccess, 60000);
    return () => clearInterval(interval);
  }, []);

  const { userData } = state;
  const activeChallenges = Object.values(userData.challenges).filter(c => c.isActive);
  const completedChallenges = Object.values(userData.challenges).filter(c => 
    c.completedDays.length === c.days
  );
  const availableChallenges = challengesData.filter(c => 
    !userData.challenges[c.id] || !userData.challenges[c.id].isActive
  );

  const currentPlan = getCurrentPlan();

  const handleStartChallenge = (challengeId: string) => {
    if (accessExpired) {
      setShowUpgradePopup(true);
      return;
    }

    if (!hasAccessToChallenge(challengeId)) {
      alert('Você não tem acesso a este desafio com seu plano atual. Faça upgrade para desbloqueá-lo.');
      return;
    }

    startChallenge(challengeId);
  };

  const handleRestartChallenge = (challengeId: string) => {
    restartChallenge(challengeId);
  };

  const ChallengeStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card className="text-center">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-primary">{activeChallenges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{completedChallenges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{availableChallenges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
        </CardContent>
      </Card>
    </div>
  );

  const AvailableChallengeCard = ({ challenge }: { challenge: any }) => {
    const hasAccess = hasAccessToChallenge(challenge.id);
    const isLocked = !hasAccess;

    return (
      <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${isLocked ? 'opacity-75' : ''}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-poppins font-bold text-gray-800 dark:text-gray-100">
                  {challenge.name}
                </CardTitle>
                {isLocked && (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {challenge.days} days challenge
              </p>
              {isLocked && (
                <Badge variant="secondary" className="mt-1 text-xs">
                  Requer upgrade do plano
                </Badge>
              )}
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isLocked 
                ? 'bg-gray-300 dark:bg-gray-600' 
                : 'bg-gradient-to-br from-primary to-secondary'
            }`}>
              {isLocked ? (
                <Lock className="w-6 h-6 text-gray-600" />
              ) : (
                <Target className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {challenge.description}
          </p>
          
          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sample daily tasks:</p>
            {challenge.dailyTasks.slice(0, 3).map((task: any, index: number) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                • {task.tasks[0]}
              </div>
            ))}
          </div>

          <Button 
            onClick={() => handleStartChallenge(challenge.id)}
            disabled={isLocked}
            className={`w-full ${isLocked ? 'bg-gray-400' : 'bg-primary hover:bg-primary/90'}`}
          >
            {isLocked ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Upgrade Required
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {t('challenges.startChallenge')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  const CompletedChallengeCard = ({ challenge }: { challenge: any }) => (
    <Card className="shadow-lg border-2 border-green-200 dark:border-green-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-poppins font-bold text-gray-800 dark:text-gray-100">
              {challenge.name}
            </CardTitle>
            <p className="text-sm text-green-600 dark:text-green-400">
              Completed! 🎉
            </p>
          </div>
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="text-sm font-medium text-green-600">100%</span>
          </div>
          <Progress value={100} className="w-full" />
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Started: {challenge.startDate}</span>
            </div>
          </div>
          
          <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <Award className="w-3 h-3 mr-1" />
            Challenge Completed
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const handleUpgrade = () => {
    setShowUpgradePopup(false);
    setAccessExpired(false);
    // Recarregar a página para atualizar o estado
    window.location.reload();
  };

  // Se o acesso expirou, mostrar apenas o popup
  if (accessExpired) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Acesso Expirado
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Seu plano expirou. Faça upgrade para continuar usando o aplicativo.
            </p>
            <PlanActivationDialog onActivation={handleUpgrade} />
          </div>
        </div>
        <UpgradePopup 
          isOpen={showUpgradePopup} 
          onClose={() => setShowUpgradePopup(false)}
          onUpgrade={handleUpgrade}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
                {t('challenges.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Transform your health with structured challenges
              </p>
            </div>
            {currentPlan && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                {currentPlan.name}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        <ChallengeStats />

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="active">Active ({activeChallenges.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedChallenges.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-6">
            {availableChallenges.length > 0 ? (
              <div className="grid gap-4">
                {availableChallenges.map((challenge) => (
                  <AvailableChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No available challenges. All challenges are already started or completed!
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            {activeChallenges.length > 0 ? (
              <div className="grid gap-4">
                {activeChallenges.map((challenge) => (
                  <ChallengeCard 
                    key={challenge.id}
                    challenge={challenge}
                    onRestart={() => handleRestartChallenge(challenge.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No active challenges. Start your wellness journey today!
                </p>
                <Button 
                  onClick={() => setSelectedTab('available')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Browse Available Challenges
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedChallenges.length > 0 ? (
              <div className="grid gap-4">
                {completedChallenges.map((challenge) => (
                  <CompletedChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No completed challenges yet. Complete your first challenge to see it here!
                </p>
                <Button 
                  onClick={() => setSelectedTab('available')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Start Your First Challenge
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <UpgradePopup 
        isOpen={showUpgradePopup} 
        onClose={() => setShowUpgradePopup(false)}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
}
