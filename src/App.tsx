/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ConfigWarning from './components/ConfigWarning';
import { isSupabaseConfigured } from './lib/supabase';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import RequestProposal from './pages/RequestProposal';
import ProposalForm from './pages/ProposalForm';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageProjects from './pages/admin/ManageProjects';
import ManageServices from './pages/admin/ManageServices';
import ManageTestimonials from './pages/admin/ManageTestimonials';
import ViewLeads from './pages/admin/ViewLeads';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="gpu-accelerate">
      {children}
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex min-h-screen flex-col bg-white text-luxury-ink selection:bg-luxury-gold/20 selection:text-luxury-gold">
      {!isSupabaseConfigured && <ConfigWarning />}
      
      {/* Only show public navbar on non-admin pages */}
      {!isAdminPath && <Navbar />}

      <main className="flex-grow">
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/services/:id" element={<PageWrapper><ServiceDetail /></PageWrapper>} />
          <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
          <Route path="/projects/:id" element={<PageWrapper><ProjectDetail /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/request-proposal" element={<PageWrapper><RequestProposal /></PageWrapper>} />
          <Route path="/proposal-form" element={<PageWrapper><ProposalForm /></PageWrapper>} />

          {/* Admin Login - No Layout */}
          <Route path="/admin/login" element={<PageWrapper><Login /></PageWrapper>} />

          {/* Protected Admin Routes - Wrapped in AdminLayout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout><PageWrapper><Dashboard /></PageWrapper></AdminLayout>} />
            <Route path="/admin/projects" element={<AdminLayout><PageWrapper><ManageProjects /></PageWrapper></AdminLayout>} />
            <Route path="/admin/services" element={<AdminLayout><PageWrapper><ManageServices /></PageWrapper></AdminLayout>} />
            <Route path="/admin/testimonials" element={<AdminLayout><PageWrapper><ManageTestimonials /></PageWrapper></AdminLayout>} />
            <Route path="/admin/leads" element={<AdminLayout><PageWrapper><ViewLeads /></PageWrapper></AdminLayout>} />
          </Route>
        </Routes>
      </main>

      {/* Only show public footer on non-admin pages */}
      {!isAdminPath && <Footer />}
      <Toaster position="top-right" theme="light" richColors />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
