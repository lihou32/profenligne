import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ComingSoon from "./pages/ComingSoon";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons";
import LiveConnect from "./pages/LiveConnect";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import Pricing from "./pages/Pricing";
import AdminPanel from "./pages/AdminPanel";
import LessonRoom from "./pages/LessonRoom";
import LessonReport from "./pages/LessonReport";
import TutorReviews from "./pages/TutorReviews";
import TutorEarnings from "./pages/TutorEarnings";
import BuyCredits from "./pages/BuyCredits";
import AITutor from "./pages/AITutor";
import Profile from "./pages/Profile";
import SettingsPage from "./pages/Settings";

const queryClient = new QueryClient();

// Set to false to re-enable the full app
const COMING_SOON_MODE = true;

const App = () => {
  if (COMING_SOON_MODE) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ComingSoon />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/lessons" element={<Lessons />} />
                <Route path="/live" element={<LiveConnect />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/help" element={<Help />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/reviews" element={<TutorReviews />} />
                <Route path="/earnings" element={<ProtectedRoute requiredRole="tutor"><TutorEarnings /></ProtectedRoute>} />
                <Route path="/credits" element={<ProtectedRoute requiredRole="student"><BuyCredits /></ProtectedRoute>} />
                <Route path="/ai-tutor" element={<AITutor />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
                <Route path="/room/:id" element={<LessonRoom />} />
                <Route path="/report/:id" element={<LessonReport />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
