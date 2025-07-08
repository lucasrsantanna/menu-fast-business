import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import DashboardPage from '@/pages/DashboardPage';
import ProductsPage, { debitStockFromProductsPage } from '@/pages/ProductsPage';
import PromotionsPage from '@/pages/PromotionsPage';
import SchedulePostsPage from '@/pages/SchedulePostsPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';
import UsersPage from '@/pages/UsersPage';
import FeedbacksPage from '@/pages/FeedbacksPage';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import AuthPage from '@/pages/AuthPage';
import GoogleReviews from '@/components/GoogleReviews';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  const [hasNewOrder, setHasNewOrder] = useState(false);
  const [hasFailedPost, setHasFailedPost] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark'); 

    const orderInterval = setInterval(() => {
      const makeNewOrder = Math.random() < 0.1; 
      if (makeNewOrder) {
        setHasNewOrder(true);
        toast({
          title: "Novo Pedido Recebido!",
          description: "Um novo pedido acabou de chegar. Verifique o painel.",
          className: "bg-blue-500 text-white border-blue-500",
        });
      }
    }, 30000); 

    const postInterval = setInterval(() => {
      const makeFailedPost = Math.random() < 0.05;
      if (makeFailedPost) {
        setHasFailedPost(true);
        toast({
          title: "Falha no Agendamento!",
          description: "Um post agendado falhou ao ser publicado. Verifique a tela de posts.",
          variant: "destructive",
        });
      }
    }, 60000);

    return () => {
      clearInterval(orderInterval);
      clearInterval(postInterval);
    };
  }, [toast]);

  const clearNewOrderNotification = () => setHasNewOrder(false);
  const clearFailedPostNotification = () => setHasFailedPost(false);

  const handleFinalizeOrderForStock = (orderedItems) => {
    debitStockFromProductsPage(orderedItems);
  };

  return (
    <div id="app-root">
      <Router>
        <Routes>
          {/* Rota de login sem Layout */}
          <Route path="/login" element={<AuthPage />} />

          {/* Rotas protegidas/com Layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout 
                  hasNewOrder={hasNewOrder} 
                  clearNewOrderNotification={clearNewOrderNotification}
                  hasFailedPost={hasFailedPost}
                  clearFailedPostNotification={clearFailedPostNotification}
                >
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage onFinalizeOrderForStockUpdate={handleFinalizeOrderForStock} />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/promotions" element={<PromotionsPage />} />
                    <Route path="/schedule-posts" element={<SchedulePostsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/feedbacks" element={<FeedbacksPage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </Router>
      <GoogleReviews />
    </div>
  );
}

export default App;
