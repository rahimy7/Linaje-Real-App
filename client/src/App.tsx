import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/DashboardPage";
import MiembrosPage from "@/pages/MiembrosPage";
import EventosPage from "@/pages/EventosPage";
import OracionesPage from "@/pages/OracionesPage";
import CursosPage from "@/pages/CursosPage";
import ProgramaDetailPage from "@/pages/Cursos/ProgramaDetailPage";
import DonacionesPage from "@/pages/DonacionesPage";
import MeditacionesPage from "@/pages/MeditacionesPage";
import SobreNosotrosPage from "@/pages/SobreNosotrosPage";
import SettingsPage from "@/pages/SettingsPage";
import AppLayout from "@/components/layout/AppLayout";
import AdminJobsPage from "@/pages/AdminJobsPage";
import ForosPage from "@/pages/ForosPage";

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/miembros" component={MiembrosPage} />
        <Route path="/eventos" component={EventosPage} />
        <Route path="/oraciones" component={OracionesPage} />
        <Route path="/cursos" component={CursosPage} />
        <Route path="/cursos/:id/dias" component={ProgramaDetailPage} />
        <Route path="/foros" component={ForosPage} />
        <Route path="/admin/jobs" component={AdminJobsPage} />
        <Route path="/donaciones" component={DonacionesPage} />
        <Route path="/meditaciones" component={MeditacionesPage} />
        <Route path="/sobre-nosotros" component={SobreNosotrosPage} />
        <Route path="/configuracion" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
