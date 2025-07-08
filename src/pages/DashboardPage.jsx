import React, { useState, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import KanbanColumn from '@/components/dashboard/KanbanColumn';
import TableManagementView from '@/components/dashboard/TableManagementView';
import OrderDetailsModal from '@/components/dashboard/OrderDetailsModal';
import ReservationModal from '@/components/dashboard/ReservationModal';
import { useToast } from "@/components/ui/use-toast";
import { differenceInMinutes } from 'date-fns';
import { getFirestore, collection, addDoc, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";

const columnsConfig = [
  { id: 'col-1', title: 'Recebido', status: 'Recebido', colorClass: 'bg-status-received', textColorClass: 'text-yellow-900' },
  { id: 'col-2', title: 'Em Preparo', status: 'Em Preparo', colorClass: 'bg-status-inPreparation', textColorClass: 'text-orange-900' },
  { id: 'col-3', title: 'Pronto', status: 'Pronto', colorClass: 'bg-status-ready', textColorClass: 'text-green-900' },
  { id: 'col-4', title: 'Entregue', status: 'Entregue', colorClass: 'bg-status-delivered', textColorClass: 'text-blue-900' },
];

const DashboardPage = ({ onFinalizeOrderForStockUpdate }) => {
  const [ordersData, setOrdersData] = useState([]); // Começa vazio
  const [filterDate, setFilterDate] = useState('today'); 
  const [customDate, setCustomDate] = useState(new Date());
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [columns, setColumns] = useState({});
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState('kanban'); 
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [newReservation, setNewReservation] = useState({ date: '', time: '', customerName: '', numPeople: '', tableNumber: '' });
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState(null);
  const [tables, setTables] = useState([
    { id: 't1', number: 1, status: 'Livre' }, { id: 't2', number: 2, status: 'Ocupada', customerName: 'João Silva', orderId: 'order-2' },
    { id: 't3', number: 3, status: 'Sujo' }, { id: 't4', number: 4, status: 'Livre' },
    { id: 't5', number: 5, status: 'Ocupada', customerName: 'Mesa 5', orderId: 'order-7'}, { id: 't6', number: 6, status: 'Livre' },
  ]);
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

  // Buscar pedidos da subcoleção Firestore
  useEffect(() => {
    if (!empresaId) return;
    const pedidosRef = collection(db, 'empresas', empresaId, 'pedidos');
    const q = query(pedidosRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pedidosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrdersData(pedidosData);
    });
    return () => unsubscribe();
  }, [empresaId]);

  // Filtrar e organizar pedidos em colunas
  useEffect(() => {
    let filtered = [...ordersData]; 

    if (filterDate === 'today') {
      const today = new Date();
      filtered = filtered.filter(order => new Date(order.time).toDateString() === today.toDateString());
    } else if (filterDate === 'week') {
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6));
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.time);
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
      });
    } else if (filterDate === 'custom' && customDate) {
      filtered = filtered.filter(order => new Date(order.time).toDateString() === customDate.toDateString());
    }
    
    if (orderTypeFilter !== 'all') {
      filtered = filtered.filter(order => order.type === orderTypeFilter);
    }
    
    const newColumns = {};
    columnsConfig.forEach(colConfig => {
      newColumns[colConfig.id] = {
        ...colConfig,
        items: filtered.filter(order => order.status === colConfig.status).sort((a,b) => new Date(a.time) - new Date(b.time))
      };
    });
    setColumns(newColumns);
  }, [ordersData, filterDate, customDate, orderTypeFilter]);

  // Alterar status do pedido no Firestore
  const handleAdvanceStatus = async (orderId) => {
    if (!empresaId || !orderId) return;
    try {
      const pedido = ordersData.find(o => o.id === orderId);
      if (!pedido) return;
      const currentColumnConfigIndex = columnsConfig.findIndex(col => col.status === pedido.status);
      if (currentColumnConfigIndex < columnsConfig.length - 1) {
        const novoStatus = columnsConfig[currentColumnConfigIndex + 1].status;
        const pedidoRef = doc(db, 'empresas', empresaId, 'pedidos', orderId);
        await updateDoc(pedidoRef, { status: novoStatus });
        toast({ title: "Status Avançado", description: "O pedido foi movido para a próxima etapa." });
      }
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao avançar status.", variant: "destructive" });
    }
  };

  // Finalizar pedido no Firestore
  const handleFinalizeOrder = async (orderId) => {
    if (!empresaId || !orderId) return;
    try {
      const pedidoRef = doc(db, 'empresas', empresaId, 'pedidos', orderId);
      await updateDoc(pedidoRef, { status: 'Entregue' });
      const orderToFinalize = ordersData.find(order => order.id === orderId);
      if (orderToFinalize && typeof onFinalizeOrderForStockUpdate === 'function') {
        onFinalizeOrderForStockUpdate(orderToFinalize.products);
      }
      toast({ title: "Pedido Finalizado", description: "O pedido foi marcado como entregue.", className: "bg-status-delivered border-status-delivered text-white" });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao finalizar pedido.", variant: "destructive" });
    }
  };

  // Drag and drop status update
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const destColumn = columns[destination.droppableId];
    const newStatus = destColumn.status;
    if (!empresaId || !draggableId) return;
    try {
      const pedidoRef = doc(db, 'empresas', empresaId, 'pedidos', draggableId);
      await updateDoc(pedidoRef, { status: newStatus });
      toast({ title: "Status Atualizado", description: `Pedido movido para ${newStatus}.` });
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao atualizar status.", variant: "destructive" });
    }
  };

  // Adicionar pedido (exemplo: reserva)
  const handleSaveReservation = async (reservationData) => {
    setTables(prevTables => prevTables.map(t => 
      t.number === parseInt(reservationData.tableNumber) ? {...t, status: 'Ocupada', customerName: reservationData.customerName, reservationTime: `${reservationData.date} ${reservationData.time}`} : t
    ));
    if (!empresaId) return;
    try {
      const pedidosRef = collection(db, 'empresas', empresaId, 'pedidos');
      const reservationOrder = {
        customerName: `${reservationData.customerName} (Reserva Mesa ${reservationData.tableNumber})`,
        time: new Date().toISOString(),
        products: [{name: `${reservationData.numPeople} pessoa(s)`, quantity: 1}],
        total: 'Aguardando Pedido',
        status: 'Recebido',
        leadSource: 'restaurante',
        type: 'No Restaurante',
        tableNumber: reservationData.tableNumber
      };
      await addDoc(pedidosRef, reservationOrder);
      toast({ title: "Reserva Confirmada!", description: `Mesa ${reservationData.tableNumber} reservada para ${reservationData.customerName}.` });
      setIsReservationModalOpen(false);
    } catch (e) {
      toast({ title: "Erro", description: "Erro ao salvar reserva.", variant: "destructive" });
    }
  };

  const handleRequestFeedback = (order) => {
    const message = `Olá ${order.customerName}, gostaríamos de saber sua opinião sobre seu pedido! Clique no link para avaliar: [Link_Avaliacao]`;
    if (order.leadSource === 'whatsapp' && order.phone) {
        window.open(`https://web.whatsapp.com/send?phone=${order.phone}&text=${encodeURIComponent(message)}`, '_blank');
        toast({ title: "Feedback Solicitado", description: `Link de feedback enviado para ${order.customerName} via WhatsApp.` });
    } else {
        toast({ title: "Feedback Solicitado", description: `Link de feedback (simulado) enviado para ${order.customerName}.` });
    }
  };

  const handleTableClick = (table) => {
    if (table.status === 'Livre') {
        setNewReservation(prev => ({...prev, tableNumber: table.number}));
        setIsReservationModalOpen(true);
    } else if (table.status === 'Ocupada' && table.orderId) {
        const orderDetails = ordersData.find(o => o.id === table.orderId);
        if(orderDetails) setSelectedOrderForDetails(orderDetails);
        else toast({title: `Mesa ${table.number}`, description: `Cliente: ${table.customerName}. Pedido não encontrado no Kanban.`});
    } else if (table.status === 'Sujo') {
        setTables(prevTables => prevTables.map(t => t.id === table.id ? {...t, status: 'Livre'} : t));
        toast({title: `Mesa ${table.number}`, description: `Status alterado para Livre.`});
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrderForDetails(order);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-full">
        <DashboardHeader
          viewMode={viewMode}
          setViewMode={setViewMode}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          customDate={customDate}
          setCustomDate={setCustomDate}
          orderTypeFilter={orderTypeFilter}
          setOrderTypeFilter={setOrderTypeFilter}
          onNewReservationClick={() => {
            setNewReservation({ date: '', time: '', customerName: '', numPeople: '', tableNumber: '' }); // Reset form
            setIsReservationModalOpen(true);
          }}
        />
        
        {viewMode === 'kanban' && (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
            {Object.values(columns).map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onAdvanceStatus={handleAdvanceStatus}
                onFinalizeOrder={handleFinalizeOrder}
                onRequestFeedback={handleRequestFeedback}
                onOpenOrderDetails={openOrderDetails}
              />
            ))}
          </div>
        )}

        {viewMode === 'tables' && (
          <TableManagementView
            tables={tables}
            onTableClick={handleTableClick}
          />
        )}

        {selectedOrderForDetails && (
          <OrderDetailsModal
            order={selectedOrderForDetails}
            isOpen={!!selectedOrderForDetails}
            onClose={() => setSelectedOrderForDetails(null)}
          />
        )}
        
        <ReservationModal
          isOpen={isReservationModalOpen}
          onClose={() => setIsReservationModalOpen(false)}
          onSave={handleSaveReservation}
          initialData={newReservation}
        />
      </div>
    </DragDropContext>
  );
};

export default DashboardPage;
