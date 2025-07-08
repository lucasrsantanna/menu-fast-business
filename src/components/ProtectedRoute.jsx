import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { signInWithGoogle } from '@/firebase';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (result.user) {
      // Redireciona para o dashboard ou página principal
    } else {
      // Mostra erro
    }
  };

  if (loading) return null; // Ou um spinner de carregamento

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
} 