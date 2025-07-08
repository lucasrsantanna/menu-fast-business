import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tag, Percent, CalendarDays, BarChart2, DollarSign, ShoppingBag, PlusCircle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import PromotionForm from '@/components/promotions/PromotionForm';
import PromotionCard from '@/components/promotions/PromotionCard';
import PromotionResultsModal from '@/components/promotions/PromotionResultsModal'; 
import { getFirestore, collection, addDoc, doc, setDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formType, setFormType] = useState("Cupom"); 
  const [activeTab, setActiveTab] = useState("all");
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [selectedPromotionForResults, setSelectedPromotionForResults] = useState(null);
  const [empresaId, setEmpresaId] = useState(null);
  const db = getFirestore();
  const { toast } = useToast();

  // Obter empresaId (UID do usuário autenticado)
  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setEmpresaId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Buscar promoções da subcoleção Firestore
  React.useEffect(() => {
    if (!empresaId) return;
    const promocoesRef = collection(db, 'empresas', empresaId, 'promocoes');
    const q = query(promocoesRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const promocoes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPromotions(promocoes);
    });
    return () => unsubscribe();
  }, [empresaId]);

  // Adicionar promoção
  const handleAddPromotion = async (newPromo) => {
    if (!empresaId) return;
    try {
      const promocoesRef = collection(db, 'empresas', empresaId, 'promocoes');
      await addDoc(promocoesRef, newPromo);
      setIsFormOpen(false);
      toast({ title: "Sucesso!", description: "Promoção adicionada com sucesso.", className: "bg-status-ready border-status-ready text-white" });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao adicionar promoção.", variant: "destructive" });
    }
  };

  // Editar promoção
  const handleEditPromotion = async (updatedPromo) => {
    if (!empresaId || !updatedPromo.id) return;
    try {
      const promoRef = doc(db, 'empresas', empresaId, 'promocoes', updatedPromo.id);
      await setDoc(promoRef, updatedPromo, { merge: true });
      setIsFormOpen(false);
      setEditingPromotion(null);
      toast({ title: "Sucesso!", description: "Promoção atualizada com sucesso.", className: "bg-status-ready border-status-ready text-white" });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao atualizar promoção.", variant: "destructive" });
    }
  };

  // Deletar promoção
  const handleDelete = async (id) => {
    if (!empresaId || !id) return;
    try {
      const promoRef = doc(db, 'empresas', empresaId, 'promocoes', id);
      await deleteDoc(promoRef);
      toast({ title: "Removido!", description: "Promoção removida com sucesso.", variant: "destructive" });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao remover promoção.", variant: "destructive" });
    }
  };

  // Alternar status da promoção
  const toggleStatus = async (id) => {
    if (!empresaId || !id) return;
    try {
      const promo = promotions.find(p => p.id === id);
      if (!promo) return;
      const promoRef = doc(db, 'empresas', empresaId, 'promocoes', id);
      await updateDoc(promoRef, { status: promo.status === 'Ativa' ? 'Expirada' : 'Ativa' });
      toast({ title: "Status Alterado!" });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao alterar status.", variant: "destructive" });
    }
  };

  // Substituir handleFormSubmit para usar Firestore
  const handleFormSubmit = (promoData) => {
    if (editingPromotion) {
      handleEditPromotion(promoData);
    } else {
      handleAddPromotion({ ...promoData, uses: 0, revenueGenerated: 0 });
    }
  };

  const openForm = (type, promo = null) => {
    setFormType(type);
    setEditingPromotion(promo);
    setIsFormOpen(true);
  };

  const openResultsModal = (promo) => {
    setSelectedPromotionForResults(promo);
    setIsResultsModalOpen(true);
  };

  const filteredPromotions = promotions.filter(promo => {
    if (activeTab === 'all') return true;
    if (activeTab === 'Cupom') return promo.type === 'Cupom';
    if (activeTab === 'Promoção do Dia') return promo.type === 'Promoção do Dia';
    return true; // Should not happen for 'results' tab
  });

  const totalUses = promotions.reduce((sum, p) => sum + (p.uses || 0), 0);
  const totalRevenue = promotions.reduce((sum, p) => sum + (p.revenueGenerated || 0), 0);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2"><Tag className="h-8 w-8 text-primary"/>Promoções & Cupons</h1>
          <p className="text-muted-foreground">Gerencie seus cupons de desconto e promoções diárias.</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={() => openForm("Cupom")} className="bg-blue-600 text-white hover:bg-blue-700 shadow-md">
              <Percent className="mr-2 h-4 w-4"/>Novo Cupom
            </Button>
            <Button onClick={() => openForm("Promoção do Dia")} className="bg-orange-500 text-white hover:bg-orange-600 shadow-md">
              <CalendarDays className="mr-2 h-4 w-4"/>Nova Promoção do Dia
            </Button>
        </div>
      </header>

      <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if(!isOpen) setEditingPromotion(null);}}>
          <DialogContent className="sm:max-w-lg bg-background border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-primary">
                {editingPromotion ? `Editar ${formType}` : `Nova ${formType}`}
              </DialogTitle>
              <DialogDescription>Preencha os detalhes abaixo.</DialogDescription>
            </DialogHeader>
            <PromotionForm
                promotion={editingPromotion}
                products={[]}
                onSubmit={handleFormSubmit}
                onCancel={() => {setIsFormOpen(false); setEditingPromotion(null);}}
                type={formType}
            />
          </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="Cupom">Cupons</TabsTrigger>
          <TabsTrigger value="Promoção do Dia">Promoções do Dia</TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-1"><BarChart2 className="h-4 w-4"/>Resultados Gerais</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPromotions.map(promo => <PromotionCard key={promo.id} promo={promo} onEdit={p => openForm(p.type,p)} onDelete={handleDelete} onToggleStatus={toggleStatus} onViewResults={openResultsModal} />)}
            </div>
        </TabsContent>
        <TabsContent value="Cupom" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPromotions.map(promo => <PromotionCard key={promo.id} promo={promo} onEdit={p => openForm(p.type,p)} onDelete={handleDelete} onToggleStatus={toggleStatus} onViewResults={openResultsModal} />)}
            </div>
        </TabsContent>
        <TabsContent value="Promoção do Dia" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPromotions.map(promo => <PromotionCard key={promo.id} promo={promo} onEdit={p => openForm(p.type,p)} onDelete={handleDelete} onToggleStatus={toggleStatus} onViewResults={openResultsModal} />)}
            </div>
        </TabsContent>
        <TabsContent value="results" className="mt-4">
            <Card className="shadow-md bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-foreground">Resultados Gerais das Promoções</CardTitle>
                    <CardDescription className="text-muted-foreground">Acompanhe o desempenho consolidado de suas promoções e cupons.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-muted/50 p-4">
                            <CardTitle className="text-base flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-blue-500"/>Total de Usos (Cupons/Promoções)</CardTitle>
                            <p className="text-2xl font-bold text-foreground">{totalUses}</p>
                            <p className="text-xs text-muted-foreground">Soma de todos os usos</p>
                        </Card>
                        <Card className="bg-muted/50 p-4">
                            <CardTitle className="text-base flex items-center gap-2"><DollarSign className="h-5 w-5 text-green-500"/>Receita Total Gerada por Promoções</CardTitle>
                            <p className="text-2xl font-bold text-foreground">R$ {totalRevenue.toFixed(2).replace('.', ',')}</p>
                            <p className="text-xs text-muted-foreground">Soma de toda receita gerada</p>
                        </Card>
                    </div>
                    <p className="text-sm text-muted-foreground pt-2">Para ver detalhes de uma promoção específica, clique sobre ela na aba "Todas", "Cupons" ou "Promoções do Dia".</p>
                     <p className="text-xs text-muted-foreground pt-4">Integração futura: Tabelas `daily_promotions_usage` e `coupons_usage` para popular estes dados de forma precisa.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
      {filteredPromotions.length === 0 && activeTab !== 'results' && <p className="text-center text-muted-foreground py-8">Nenhuma promoção encontrada para esta categoria.</p>}

      {selectedPromotionForResults && (
        <PromotionResultsModal
          isOpen={isResultsModalOpen}
          onClose={() => setIsResultsModalOpen(false)}
          promotion={selectedPromotionForResults}
        />
      )}
    </div>
  );
};

export default PromotionsPage;
