
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { UserRole } from './types';

// Pages
import LandingPage from './pages/LandingPage';
import PropertyDetail from './pages/PropertyDetail';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './pages/AdminDashboard';
import ManageRooms from './pages/ManageRooms';
import ManageTenants from './pages/ManageTenants';
import Navbar from './components/Navbar';

// Standard ProtectedRoute component for role-based access control.
const ProtectedRoute: React.FC<{ children: React.ReactNode, role?: UserRole }> = ({ children, role }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/auth" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { user } = useAppContext();
  const location = useLocation();

  // Hide the global Navbar on the home page because it has its own custom navigation
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      {!isHomePage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role={UserRole.OWNER}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/rooms" element={
            <ProtectedRoute role={UserRole.OWNER}>
              <ManageRooms />
            </ProtectedRoute>
          } />
          <Route path="/admin/tenants" element={
            <ProtectedRoute role={UserRole.OWNER}>
              <ManageTenants />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xl font-bold text-white mb-4">KostMaster</p>
          <p>Solusi manajemen hunian masa depan.</p>
          <div className="mt-8 pt-8 border-t border-slate-800">
            &copy; 2024 KostMaster. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppContent />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
