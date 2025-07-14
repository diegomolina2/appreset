import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Filter, Heart, Play } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { ExerciseCard } from '../components/ExerciseCard';
import exercisesData from '../data/exercises.json';

export default function Exercises() {
  const { t } = useTranslation();
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { userData } = state;
  const favoriteExercises = exercisesData.filter(exercise => 
    userData.favorites.exercises.includes(exercise.id)
  );

  const filteredExercises = exercisesData.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'Light', 'Moderate', 'Advanced'];
  const categoryCounts = {
    all: exercisesData.length,
    Light: exercisesData.filter(e => e.category === 'Light').length,
    Moderate: exercisesData.filter(e => e.category === 'Moderate').length,
    Advanced: exercisesData.filter(e => e.category === 'Advanced').length,
  };

  const ExerciseStats = () => (
    <div className="grid grid-cols-4 gap-2 mb-6">
      {categories.map((category) => (
        <Card 
          key={category}
          className={`text-center cursor-pointer transition-colors ${
            selectedCategory === category 
              ? 'border-primary bg-primary/10' 
              : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          onClick={() => setSelectedCategory(category)}
        >
          <CardContent className="p-3">
            <div className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {categoryCounts[category as keyof typeof categoryCounts]}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {category === 'all' ? 'All' : t(`exercises.categories.${category}`)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const handleStartExercise = (exerciseId: string) => {
    // Log the exercise in user's exercise history
    const userData = state.userData;
    const today = new Date().toISOString().split('T')[0];
    
    const newExerciseEntry = {
      exerciseId,
      date: today,
      duration: exercisesData.find(e => e.id === exerciseId)?.duration || 0,
      completed: true
    };
    
    const updatedUserData = {
      ...userData,
      exerciseHistory: [...userData.exerciseHistory, newExerciseEntry]
    };
    
    // Save to localStorage
    localStorage.setItem('wellness_tracker_data', JSON.stringify(updatedUserData));
    
    // Check for badge unlocks
    import('../utils/storage').then(({ checkAndUnlockBadges }) => {
      checkAndUnlockBadges();
    });
    
    alert(`Started ${exercisesData.find(e => e.id === exerciseId)?.name}! Keep up the good work!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
            {t('exercises.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Home-friendly exercises for every fitness level
          </p>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-2xl"
          />
        </div>

        <ExerciseStats />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Exercises</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favoriteExercises.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {/* Category Filter */}
            <div className="flex space-x-2 mb-4 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category === 'all' ? 'All' : t(`exercises.categories.${category}`)}
                  <Badge variant="secondary" className="ml-2">
                    {categoryCounts[category as keyof typeof categoryCounts]}
                  </Badge>
                </Button>
              ))}
            </div>

            {filteredExercises.length > 0 ? (
              <div className="grid gap-4">
                {filteredExercises.map((exercise) => (
                  <ExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    onStart={() => handleStartExercise(exercise.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No exercises found matching your criteria.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {favoriteExercises.length > 0 ? (
              <div className="grid gap-4">
                {favoriteExercises.map((exercise) => (
                  <ExerciseCard 
                    key={exercise.id}
                    exercise={exercise}
                    onStart={() => handleStartExercise(exercise.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No favorite exercises yet. Start adding exercises to your favorites!
                </p>
                <Button 
                  onClick={() => setSelectedCategory('all')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Browse All Exercises
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
