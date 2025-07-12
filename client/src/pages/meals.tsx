import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Search, Heart, Utensils } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { useApp } from '../contexts/AppContext';
import { MealCard } from '../components/MealCard';
import mealsData from '../data/meals.json';

export default function Meals() {
  const { t } = useTranslation();
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { userData } = state;
  const favoriteMeals = mealsData.filter(meal => 
    userData.favorites.meals.includes(meal.id)
  );

  const filteredMeals = mealsData.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meal.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || meal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'snack'];
  const categoryCounts = {
    all: mealsData.length,
    breakfast: mealsData.filter(m => m.category === 'breakfast').length,
    lunch: mealsData.filter(m => m.category === 'lunch').length,
    dinner: mealsData.filter(m => m.category === 'dinner').length,
    snack: mealsData.filter(m => m.category === 'snack').length,
  };

  const MealStats = () => (
    <div className="grid grid-cols-5 gap-2 mb-6">
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
              {category === 'all' ? 'All' : t(`meals.categories.${category}`)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const handleLogMeal = (mealId: string) => {
    // Add meal logging logic here
    const today = new Date().toISOString().split('T')[0];
    console.log('Logging meal:', mealId, 'for date:', today);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-poppins font-bold text-gray-800 dark:text-gray-100">
            {t('meals.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Authentic West African cuisine for your wellness journey
          </p>
        </div>
      </header>

      <div className="px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search meals and ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-2xl"
          />
        </div>

        <MealStats />

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Meals</TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites ({favoriteMeals.length})
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
                  {category === 'all' ? 'All' : t(`meals.categories.${category}`)}
                  <Badge variant="secondary" className="ml-2">
                    {categoryCounts[category as keyof typeof categoryCounts]}
                  </Badge>
                </Button>
              ))}
            </div>

            {filteredMeals.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredMeals.map((meal) => (
                  <MealCard 
                    key={meal.id}
                    meal={meal}
                    onLogMeal={() => handleLogMeal(meal.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No meals found matching your criteria.
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {favoriteMeals.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {favoriteMeals.map((meal) => (
                  <MealCard 
                    key={meal.id}
                    meal={meal}
                    onLogMeal={() => handleLogMeal(meal.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No favorite meals yet. Start adding meals to your favorites!
                </p>
                <Button 
                  onClick={() => setSelectedCategory('all')}
                  className="bg-primary hover:bg-primary/90"
                >
                  Browse All Meals
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
