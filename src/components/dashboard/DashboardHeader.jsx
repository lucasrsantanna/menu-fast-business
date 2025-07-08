
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarLucideIcon, Filter, Table as TableIcon, LayoutGrid } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as ShadCalendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


const DashboardHeader = ({
  viewMode, setViewMode,
  filterDate, setFilterDate,
  customDate, setCustomDate,
  orderTypeFilter, setOrderTypeFilter,
  onNewReservationClick
}) => {
  return (
    <header className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {viewMode === 'kanban' ? 'Painel de Pedidos' : 'Gerenciamento de Mesas'}
          </h1>
          <p className="text-muted-foreground">
            {viewMode === 'kanban' ? 'Gerencie os pedidos em tempo real.' : 'Visualize e gerencie as mesas do restaurante.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={viewMode === 'kanban' ? "default" : "outline"} onClick={() => setViewMode('kanban')} size="sm" className="shadow-sm">
            <LayoutGrid className="h-4 w-4 mr-2"/> Kanban
          </Button>
          <Button variant={viewMode === 'tables' ? "default" : "outline"} onClick={() => setViewMode('tables')} size="sm" className="shadow-sm">
            <TableIcon className="h-4 w-4 mr-2"/> Mesas
          </Button>
        </div>
      </div>

      {viewMode === 'kanban' && (
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full sm:w-auto">
             <Select value={filterDate} onValueChange={(value) => {
                setFilterDate(value);
                if (value !== 'custom') setCustomDate(null);
              }}>
              <SelectTrigger className="w-full sm:w-[180px] bg-card border-border focus:ring-primary">
                <CalendarLucideIcon className="h-4 w-4 text-muted-foreground mr-2" />
                <SelectValue placeholder="Filtrar por data" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            {filterDate === 'custom' && (
               <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-[180px] mt-2 flex justify-start text-left font-normal border-border bg-card hover:bg-muted/50 text-foreground focus:ring-primary">
                    <CalendarLucideIcon className="mr-2 h-4 w-4" />
                    {customDate ? format(customDate, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                  <ShadCalendar mode="single" selected={customDate} onSelect={setCustomDate} initialFocus locale={ptBR} />
                </PopoverContent>
              </Popover>
            )}
          </div>
          <div className="flex-1 w-full sm:w-auto">
            <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
              <SelectTrigger className="w-full sm:w-[220px] bg-card border-border focus:ring-primary">
                <Filter className="h-4 w-4 text-muted-foreground mr-2" />
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos os Pedidos</SelectItem>
                <SelectItem value="Delivery">Só Delivery</SelectItem>
                <SelectItem value="No Restaurante">Só no Restaurante</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      {viewMode === 'tables' && (
        <div className="mt-4 flex justify-end">
            <Button onClick={onNewReservationClick} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                <CalendarLucideIcon className="mr-2 h-4 w-4" /> Nova Reserva
            </Button>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
