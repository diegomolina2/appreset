
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { Play, CheckCircle, Calendar, Target, Award, Lock, Trophy, Sparkles } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { ChallengeCard } from '../components/ChallengeCard';
import challengesData from '../data/challenges.json';
import { hasAccessToChallenge, getCurrentPlan, isAccessExpired, hasAccessToContent } from '../utils/planManager';
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

    const challenge = challengesData.find(c => c.id === challengeId);
    if (challenge && !hasAccessToContent(challenge)) {
      setShowUpgradePopup(true);
      return;
    }

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
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
            {activeChallenges.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Ativos
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-3">
            <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
            {completedChallenges.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Concluídos
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {availableChallenges.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Disponíveis
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const AvailableChallengeCard = ({ challenge }: { challenge: any }) => {
    const hasAccess = hasAccessToContent(challenge);
    const isLocked = !hasAccess;

    return (
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl ${isLocked ? 'opacity-75' : 'hover:scale-[1.02]'}`}>
        <div className={`h-2 ${isLocked ? 'bg-gray-300' : 'bg-gradient-to-r from-blue-400 to-purple-500'}`} />
        
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  {challenge.name}
                </CardTitle>
                {isLocked && <Lock className="w-5 h-5 text-gray-500" />}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{challenge.days} dias</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  <span>Desafio Completo</span>
                </div>
              </div>
            </div>
            
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              isLocked 
                ? 'bg-gray-100 dark:bg-gray-700' 
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }`}>
              {isLocked ? (
                <Lock className="w-8 h-8 text-gray-500" />
              ) : (
                <Target className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {challenge.description}
          </p>
          
          <div className="space-y-3 mb-6">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Exemplos de tarefas diárias:
            </p>
            <div className="space-y-2">
              {challenge.dailyTasks.slice(0, 3).map((task: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {task.tasks[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {isLocked ? (
            <>
              <Badge variant="secondary" className="mb-4 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                Requer upgrade do plano
              </Badge>
              <Button 
                onClick={() => setShowUpgradePopup(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-300"
              >
                <Lock className="w-4 h-4 mr-2" />
                Fazer Upgrade
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => handleStartChallenge(challenge.id)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300"
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar Desafio
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const CompletedChallengeCard = ({ challenge }: { challenge: any }) => (
    <Card className="overflow-hidden border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
      <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-500" />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {challenge.name}
              </CardTitle>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-green-600 dark:text-green-400 font-semibold">
              Desafio Concluído! 🎉
            </p>
          </div>
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progresso</span>
            <span className="font-bold text-green-600 dark:text-green-400">100% Completo</span>
          </div>
          <Progress value={100} className="h-3 bg-green-200" />
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Iniciado: {challenge.startDate}</span>
            </div>
          </div>
          
          <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
            <Award className="w-3 h-3 mr-1" />
            Desafio Concluído
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const handleUpgrade = () => {
    setShowUpgradePopup(false);
    setAccessExpired(false);
    window.location.reload();
  };

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
        <div className="px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Desafios
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Transforme sua saúde com desafios estruturados
              </p>
            </div>
            {currentPlan && (
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 px-4 py-2 text-sm font-semibold">
                {currentPlan.name}
              </Badge>
            )}
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <ChallengeStats />

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <TabsTrigger value="available" className="rounded-lg font-semibold">
              Disponíveis
            </TabsTrigger>
            <TabsTrigger value="active" className="rounded-lg font-semibold">
              Ativos ({activeChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg font-semibold">
              Concluídos ({completedChallenges.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-0">
            {availableChallenges.length > 0 ? (
              <div className="grid gap-6">
                {availableChallenges.map((challenge) => (
                  <AvailableChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Nenhum desafio disponível
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Todos os desafios já foram iniciados ou concluídos!
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            {activeChallenges.length > 0 ? (
              <div className="grid gap-6">
                {activeChallenges.map((challenge) => (
                  <ChallengeCard 
                    key={challenge.id}
                    challenge={challenge}
                    onRestart={() => handleRestartChallenge(challenge.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-10 h-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Nenhum desafio ativo
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Inicie sua jornada de bem-estar hoje mesmo!
                </p>
                <Button 
                  onClick={() => setSelectedTab('available')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl"
                >
                  Ver Desafios Disponíveis
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            {completedChallenges.length > 0 ? (
              <div className="grid gap-6">
                {completedChallenges.map((challenge) => (
                  <CompletedChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  Nenhum desafio concluído ainda
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Complete seu primeiro desafio para vê-lo aqui!
                </p>
                <Button 
                  onClick={() => setSelectedTab('available')}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-xl"
                >
                  Iniciar Primeiro Desafio
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
