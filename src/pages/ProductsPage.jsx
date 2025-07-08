import React, { useState, useEffect } from 'react';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsList from '@/components/products/ProductsList';
import ProductForm from '@/components/products/ProductForm';
import StockManagementModal from '@/components/products/StockManagementModal';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from "@/components/ui/use-toast";
import { getFirestore, collection, addDoc, doc, setDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const categories = ['Pizzas', 'Hambúrgueres', 'Bebidas', 'Saladas', 'Sobremesas', 'Combos'];

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); 
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [productForStockUpdate, setProductForStockUpdate] = useState(null);
  const { toast } = useToast();
  const [empresaId, setEmpresaId] = useState(null);
  const db = getFirestore();

  // Obter empresaId (UID do usuário autenticado)
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setEmpresaId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Buscar produtos da subcoleção Firestore
  useEffect(() => {
    if (!empresaId) return;
    const produtosRef = collection(db, 'empresas', empresaId, 'produtos');
    const q = query(produtosRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const produtos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(produtos);
    });
    return () => unsubscribe();
  }, [empresaId]);

  // Adicionar produto
  const handleAddProduct = async (newProduct) => {
    if (!empresaId) return;
    try {
      const produtosRef = collection(db, 'empresas', empresaId, 'produtos');
      await addDoc(produtosRef, newProduct);
      setIsFormOpen(false);
      toast({ title: "Sucesso!", description: "Produto adicionado com sucesso.", className: "bg-status-ready border-status-ready text-white" });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao adicionar produto.", variant: "destructive" });
    }
  };

  // Editar produto
  const handleEditProduct = async (updatedProduct) => {
    if (!empresaId || !updatedProduct.id) return;
    try {
      const produtoRef = doc(db, 'empresas', empresaId, 'produtos', updatedProduct.id);
      await setDoc(produtoRef, updatedProduct, { merge: true });
      setIsFormOpen(false);
      setEditingProduct(null);
      toast({ title: "Sucesso!", description: "Produto atualizado com sucesso.", className: "bg-status-ready border-status-ready text-white" });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao atualizar produto.", variant: "destructive" });
    }
  };

  // Deletar produto
  const handleDeleteProduct = async (productId) => {
    if (!empresaId || !productId) return;
    try {
      const produtoRef = doc(db, 'empresas', empresaId, 'produtos', productId);
      await deleteDoc(produtoRef);
      toast({ title: "Sucesso!", description: "Produto removido com sucesso.", variant: "destructive" });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao remover produto.", variant: "destructive" });
    }
  };

  // Alternar status do produto
  const toggleProductStatus = async (productId) => {
    if (!empresaId || !productId) return;
    try {
      const produtoRef = doc(db, 'empresas', empresaId, 'produtos', productId);
      const prod = products.find(p => p.id === productId);
      if (!prod) return;
      await updateDoc(produtoRef, { status: prod.status === 'Ativo' ? 'Pausado' : 'Ativo' });
      toast({ title: "Status Alterado!", description: "O status do produto foi atualizado." });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao alterar status.", variant: "destructive" });
    }
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const openNewForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openStockModal = (product) => {
    if (!product.controlStock) {
        toast({ title: "Aviso", description: "Este produto não tem controle de estoque ativado.", variant: "default"});
        return;
    }
    setProductForStockUpdate(product);
    setIsStockModalOpen(true);
  };

  // Atualizar estoque
  const handleStockUpdate = async (productId, newStockAmount) => {
    if (!empresaId || !productId) return;
    try {
      const produtoRef = doc(db, 'empresas', empresaId, 'produtos', productId);
      await updateDoc(produtoRef, { stock: parseFloat(newStockAmount) });
      setIsStockModalOpen(false);
      toast({ title: "Estoque Atualizado!", description: `O estoque foi atualizado para ${newStockAmount}.`});
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao atualizar estoque.", variant: "destructive" });
    }
  };

  // Debitar estoque após pedido (mantém lógica local, mas pode ser adaptado para Firestore se necessário)
  const debitStockForOrder = async (orderedItems) => {
    if (!empresaId) return;
    try {
      for (const item of orderedItems) {
        const prod = products.find(p => p.name === item.name);
        if (prod && prod.controlStock && prod.stock > 0) {
          const produtoRef = doc(db, 'empresas', empresaId, 'produtos', prod.id);
          const quantityToDebit = item.quantity * prod.avgUsedPerOrder;
          const newStock = Math.max(0, prod.stock - quantityToDebit);
          await updateDoc(produtoRef, { stock: newStock });
        }
      }
      toast({ title: "Estoque Debitado", description: "Estoque atualizado após finalização do pedido." });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao debitar estoque.", variant: "destructive" });
    }
  };

  // Expor função para DashboardPage
  React.useEffect(() => {
    const app = document.getElementById('app-root'); 
    if (app) {
        app.debitStock = debitStockForOrder;
    }
    return () => {
        if(app) delete app.debitStock;
    }
  }, [products, empresaId]);

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(product => {
      if (stockFilter === 'outOfStock') return product.controlStock && product.stock === 0;
      if (stockFilter === 'lowStock') return product.controlStock && product.stock > 0 && product.stock < product.lowStockAlert;
      if (stockFilter === 'notControlled') return !product.controlStock;
      return true;
    })
    .filter(product => {
      if (statusFilter === 'Ativo') return product.status === 'Ativo';
      if (statusFilter === 'Pausado') return product.status === 'Pausado';
      return true;
    });

  return (
    <div className="flex flex-col h-full">
      <ProductsHeader 
        onNewProductClick={openNewForm} 
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        stockFilter={stockFilter}
        onStockFilterChange={setStockFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />
      
      <Dialog open={isFormOpen} onOpenChange={(isOpen) => { setIsFormOpen(isOpen); if(!isOpen) setEditingProduct(null); }}>
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto p-0 bg-background border-border">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-semibold text-primary">
              {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingProduct ? 'Atualize os detalhes do produto.' : 'Preencha as informações do novo produto.'}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <ProductForm 
              product={editingProduct} 
              onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
              onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
              categories={categories}
            />
          </div>
        </DialogContent>
      </Dialog>

      {productForStockUpdate && (
        <StockManagementModal
            isOpen={isStockModalOpen}
            onClose={() => setIsStockModalOpen(false)}
            product={productForStockUpdate}
            onStockUpdate={handleStockUpdate}
        />
      )}
      
      <ProductsList 
        products={filteredProducts}
        onEditProduct={openEditForm}
        onDeleteProduct={handleDeleteProduct}
        onToggleStatus={toggleProductStatus}
      />
    </div>
  );
};

export default ProductsPage;

export const debitStockFromProductsPage = (orderedItems) => {
    const appRoot = document.getElementById('app-root');
    if (appRoot && appRoot.debitStock) {
        appRoot.debitStock(orderedItems);
    }
};
