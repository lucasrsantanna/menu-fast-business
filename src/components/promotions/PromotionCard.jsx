
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, BarChart2 as ResultsIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PromotionCard = ({ promo, onEdit, onDelete, onToggleStatus, onViewResults }) => (
    <Card className="shadow-md bg-card border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onViewResults(promo)}>
        <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-lg text-foreground">{promo.name}</CardTitle>
                    <CardDescription className="text-sm">
                        Tipo: <span className={`font-medium ${promo.type === 'Cupom' ? 'text-blue-600' : 'text-orange-600'}`}>{promo.type}</span>
                        {promo.code && ` | Código: ${promo.code}`}
                    </CardDescription>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${promo.status === 'Ativa' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{promo.status}</span>
            </div>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
            <p><span className="font-medium text-muted-foreground">Produtos:</span> {promo.productsAffected.join(', ')}</p>
            <p><span className="font-medium text-muted-foreground">Desconto:</span> <span className="text-primary font-semibold">{promo.discount}</span></p>
            <p><span className="font-medium text-muted-foreground">Vigência:</span> {format(parseISO(promo.validityStart), 'dd/MM/yy', {locale: ptBR})} - {format(parseISO(promo.validityEnd), 'dd/MM/yy', {locale: ptBR})}
                {promo.startTime && ` das ${promo.startTime} até ${promo.endTime || 'fim do dia'}`}
            </p>
            <p><span className="font-medium text-muted-foreground">Usos:</span> {promo.uses || 0} | <span className="font-medium text-muted-foreground">Receita:</span> R$ {(promo.revenueGenerated || 0).toFixed(2)}</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onViewResults(promo);}} className="text-xs text-indigo-600 hover:bg-indigo-100"><ResultsIcon className="h-3 w-3 mr-1"/>Ver Detalhes</Button>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(promo);}}><Edit2 className="h-3 w-3 mr-1"/>Editar</Button>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onToggleStatus(promo.id);}}>{promo.status === 'Ativa' ? 'Desativar' : 'Ativar'}</Button>
            <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); onDelete(promo.id);}}><Trash2 className="h-3 w-3 mr-1"/>Excluir</Button>
        </CardFooter>
    </Card>
);

export default PromotionCard;
