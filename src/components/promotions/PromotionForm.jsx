
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DialogFooter } from '@/components/ui/dialog';
import { CalendarDays, Tag } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PromotionForm = ({ promotion, products, onSubmit, onCancel, type = "Cupom" }) => {
  const [name, setName] = useState('');
  const [productsAffected, setProductsAffected] = useState([]);
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [validityStartDate, setValidityStartDate] = useState(new Date());
  const [validityEndDate, setValidityEndDate] = useState(new Date());
  const [code, setCode] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    if (promotion) {
      setName(promotion.name || '');
      setProductsAffected(promotion.productsAffected || []);
      setDiscount(promotion.discount ? promotion.discount.replace(/[R$%,\s]/g, '') : '');
      setDiscountType(promotion.discountType || 'percentage');
      setValidityStartDate(promotion.validityStart ? parseISO(promotion.validityStart) : new Date());
      setValidityEndDate(promotion.validityEnd ? parseISO(promotion.validityEnd) : new Date());
      setCode(promotion.code || '');
      setStartTime(promotion.startTime || '');
      setEndTime(promotion.endTime || '');
    } else {
      setName('');
      setProductsAffected([]);
      setDiscount('');
      setDiscountType('percentage');
      setValidityStartDate(new Date());
      setValidityEndDate(new Date());
      setCode('');
      setStartTime('');
      setEndTime('');
    }
  }, [promotion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || productsAffected.length === 0 || !discount) {
      toast({ title: "Erro", description: "Nome, produto(s) e desconto são obrigatórios.", variant: "destructive" });
      return;
    }
    if (type === "Promoção do Dia" && !validityStartDate) {
      toast({ title: "Erro", description: "Data única é obrigatória para Promoção do Dia.", variant: "destructive" });
      return;
    }
     if (type === "Cupom" && (!validityStartDate || !validityEndDate)) {
      toast({ title: "Erro", description: "Data de início e fim são obrigatórias para Cupons.", variant: "destructive" });
      return;
    }


    const newPromo = {
      id: promotion ? promotion.id : `promo${Date.now()}`,
      name, type, productsAffected,
      discount: `${discountType === 'percentage' ? discount + '%' : 'R$ ' + parseFloat(discount).toFixed(2)}`,
      discountType,
      validityStart: format(validityStartDate, 'yyyy-MM-dd'),
      validityEnd: type === "Promoção do Dia" ? format(validityStartDate, 'yyyy-MM-dd') : format(validityEndDate, 'yyyy-MM-dd'),
      status: 'Ativa',
      ...(type === "Cupom" && { code: code || name.substring(0,5).toUpperCase() + Date.now().toString().slice(-3) }),
      ...(type === "Promoção do Dia" && { startTime, endTime }),
    };
    onSubmit(newPromo);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <Input type="hidden" value={type} />
      <div>
        <Label htmlFor="promo-name" className="text-sm">Nome da {type}</Label>
        <Input id="promo-name" value={name} onChange={(e) => setName(e.target.value)} placeholder={type === "Cupom" ? "Ex: 15% OFF Bebidas" : "Ex: Happy Hour Cervejas"} className="mt-1"/>
      </div>
      <div>
        <Label className="text-sm">Produto(s) / Combo(s) Afetado(s)</Label>
        <Select onValueChange={(value) => setProductsAffected(value ? [value] : [])} value={productsAffected[0] || ''}>
          <SelectTrigger className="mt-1 w-full text-sm"><SelectValue placeholder="Selecione um produto/combo" /></SelectTrigger>
          <SelectContent>
            {products.map(p => <SelectItem key={p.id} value={p.name} className="text-sm">{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="promo-discount-type" className="text-sm">Tipo de Desconto</Label>
          <Select value={discountType} onValueChange={setDiscountType}>
            <SelectTrigger className="mt-1 w-full text-sm"><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage" className="text-sm">Porcentagem (%)</SelectItem>
              <SelectItem value="fixed" className="text-sm">Valor Fixo (R$)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="promo-discount" className="text-sm">Valor do Desconto</Label>
          <Input id="promo-discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder={discountType === 'percentage' ? "Ex: 10" : "Ex: 5.00"} className="mt-1"/>
        </div>
      </div>
      
      {type === "Promoção do Dia" ? (
         <div>
            <Label className="text-sm">Data Única da Promoção</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full mt-1 flex justify-start text-left font-normal text-sm">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {validityStartDate ? format(validityStartDate, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={validityStartDate} onSelect={setValidityStartDate} initialFocus locale={ptBR}/></PopoverContent>
            </Popover>
         </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm">Data de Início</Label>
              <Popover>
                  <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full mt-1 flex justify-start text-left font-normal text-sm">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {validityStartDate ? format(validityStartDate, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={validityStartDate} onSelect={setValidityStartDate} initialFocus locale={ptBR}/></PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-sm">Data de Fim</Label>
              <Popover>
                  <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full mt-1 flex justify-start text-left font-normal text-sm">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          {validityEndDate ? format(validityEndDate, 'PPP', { locale: ptBR }) : <span>Escolha uma data</span>}
                      </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={validityEndDate} onSelect={setValidityEndDate} initialFocus locale={ptBR} disabled={{ before: validityStartDate }}/></PopoverContent>
              </Popover>
            </div>
        </div>
      )}

      {type === "Cupom" && (
        <div><Label htmlFor="promo-code" className="text-sm">Código do Cupom (opcional)</Label><Input id="promo-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ex: DESCONTO10" className="mt-1"/></div>
      )}
      {type === "Promoção do Dia" && (
        <div className="grid grid-cols-2 gap-4">
            <div><Label htmlFor="promo-start-time" className="text-sm">Hora de Início (opc.)</Label><Input id="promo-start-time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="mt-1"/></div>
            <div><Label htmlFor="promo-end-time" className="text-sm">Hora de Término (opc.)</Label><Input id="promo-end-time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1"/></div>
        </div>
      )}
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">{promotion ? 'Salvar Alterações' : `Criar ${type}`}</Button>
      </DialogFooter>
    </form>
  );
};

export default PromotionForm;
