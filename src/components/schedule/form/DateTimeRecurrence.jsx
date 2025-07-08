
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as ShadCalendar } from '@/components/ui/calendar';
import { CalendarDays as CalendarIconLucide } from 'lucide-react';
import { format, isSameDay, addDays, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DateTimeRecurrence = ({
  selectedDateTime,
  setSelectedDateTime,
  recurrence,
  setRecurrence,
  customRecurrenceDates,
  setCustomRecurrenceDates,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-foreground">Data de Publicação Inicial</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full mt-1 flex justify-start text-left font-normal border-border bg-background hover:bg-muted/50 text-foreground focus:ring-primary">
                <CalendarIconLucide className="mr-2 h-4 w-4" />
                {selectedDateTime ? format(selectedDateTime, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
              <ShadCalendar mode="single" selected={selectedDateTime} onSelect={setSelectedDateTime} initialFocus locale={ptBR} />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="post-time" className="text-sm font-medium text-foreground">Hora de Publicação</Label>
          <Input 
            id="post-time" 
            type="time" 
            value={format(selectedDateTime, 'HH:mm')} 
            onChange={(e) => {
              const [hours, minutes] = e.target.value.split(':').map(Number);
              const newDate = new Date(selectedDateTime);
              newDate.setHours(hours, minutes);
              setSelectedDateTime(newDate);
            }} 
            className="mt-1 bg-background border-border focus:ring-primary" 
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-foreground">Recorrência</Label>
        <Select value={recurrence} onValueChange={setRecurrence}>
          <SelectTrigger className="w-full mt-1 bg-background border-border focus:ring-primary">
            <SelectValue placeholder="Selecionar recorrência" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="once">Uma Vez</SelectItem>
            <SelectItem value="daily">Diariamente</SelectItem>
            <SelectItem value="weekly">Semanalmente</SelectItem>
            <SelectItem value="monthly">Mensalmente</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {recurrence === 'custom' && (
        <div>
          <Label className="text-sm font-medium text-foreground">Datas Personalizadas</Label>
          <ShadCalendar
            mode="multiple"
            selected={customRecurrenceDates}
            onSelect={setCustomRecurrenceDates}
            locale={ptBR}
            className="mt-1 rounded-md border border-border bg-card p-2"
            disabled={(date) => isBefore(date, addDays(new Date(), -1)) && !isSameDay(date, new Date())}
          />
          <p className="text-xs text-muted-foreground mt-1">Selecione as datas adicionais para este post.</p>
        </div>
      )}
    </>
  );
};

export default DateTimeRecurrence;
