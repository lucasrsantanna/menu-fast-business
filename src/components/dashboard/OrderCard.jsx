import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Draggable } from 'react-beautiful-dnd';
import { Globe, MessageCircle, Store, Utensils, Bike } from 'lucide-react';
import { format, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const LeadSourceIcon = ({ source, phone }) => {
  const openWhatsAppChat = () => {
    if (phone) window.open(`https://web.whatsapp.com/send?phone=${phone}&text=Ol%C3%A1%2C%20sobre%20o%20seu%20pedido...`, '_blank');
  };

  if (source === 'site') return <Globe className="h-4 w-4 text-blue-500" title="Site" />;
  if (source === 'whatsapp') return <MessageCircle className="h-4 w-4 text-green-500 cursor-pointer" title="WhatsApp - Abrir chat" onClick={openWhatsAppChat} />;
  if (source === 'restaurante') return <Store className="h-4 w-4 text-purple-500" title="Restaurante" />;
  return null;
};

const OrderTypeBadge = ({ type }) => {
  const isDelivery = type === 'Delivery';
  const Icon = isDelivery ? Bike : Utensils;
  const text = isDelivery ? 'Delivery' : 'No Restaurante';

  return (
    <div className="absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1 bg-background text-foreground border border-border shadow-sm">
      <Icon className={`h-3 w-3 ${isDelivery ? 'text-blue-600' : 'text-green-600'}`} />
      <span>{text}</span>
    </div>
  );
};

const OrderTimeDisplay = ({ time }) => {
  const orderTime = new Date(time);
  const now = new Date();
  const minutesDiff = differenceInMinutes(now, orderTime);

  let timeColorClass = 'text-green-600'; // < 20 min
  if (minutesDiff >= 20 && minutesDiff <= 40) {
    timeColorClass = 'text-yellow-600'; // 20-40 min
  } else if (minutesDiff > 40) {
    timeColorClass = 'text-red-600'; // > 40 min
  }

  return (
    <CardDescription className={`text-xs ${timeColorClass}`}>
      {format(orderTime, "HH:mm", { locale: ptBR })} ({minutesDiff} min atrás)
    </CardDescription>
  );
};

const OrderCard = ({ order, onAdvanceStatus, onFinalizeOrder, index, onRequestFeedback, onOpenOrderDetails }) => {
  const borderColorClass = order.type === 'Delivery' ? 'border-l-4 border-blue-600' : 'border-l-4 border-green-600';
  const productsSummary = order.products.map(p => `${p.quantity}x ${p.name}`).join(', ');

  return (
    <Draggable draggableId={order.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 ${snapshot.isDragging ? 'shadow-2xl scale-105' : 'shadow-md'}`}
        >
          <Card className={`hover:shadow-lg transition-shadow duration-300 bg-card border-border relative ${borderColorClass}`}>
            <OrderTypeBadge type={order.type} />
            <CardHeader className="pb-2 pt-4 px-4 flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-md font-bold text-foreground">{order.customerName} {order.tableNumber ? `(Mesa ${order.tableNumber})` : ''}</CardTitle>
                <OrderTimeDisplay time={order.time} />
              </div>
            </CardHeader>
            <CardContent className="pb-3 px-4">
              <p 
                className="text-sm text-foreground mb-1 line-clamp-2 cursor-pointer hover:text-primary"
                onClick={() => onOpenOrderDetails(order)}
                title="Clique para ver detalhes"
              >
                {productsSummary}
              </p>
              <p className="text-md font-bold" style={{ color: '#E53935' }}>{order.total}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center gap-2 pt-0 pb-3 px-4">
              {order.status !== 'Entregue' && (
                <Button variant="outline" size="sm" onClick={() => onAdvanceStatus(order.id)} className="text-xs border-primary/50 text-primary hover:bg-primary/10">
                  Avançar Status
                </Button>
              )}
              {order.status === 'Pronto' && (
                <Button variant="default" size="sm" onClick={() => onFinalizeOrder(order.id)} className="text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                  Finalizar Pedido
                </Button>
              )}
              {order.status === 'Entregue' && (
                <Button variant="outline" size="sm" onClick={() => onRequestFeedback(order)} className="text-xs border-accent text-accent hover:bg-accent/10">
                  Solicitar Feedback
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default OrderCard;
