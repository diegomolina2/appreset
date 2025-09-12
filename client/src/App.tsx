import React from "react";
import { Router, Route, Switch, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./components/ThemeProvider";
import { AppProvider, useApp } from "./contexts/AppContext";
import BottomNavigation from "./components/BottomNavigation";
import { FloatingActionButton } from "./components/FloatingActionButton";

// Pages
import Dashboard from "./pages/dashboard";
import Meals from "./pages/meals";
import Exercises from "./pages/exercises";
import Courses from "./pages/courses";
import CourseDetails from "./pages/course-details";
import Lesson from "./pages/lesson";

const LessonPage = Lesson;
import Badges from "./pages/badges";
import Challenges from "./pages/challenges";
import Progress from "./pages/progress";
import Settings from "./pages/settings";
import FAQ from "./pages/faq";
import Welcome from "./pages/welcome";
import Onboarding from "./pages/onboarding";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

function OnboardingRedirect() {
  const { state } = useApp();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    // Check if user has completed onboarding
    if (!state.isOnboarded && !state.userData.userProfile.name) {
      // Redirect to onboarding for first-time users
      setLocation("/onboarding");
    }
  }, [state.isOnboarded, state.userData.userProfile.name, setLocation]);

  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      <OnboardingRedirect />
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
      <FloatingActionButton />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </AppProvider>
  );
}
