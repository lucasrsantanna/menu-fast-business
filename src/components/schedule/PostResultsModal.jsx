
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BarChart2, Users, Eye, MousePointerClick, MessageCircle, CalendarClock, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';


const MetricCard = ({ icon: Icon, label, value, colorClass = "text-primary" }) => (
  <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-md">
    <Icon className={`h-6 w-6 ${colorClass}`} />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value || 'N/A'}</p>
    </div>
  </div>
);

const PostResultsModal = ({ isOpen, onClose, post }) => {
  if (!post || !post.results) return null;

  const { results } = post;
  const interactionsData = results.interactionsByHour || [
    { hour: '09:00', interactions: 10 }, { hour: '12:00', interactions: 30 }, 
    { hour: '15:00', interactions: 20 }, { hour: '18:00', interactions: 50 },
    { hour: '21:00', interactions: 25 }
  ];


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl bg-background border-border max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary flex items-center gap-2">
            <BarChart2 className="h-6 w-6" /> Resultados do Post
          </DialogTitle>
          <DialogDescription className="text-muted-foreground line-clamp-2">
            Métricas para: "{post.text}"
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4 overflow-y-auto px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MetricCard icon={Eye} label="Alcance" value={results.alcance} colorClass="text-blue-500" />
            <MetricCard icon={Users} label="Impressões" value={results.impressoes} colorClass="text-indigo-500" />
            <MetricCard icon={MousePointerClick} label="Cliques" value={results.cliques} colorClass="text-green-500" />
            <MetricCard icon={Share2} label="Leads Gerados" value={results.leads} colorClass="text-teal-500" />
          </div>
          <MetricCard icon={MessageCircle} label="Reações (Curtidas/Comentários)" value={results.reacoes} colorClass="text-pink-500" />
          {results.dataPublicacaoEfetiva && (
            <MetricCard 
              icon={CalendarClock} 
              label="Publicado Efetivamente em" 
              value={format(new Date(results.dataPublicacaoEfetiva), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })} 
              colorClass="text-orange-500"
            />
          )}

          <div className="mt-4">
            <h4 className="text-md font-semibold text-foreground mb-2">Interações por Hora</h4>
            <div className="h-[200px] bg-muted/30 p-2 rounded-md">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={interactionsData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                  <XAxis dataKey="hour" fontSize={10} stroke="hsl(var(--muted-foreground))" />
                  <YAxis fontSize={10} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.375rem',
                        fontSize: '12px'
                    }} 
                    cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                  />
                  <Bar dataKey="interactions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={20} name="Interações"/>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostResultsModal;
