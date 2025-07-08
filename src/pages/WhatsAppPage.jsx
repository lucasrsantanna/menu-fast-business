
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialWhatsAppOrders = [
  { id: 'wa1', customerName: 'Fernanda Alves', number: '5511987654321', summary: '2x X-Burger, 1x Coca Zero', timestamp: '14:30' },
  { id: 'wa2', customerName: 'Ricardo Mendes', number: '5521912345678', summary: '1x Pizza Pepperoni G', timestamp: '14:35' },
  { id: 'wa3', customerName: 'Laura Beatriz', number: '5531955550000', summary: 'Combo Família (Frango Assado + Acompanhamentos)', timestamp: '14:42' },
];

const WhatsAppOrderCard = ({ order }) => {
  const openWhatsAppChat = () => {
    window.open(`https://web.whatsapp.com/send?phone=${order.number}&text=Ol%C3%A1%20${order.customerName}%2C%20sobre%20o%20seu%20pedido...`, '_blank');
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="mb-3"
    >
      <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card border-border">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-md font-semibold text-foreground">{order.customerName}</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Pedido às {order.timestamp}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={openWhatsAppChat} className="text-green-600 hover:text-green-700 hover:bg-green-500/10">
              <ExternalLink className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-3 px-4">
          <p className="text-sm text-foreground mb-1 line-clamp-2">{order.summary}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const WhatsAppPage = () => {
  const [orders, setOrders] = useState(initialWhatsAppOrders);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order =>
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.number.includes(searchTerm)
  );

  // Simulate Kanban columns for WhatsApp (e.g., New, In Progress, Resolved)
  // For this example, we'll just use one column "Novos Pedidos"
  const kanbanColumns = {
    new: {
      id: 'new',
      title: 'Novos Pedidos WhatsApp',
      items: filteredOrders,
      colorClass: 'bg-green-500', // Example color
      textColorClass: 'text-white'
    }
  };

  return (
    <div className="p-4 md:p-6 flex flex-col h-full">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Pedidos via WhatsApp</h1>
        <p className="text-muted-foreground">Visualize e gerencie os pedidos recebidos pelo WhatsApp.</p>
      </header>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nome ou número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-card border-border focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto pb-4">
        {Object.values(kanbanColumns).map((column) => (
          <div key={column.id} className="flex flex-col bg-muted/50 p-3 rounded-lg shadow-inner min-h-[200px]">
            <div className={`flex items-center justify-between p-2 mb-3 rounded-md sticky top-0 z-10 ${column.colorClass} bg-opacity-90 backdrop-blur-sm`}>
              <h2 className={`font-semibold text-sm ${column.textColorClass}`}>{column.title}</h2>
              <span className={`text-xs ${column.textColorClass} bg-black/10 px-1.5 py-0.5 rounded-full`}>
                {column.items.length}
              </span>
            </div>
            <div className="overflow-y-auto flex-1 pr-1">
              <AnimatePresence>
                {column.items.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum pedido encontrado.</p>
                )}
                {column.items.map(order => (
                  <WhatsAppOrderCard key={order.id} order={order} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatsAppPage;
