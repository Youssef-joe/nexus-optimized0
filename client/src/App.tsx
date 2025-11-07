// Reference: javascript_log_in_with_replit blueprint
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Header } from "./components/Header";
import { useAuth } from "./hooks/useAuth";

// Pages
import Landing from "@/pages/Landing";
import Onboarding from "@/pages/Onboarding";
import NotFound from "@/pages/not-found";
import BrowseProfessionals from "@/pages/BrowseProfessionals";

// Professional Pages
import ProfessionalProfileSetup from "@/pages/professional/ProfessionalProfileSetup";
import ProfessionalDashboard from "@/pages/professional/ProfessionalDashboard";

// Company Pages
import CompanyProfileSetup from "@/pages/company/CompanyProfileSetup";
import CompanyDashboard from "@/pages/company/CompanyDashboard";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading" />
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          {/* Public Routes */}
          <Route path="/" component={Landing} />
          <Route path="/professionals" component={BrowseProfessionals} />
        </>
      ) : (
        <>
          {/* Authenticated Routes */}
          {!user?.userType || user.userType === 'professional' ? (
            <>
              {/* Professional Routes */}
              <Route path="/" component={ProfessionalDashboard} />
              <Route path="/professional/profile/setup" component={ProfessionalProfileSetup} />
              <Route path="/professional/dashboard" component={ProfessionalDashboard} />
              <Route path="/professionals" component={BrowseProfessionals} />
              <Route path="/onboarding" component={Onboarding} />
            </>
          ) : user.userType === 'company' ? (
            <>
              {/* Company Routes */}
              <Route path="/" component={CompanyDashboard} />
              <Route path="/company/profile/setup" component={CompanyProfileSetup} />
              <Route path="/company/dashboard" component={CompanyDashboard} />
              <Route path="/professionals" component={BrowseProfessionals} />
              <Route path="/onboarding" component={Onboarding} />
            </>
          ) : (
            <>
              {/* Onboarding */}
              <Route path="/" component={Onboarding} />
              <Route path="/onboarding" component={Onboarding} />
            </>
          )}
        </>
      )}
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
