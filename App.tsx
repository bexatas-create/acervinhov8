
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from './firebase';
import CourseInternalPage from './components/CourseInternalPage';
import Login from './components/Login';
import CreateProfile from './components/CreateProfile';
import StudentProfile from './components/StudentProfile';
import Performance from './components/Performance';

// Componente utilitário para scroll automático no topo
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profileDoc = await getDoc(doc(db, "profiles", currentUser.uid));
          setHasProfile(profileDoc.exists());
        } catch (error) {
          console.error("Erro ao verificar perfil:", error);
          setHasProfile(false);
        }
      } else {
        setHasProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (hasProfile === false && location.pathname !== '/criar-perfil') {
    return <Navigate to="/criar-perfil" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/criar-perfil" element={
          <ProtectedRoute>
            <CreateProfile />
          </ProtectedRoute>
        } />

        {/* Home direciona diretamente para o curso único */}
        <Route path="/" element={
          <ProtectedRoute>
            <CourseInternalPage />
          </ProtectedRoute>
        } />

        <Route path="/perfil" element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        } />
        
        <Route path="/desempenho" element={
          <ProtectedRoute>
            <Performance />
          </ProtectedRoute>
        } />

        {/* Suporte para links antigos de curso */}
        <Route path="/curso/:id" element={<Navigate to="/" replace />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
