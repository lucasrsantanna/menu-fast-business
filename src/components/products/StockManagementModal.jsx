
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PackagePlus } from 'lucide-react';

const StockManagementModal = ({ isOpen, onClose, product, onStockUpdate }) => {
  const [newStock, setNewStock] = useState(0);

  useEffect(() => {
    if (product) {
      setNewStock(product.stock || 0);
    }
  }, [product]);

  if (!product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onStockUpdate(product.id, newStock);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
            <PackagePlus className="h-6 w-6"/> Repor Estoque
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Atualize a quantidade em estoque para: <span className="font-medium text-foreground">{product.name}</span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          <div>
            <Label htmlFor="currentStock" className="text-foreground">Estoque Atual</Label>
            <Input id="currentStock" type="number" value={product.stock} disabled className="mt-1 bg-muted border-border" />
          </div>
          <div>
            <Label htmlFor="newStock" className="text-foreground">Nova Quantidade em Estoque</Label>
            <Input 
              id="newStock" 
              type="number" 
              value={newStock} 
              onChange={(e) => setNewStock(parseInt(e.target.value, 10) >= 0 ? parseInt(e.target.value, 10) : 0)} 
              min="0"
              className="mt-1 bg-background border-border focus:ring-primary" 
            />
          </div>
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">Salvar Estoque</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StockManagementModal;
