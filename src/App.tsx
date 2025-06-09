
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthForm from "./components/auth/AuthForm";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Data from "./pages/Data";
import Insights from "./pages/Insights";
import Layout from "./components/Layout";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading PediaPredict...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

// Admin Route Component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, userProfile, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading PediaPredict...</p>
        </div>
      </div>
    );
  }
  
  if (!currentUser || userProfile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

// Public Route Component (redirects to dashboard if logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading PediaPredict...</p>
        </div>
      </div>
    );
  }
  
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        <PublicRoute>
          <Index />
        </PublicRoute>
      } />
      <Route path="/auth" element={
        <PublicRoute>
          <AuthForm />
        </PublicRoute>
      } />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Assessment - Available to all authenticated users */}
      <Route path="/assessment" element={
        <ProtectedRoute>
          <Assessment />
        </ProtectedRoute>
      } />
      
      {/* Data - Available to all authenticated users */}
      <Route path="/data" element={
        <ProtectedRoute>
          <Data />
        </ProtectedRoute>
      } />
      
      {/* Admin Only Routes */}
      <Route path="/profile" element={
        <AdminRoute>
          <Profile />
        </AdminRoute>
      } />
      <Route path="/admin" element={
        <AdminRoute>
          <Admin />
        </AdminRoute>
      } />
      <Route path="/insights" element={
        <AdminRoute>
          <Insights />
        </AdminRoute>
      } />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
