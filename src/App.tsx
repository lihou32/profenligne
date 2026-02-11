import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons";
import LiveConnect from "./pages/LiveConnect";
import AITutor from "./pages/AITutor";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import Pricing from "./pages/Pricing";
import AdminPanel from "./pages/AdminPanel";
import LessonRoom from "./pages/LessonRoom";
import LessonReport from "./pages/LessonReport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* App routes with sidebar layout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/live" element={<LiveConnect />} />
            <Route path="/ai-tutor" element={<AITutor />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/help" element={<Help />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/room/:id" element={<LessonRoom />} />
            <Route path="/report/:id" element={<LessonReport />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
