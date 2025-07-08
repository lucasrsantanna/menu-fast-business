
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BarChart2, DollarSign, ShoppingBag, Percent, CalendarDays, Tag } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MetricDisplay = ({ icon: Icon, label, value, colorClass = "text-primary" }) => (
  <div className="flex items-start space-x-3 p-3 bg-muted/30 rounded-md">
    <Icon className={`h-5 w-5 mt-1 ${colorClass}`} />
    <div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-md font-semibold text-foreground">{value || 'N/A'}</p>
    </div>
  </div>
);

const PromotionResultsModal = ({ isOpen, onClose, promotion }) => {
  if (!promotion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary flex items-center gap-2">
            <BarChart2 className="h-5 w-5" /> Resultados da Promoção
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Detalhes para: <span className="font-medium">{promotion.name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <MetricDisplay icon={Tag} label="Tipo" value={promotion.type} colorClass={promotion.type === 'Cupom' ? 'text-blue-600' : 'text-orange-600'} />
          {promotion.code && <MetricDisplay icon={Percent} label="Código do Cupom" value={promotion.code} colorClass="text-gray-600"/>}
          <MetricDisplay icon={ShoppingBag} label="Usos Totais" value={String(promotion.uses || 0)} colorClass="text-green-600" />
          <MetricDisplay icon={DollarSign} label="Receita Gerada" value={`R$ ${(promotion.revenueGenerated || 0).toFixed(2).replace('.', ',')}`} colorClass="text-teal-600" />
          <MetricDisplay 
            icon={CalendarDays} 
            label="Vigência" 
            value={`${format(parseISO(promotion.validityStart), 'dd/MM/yy', {locale: ptBR})} - ${format(parseISO(promotion.validityEnd), 'dd/MM/yy', {locale: ptBR})}`}
            colorClass="text-purple-600"
          />
          {promotion.startTime && <MetricDisplay icon={CalendarDays} label="Horário (Promo Dia)" value={`${promotion.startTime} - ${promotion.endTime || 'Fim do Dia'}`} colorClass="text-indigo-600"/>}
           <p className="text-xs text-muted-foreground pt-2">Estes são dados de exemplo. Em um sistema real, seriam rastreados com precisão.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromotionResultsModal;
