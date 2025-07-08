import React, { useState, useEffect } from 'react';
import { getFirestore, collection, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, Smile, Meh, Frown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const RatingIcon = ({ rating }) => {
  if (rating >= 4) return <Smile className="h-5 w-5 text-green-500" />;
  if (rating === 3) return <Meh className="h-5 w-5 text-yellow-500" />;
  return <Frown className="h-5 w-5 text-red-500" />;
};

const FeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [empresaId, setEmpresaId] = useState(null);
  const [googleReviews, setGoogleReviews] = useState([]);
  const db = getFirestore();

  // Obter empresaId (UID do usuário autenticado)
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setEmpresaId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Buscar feedbacks da subcoleção Firestore
  useEffect(() => {
    if (!empresaId) return;
    const feedbacksRef = collection(db, 'empresas', empresaId, 'feedbacks');
    const q = query(feedbacksRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const feedbacksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFeedbacks(feedbacksData);
    });
    return () => unsubscribe();
  }, [empresaId]);

  // Buscar avaliações do Google via Cloud Function
  useEffect(() => {
    const fetchGoogleReviews = async () => {
      try {
        const url = `https://us-central1-menu-fast-a836a.cloudfunctions.net/getGoogleReviews?placeId=ChIJwd3xgpljzZQRxjbOHBcjjS4`;
        const res = await fetch(url);
        const data = await res.json();
        console.log('Google Reviews API response:', data); // <-- debug
        if (data.reviews) {
          setGoogleReviews(data.reviews);
        }
      } catch (e) {
        console.error('Erro ao buscar Google Reviews:', e); // <-- debug
      }
    };
    fetchGoogleReviews();
  }, []);

  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, curr) => acc + (curr.rating || 0), 0) / feedbacks.length).toFixed(1)
    : 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Star className="h-8 w-8 text-primary" /> Feedbacks dos Clientes
        </h1>
        <p className="text-muted-foreground">Veja o que seus clientes estão dizendo.</p>
      </header>

      <Card className="shadow-md bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Média Geral das Avaliações</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Star className={`h-10 w-10 ${averageRating >=4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground' }`} />
          <span className="text-4xl font-bold text-foreground">{averageRating}</span>
          <span className="text-muted-foreground">de 5 estrelas ({feedbacks.length} avaliações)</span>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Últimos Feedbacks Recebidos</h2>
        {/* Feedbacks internos Firestore */}
        {feedbacks.length === 0 && googleReviews.length === 0 && <p className="text-muted-foreground">Nenhum feedback recebido ainda.</p>}
        {feedbacks.map(fb => (
          <Card key={fb.id} className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-md font-semibold text-foreground">{fb.customerName}</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Em: {fb.date ? format(new Date(fb.date), "dd/MM/yyyy 'às' HH:mm", {locale: ptBR}) : ''}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < fb.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                  ))}
                  <RatingIcon rating={fb.rating} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{fb.comment}</p>
            </CardContent>
          </Card>
        ))}
        {/* Avaliações do Google */}
        {googleReviews.length > 0 && (
          <>
            <h3 className="text-lg font-semibold text-primary pt-4">Avaliações do Google</h3>
            {googleReviews.map((gr, idx) => (
              <Card key={gr.time + gr.author_name + idx} className="bg-muted/50 border-primary/30 border shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center gap-2">
                  <img src={gr.profile_photo_url} alt={gr.author_name} className="h-8 w-8 rounded-full border" />
                  <div>
                    <CardTitle className="text-md font-semibold text-foreground">{gr.author_name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">{gr.relative_time_description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 ml-auto">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < gr.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground">{gr.text}</p>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
      <p className="text-xs text-muted-foreground pt-4">
          Esta é uma visualização de exemplo. Em uma aplicação real, os feedbacks seriam coletados através de um link de avaliação enviado aos clientes (ex: via WhatsApp, E-mail após pedido) e armazenados em um banco de dados.
      </p>
    </div>
  );
};

export default FeedbacksPage;
