
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as ShadCalendar } from '@/components/ui/calendar';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ScheduleCalendar = ({ currentMonth, setCurrentMonth, daysWithPosts }) => {
  return (
    <Card className="shadow-md bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <CalendarDays className="h-6 w-6 text-primary" />
          Calendário - {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ShadCalendar
          mode="single"
          selected={new Date()} 
          onMonthChange={setCurrentMonth}
          month={currentMonth}
          locale={ptBR}
          className="p-0 [&_td]:w-12 [&_td]:h-12 [&_th]:w-12 sm:[&_td]:w-16 sm:[&_td]:h-16 sm:[&_th]:w-16"
          modifiers={{ hasPost: (date) => daysWithPosts.includes(date.getDate()) && date.getMonth() === currentMonth.getMonth() && date.getFullYear() === currentMonth.getFullYear() }}
          modifiersClassNames={{ hasPost: 'bg-primary/20 rounded-md text-primary font-bold' }}
        />
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;
