import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import JoinQueue from './pages/JoinQueue';
import MyQueue from './pages/MyQueue';
import History from './pages/History';
import AdminDashboard from './pages/AdminDashboard';
import Counters from './pages/Counters';
import Reports from './pages/Reports';

// Protect Customer-facing pages
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <span className="h-8 w-8 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Protect Admin-only pages
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        <span className="h-8 w-8 border-4 border-indigo-500/25 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  return user && user.role === 'ROLE_ADMIN' ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Protected Routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/join-queue" element={
            <ProtectedRoute>
              <JoinQueue />
            </ProtectedRoute>
          } />
          <Route path="/my-queue" element={
            <ProtectedRoute>
              <MyQueue />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/counters" element={
            <AdminRoute>
              <Counters />
            </AdminRoute>
          } />
          <Route path="/admin/reports" element={
            <AdminRoute>
              <Reports />
            </AdminRoute>
          } />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
