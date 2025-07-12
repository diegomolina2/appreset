import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Award, Lock, Star, Trophy, Target, Zap } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { BadgeCard } from '../components/BadgeCard';

// Predefined badge system
const AVAILABLE_BADGES = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Completed your first day of any challenge',
    icon: '🏃‍♂️',
    category: 'milestone',
    requirement: 'Complete day 1 of any challenge'
  },
  {
    id: 'hydrated',
    name: 'Hydrated',
    description: 'Hit water goal for 7 consecutive days',
    icon: '💧',
    category: 'consistency',
    requirement: 'Log water intake for 7 days in a row'
  },
  {
    id: 'consistent',
    name: 'Consistent',
    description: 'Maintained a 7-day activity streak',
    icon: '⚡',
    category: 'consistency',
    requirement: 'Complete any activity for 7 days straight'
  },
  {
    id: 'no_sugar_hero',
    name: 'No Sugar Hero',
    description: 'Completed the 30-day no sugar challenge',
    icon: '🍎',
    category: 'challenge',
    requirement: 'Complete the 30-Day No Sugar challenge'
  },
  {
    id: 'halfway',
    name: 'Halfway',
    description: 'Reached 50% completion of any challenge',
    icon: '🎯',
    category: 'milestone',
    requirement: 'Complete 50% of any challenge'
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Completed a full week challenge',
    icon: '🏆',
    category: 'challenge',
    requirement: 'Complete any 7-day challenge'
  },
  {
    id: 'month_master',
    name: 'Month Master',
    description: 'Completed a month-long challenge',
    icon: '👑',
    category: 'challenge',
    requirement: 'Complete any 30-day challenge'
  },
  {
    id: 'exercise_enthusiast',
    name: 'Exercise Enthusiast',
    description: 'Completed 20 different exercises',
    icon: '💪',
    category: 'activity',
    requirement: 'Try 20 different exercises'
  },
  {
    id: 'healthy_eater',
    name: 'Healthy Eater',
    description: 'Logged meals for 14 consecutive days',
    icon: '🥗',
    category: 'nutrition',
    requirement: 'Log meals for 14 days in a row'
  },
  {
    id: 'water_champion',
    name: 'Water Champion',
    description: 'Hit daily water goal for 30 days',
    icon: '🌊',
    category: 'consistency',
    requirement: 'Meet water intake goal for 30 days'
  }
];

export default function Badges() {
  const { t } = useTranslation();
  const { state } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { userData } = state;
  
  // Create badge objects with unlock status
  const allBadges = AVAILABLE_BADGES.map(badge => {
    const unlockedBadge = userData.badges.find(b => b.id === badge.id);
    return {
      ...badge,
      isUnlocked: !!unlockedBadge,
      unlockedAt: unlockedBadge?.unlockedAt
    };
  });

  const unlockedBadges = allBadges.filter(badge => badge.isUnlocked);
  const lockedBadges = allBadges.filter(badge => !badge.isUnlocked);

  const categories = ['all', 'milestone', 'consistency', 'challenge', 'activity', 'nutrition'];
  
  const filteredBadges = selectedCategory === 'all' 
    ? allBadges 
    : allBadges.filter(badge => badge.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'milestone': return <Target className="w-4 h-4" />;
      case 'consistency': return <Zap className="w-4 h-4" />;
      case 'challenge': return <Trophy className="w-4 h-4" />;
      case 'activity': return <Star className="w-4 h-4" />;
      case 'nutrition': return <Award className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const BadgeStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card className="text-center">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{unlockedBadges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Unlocked</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-gray-400">{lockedBadges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Locked</div>
        </CardContent>
      </Card>
      <Card className="text-center">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{allBadges.length}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
            {t('badges.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Celebrate your wellness milestones
          </p>
        </div>
      </header>

      <div className="px-4 py-6">
        <BadgeStats />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Badges</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked ({unlockedBadges.length})</TabsTrigger>
            <TabsTrigger value="locked">Locked ({lockedBadges.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {/* Category Filter */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category !== 'all' && getCategoryIcon(category)}
                  <span>{category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBadges.map((badge) => (
                <div key={badge.id}>
                  <BadgeCard badge={badge} showDate={true} />
                  {!badge.isUnlocked && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                      {badge.requirement}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unlocked" className="mt-6">
            {unlockedBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {unlockedBadges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} showDate={true} />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No badges unlocked yet. Start completing challenges to earn your first badge!
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="locked" className="mt-6">
            {lockedBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {lockedBadges.map((badge) => (
                  <div key={badge.id}>
                    <BadgeCard badge={badge} />
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                      {badge.requirement}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Congratulations! You've unlocked all available badges!
                </p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
