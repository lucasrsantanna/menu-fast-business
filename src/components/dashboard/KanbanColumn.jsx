
import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import OrderCard from './OrderCard';

const KanbanColumn = ({ column, onAdvanceStatus, onFinalizeOrder, onRequestFeedback, onOpenOrderDetails }) => {
  return (
    <Droppable droppableId={column.id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col bg-muted/50 p-3 rounded-lg shadow-inner min-h-[300px] transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-primary/10' : ''}`}
        >
          <div className={`flex items-center justify-between p-2 mb-3 rounded-md sticky top-0 z-10 ${column.colorClass} bg-opacity-90 backdrop-blur-sm`}>
            <h2 className={`font-semibold text-sm ${column.textColorClass}`}>{column.title}</h2>
            <span className={`text-xs ${column.textColorClass} bg-black/10 px-1.5 py-0.5 rounded-full`}>
              {column.items.length}
            </span>
          </div>
          <div className="overflow-y-auto flex-1 pr-1">
            <AnimatePresence>
              {column.items.map((order, index) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAdvanceStatus={onAdvanceStatus}
                  onFinalizeOrder={onFinalizeOrder}
                  onRequestFeedback={onRequestFeedback}
                  onOpenOrderDetails={onOpenOrderDetails}
                  index={index}
                />
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default KanbanColumn;
