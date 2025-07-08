
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming this component exists or will be created
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">Detalhes do Pedido #{order.id.slice(-4)}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Cliente: {order.customerName} - {format(new Date(order.time), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] p-1 pr-3">
          <div className="py-2 space-y-3">
            <h4 className="font-medium text-foreground">Itens do Pedido:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-foreground">
              {order.products.map((item, index) => (
                <li key={index}>
                  {item.quantity}x {item.name}
                  {item.observation && <span className="text-xs text-muted-foreground italic"> (Obs: {item.observation})</span>}
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-border">
              <p className="text-md font-bold text-right" style={{color: '#E53935'}}>Total: {order.total}</p>
            </div>
            {order.type === 'Delivery' && order.address && (
                 <div className="pt-2 border-t border-border">
                    <h4 className="font-medium text-foreground">Endereço de Entrega:</h4>
                    <p className="text-sm text-muted-foreground">{order.address}</p>
                </div>
            )}
             {order.tableNumber && (
                 <div className="pt-2 border-t border-border">
                    <h4 className="font-medium text-foreground">Mesa:</h4>
                    <p className="text-sm text-muted-foreground">{order.tableNumber}</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
