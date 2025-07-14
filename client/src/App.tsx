import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "./contexts/AppContext";
import { ThemeProvider } from "./components/ThemeProvider";
import NotFound from "@/pages/not-found";
import Welcome from "./pages/welcome";
import Onboarding from "./pages/onboarding";
import Dashboard from "./pages/dashboard";
import Challenges from "./pages/challenges";
import Exercises from "./pages/exercises";
import Meals from "./pages/meals";
import Progress from "./pages/progress";
import Badges from "./pages/badges";
import FAQ from "./pages/faq";
import Settings from './pages/settings';
import BottomNavigation from "./components/BottomNavigation";
import { useApp } from "./contexts/AppContext";
import { useLocation } from "wouter";

function AppContent() {
  const { state } = useApp();
  const [location] = useLocation();

  const hideBottomNav = ['/', '/onboarding'].includes(location);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Switch>
        <Route path="/">
          {state.isOnboarded ? <Redirect to="/dashboard" /> : <Welcome />}
        </Route>
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/challenges" component={Challenges} />
        <Route path="/exercises" component={Exercises} />
        <Route path="/meals" component={Meals} />
        <Route path="/progress" component={Progress} />
        <Route path="/badges" component={Badges} />
        <Route path="/faq" component={FAQ} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>

      {!hideBottomNav && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;