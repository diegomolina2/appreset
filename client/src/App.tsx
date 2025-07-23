
import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppProvider } from '@/contexts/AppContext';
import BottomNavigation from '@/components/BottomNavigation';

// Import pages
import Dashboard from '@/pages/dashboard';
import Challenges from '@/pages/challenges';
import Exercises from '@/pages/exercises';
import Meals from '@/pages/meals';
import Progress from '@/pages/progress';
import Badges from '@/pages/badges';
import Courses from '@/pages/courses';
import CourseDetails from '@/pages/course-details';
import LessonPage from '@/pages/lesson';
import FAQ from '@/pages/faq';
import Settings from '@/pages/settings';
import Welcome from '@/pages/welcome';
import Onboarding from '@/pages/onboarding';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/challenges" component={Challenges} />
          <Route path="/exercises" component={Exercises} />
          <Route path="/meals" component={Meals} />
          <Route path="/progress" component={Progress} />
          <Route path="/badges" component={Badges} />
          <Route path="/courses" component={Courses} />
          <Route path="/course/:id">
            {(params) => <CourseDetails params={params} />}
          </Route>
          <Route path="/lesson/:courseId/:moduleId/:lessonId">
            {(params) => (
              <LessonPage
                courseId={params.courseId}
                moduleId={params.moduleId}
                lessonId={params.lessonId}
              />
            )}
          </Route>
          <Route path="/faq" component={FAQ} />
          <Route path="/settings" component={Settings} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/onboarding" component={Onboarding} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNavigation />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
