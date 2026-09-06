import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Goals from "./pages/Goals";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Assistant from "./pages/Assistant";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loadingUser } = useAuth();
  if (loadingUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted text-lg">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-bg text-white overflow-x-hidden">
        <div className="app-grid pointer-events-none absolute inset-x-0 top-0 h-[42rem] opacity-70" />
        <Navbar />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
