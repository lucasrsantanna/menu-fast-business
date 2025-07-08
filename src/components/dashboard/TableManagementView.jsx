
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TableCardDisplay = ({ table, onClick }) => {
    let statusColor = 'bg-green-100 border-green-500 text-green-700';
    let textColor = 'text-green-800';
    if (table.status === 'Ocupada') {
      statusColor = 'bg-red-100 border-red-500 text-red-700';
      textColor = 'text-red-800';
    }
    if (table.status === 'Sujo') {
      statusColor = 'bg-yellow-100 border-yellow-500 text-yellow-700';
      textColor = 'text-yellow-800';
    }

    return (
        <Card 
            className={`cursor-pointer hover:shadow-xl transition-all duration-200 ${statusColor} min-h-[100px] flex flex-col justify-center items-center transform hover:scale-105`}
            onClick={() => onClick(table)}
        >
            <CardHeader className="p-2 pt-3 text-center">
                <CardTitle className={`text-xl font-semibold ${textColor}`}>Mesa {table.number}</CardTitle>
            </CardHeader>
            <CardContent className="p-2 pb-3 text-center">
                <p className={`text-sm font-medium ${textColor}`}>{table.status}</p>
                {table.status === 'Ocupada' && table.customerName && <p className={`text-xs truncate ${textColor}`}>{table.customerName}</p>}
            </CardContent>
        </Card>
    );
};

const TableManagementView = ({ tables, onTableClick }) => {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Clique em uma mesa para ver opções ou alterar status.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {tables.map(table => (
          <TableCardDisplay key={table.id} table={table} onClick={onTableClick} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground pt-4">
        Esta é uma visualização simplificada. Um sistema completo de mesas poderia incluir um layout gráfico do restaurante,
        gerenciamento de filas de espera, e integração mais profunda com os pedidos.
      </p>
    </div>
  );
};

export default TableManagementView;
