import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const ProductCard = ({ product, onEdit, onDelete, onToggleStatus }) => {
  const isLowStock = product.controlStock && product.stock > 0 && product.stock < 5;
  const isOutOfStock = product.controlStock && product.stock === 0;
  const cardBorder = isLowStock ? 'border-2 border-red-300 animate-pulse' : 'border-border';

  return (
    <Card className={`overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col bg-card ${cardBorder}`}>
      <div className="relative">
        <img className="w-full h-32 object-cover" alt={product.name} src="https://images.unsplash.com/photo-1694388001616-1176f534d72f" />
        {isLowStock && <Badge variant="destructive" className="absolute top-2 left-2 bg-red-600 text-white">Estoque Baixo</Badge>}
        <div className="absolute top-2 right-2">
          <Switch checked={product.status === 'Ativo'} onCheckedChange={onToggleStatus} />
        </div>
      </div>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-lg font-semibold text-foreground">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="pb-3 px-4 flex-grow">
        <p className="text-xl font-bold text-primary">R$ {product.price}</p>
        <p className="mt-1 text-sm text-muted-foreground">Estoque: {product.controlStock ? `${product.stock} ${product.unit === 'KG' ? 'kg' : (product.stock === 1 ? 'unidade' : 'unidades')}` : 'Não controlado'}</p>
        <p className={`mt-1 text-sm font-medium ${product.status === 'Ativo' ? 'text-status-ready' : 'text-destructive'}`}>{product.status}</p>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-3 pb-4 px-4 border-t border-border mt-auto">
        <div className="flex w-full gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} className="flex-1 border-secondary text-secondary-foreground hover:bg-secondary/20">
            <Edit2 className="mr-2 h-3 w-3" /> Editar
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete} className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90">
            <Trash2 className="mr-2 h-3 w-3" /> Excluir
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
