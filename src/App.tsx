import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ComingSoon from "./pages/ComingSoon";

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

  // Full app (lazy-loaded only when needed)
  return <FullApp />;
};

// Keep full app separate so it's not loaded in coming soon mode
const FullApp = () => {
  // Dynamic imports would go here, but for simplicity we keep static
  const { AuthProvider } = require("@/hooks/useAuth");
  const { ProtectedRoute } = require("@/components/auth/ProtectedRoute");
  const { AppLayout } = require("@/components/layout/AppLayout");
  const Index = require("./pages/Index").default;
  const NotFound = require("./pages/NotFound").default;
  const Login = require("./pages/Login").default;
  const Signup = require("./pages/Signup").default;
  const ForgotPassword = require("./pages/ForgotPassword").default;
  const ResetPassword = require("./pages/ResetPassword").default;
  const Dashboard = require("./pages/Dashboard").default;
  const Lessons = require("./pages/Lessons").default;
  const LiveConnect = require("./pages/LiveConnect").default;
  const Notifications = require("./pages/Notifications").default;
  const Help = require("./pages/Help").default;
  const Pricing = require("./pages/Pricing").default;
  const AdminPanel = require("./pages/AdminPanel").default;
  const LessonRoom = require("./pages/LessonRoom").default;
  const LessonReport = require("./pages/LessonReport").default;
  const TutorReviews = require("./pages/TutorReviews").default;
  const TutorEarnings = require("./pages/TutorEarnings").default;
  const BuyCredits = require("./pages/BuyCredits").default;
  const AITutor = require("./pages/AITutor").default;
  const Profile = require("./pages/Profile").default;
  const SettingsPage = require("./pages/Settings").default;

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
                <Route path="/earnings" element={<TutorEarnings />} />
                <Route path="/credits" element={<BuyCredits />} />
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
