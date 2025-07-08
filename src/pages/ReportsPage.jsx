import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Download, DollarSign, ShoppingBag, Users, Clock, PackageSearch, Percent, Speaker,TrendingDown, TrendingUp, BarChartHorizontal, CalendarDays } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, PieChart, Pie, Cell, BarChart as RechartsBarChart } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as ShadCalendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getFirestore, collection, onSnapshot, query } from "firebase/firestore";
import { onAuthStateChanged, getAuth } from "firebase/auth";


const COLORS_PIE = ['#1E88E5', '#43A047']; 

const ReportsPage = () => {
  const [period, setPeriod] = useState('month');
  const [customDateRange, setCustomDateRange] = useState({ from: null, to: null });
  const [orderTypeFilterReports, setOrderTypeFilterReports] = useState('all');
  const [empresaId, setEmpresaId] = useState(null);
  const [orders, setOrders] = useState([]);
  const db = getFirestore();

  // Obter empresaId (UID do usuário autenticado)
  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setEmpresaId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  // Buscar pedidos da subcoleção Firestore
  React.useEffect(() => {
    if (!empresaId) return;
    const pedidosRef = collection(db, 'empresas', empresaId, 'pedidos');
    const q = query(pedidosRef);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pedidosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(pedidosData);
    });
    return () => unsubscribe();
  }, [empresaId]);

  // Cálculos principais
  const totalPedidos = orders.length;
  const faturamentoBruto = orders.reduce((sum, o) => sum + (o.total ? Number(o.total) : 0), 0);
  const ticketMedio = totalPedidos > 0 ? (faturamentoBruto / totalPedidos) : 0;
  // Vendas por horário
  const vendasPorHorario = {};
  orders.forEach(o => {
    if (o.time) {
      const hora = new Date(o.time).getHours().toString().padStart(2, '0') + ':00';
      vendasPorHorario[hora] = (vendasPorHorario[hora] || 0) + 1;
    }
  });
  const vendasPorHorarioArr = Object.entries(vendasPorHorario).map(([horario, vendas]) => ({ horario, vendas }));
  // Pedidos por tipo
  const pedidosPorTipo = orders.reduce((acc, o) => {
    const tipo = o.type || 'Outro';
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {});
  const pedidosPorTipoArr = Object.entries(pedidosPorTipo).map(([name, value]) => ({ name, value }));

  const handleExportPDF = () => {
    alert('Funcionalidade de exportar relatório em PDF será implementada.');
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Relatórios Avançados</h1>
          <p className="text-muted-foreground">Acompanhe o desempenho detalhado do seu restaurante.</p>
        </div>
        <Button onClick={handleExportPDF} variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-sm">
            <Download className="mr-2 h-4 w-4" /> Exportar PDF
        </Button>
      </header>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
            <Label htmlFor="periodFilter" className="text-sm font-medium text-foreground">Período</Label>
            <Select value={period} onValueChange={(value) => {setPeriod(value); if(value !== 'custom') setCustomDateRange({from: null, to: null})}}>
                <SelectTrigger id="periodFilter" className="w-full sm:w-[200px] mt-1 bg-card border-border focus:ring-primary">
                <SelectValue placeholder="Selecionar Período" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
            </Select>
            {period === 'custom' && (
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        className="w-full sm:w-[280px] mt-2 flex justify-start text-left font-normal border-border bg-card hover:bg-muted/50 text-foreground focus:ring-primary"
                        >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {customDateRange.from ? 
                            (customDateRange.to ? 
                            `${format(customDateRange.from, "LLL dd, y", {locale: ptBR})} - ${format(customDateRange.to, "LLL dd, y", {locale: ptBR})}` 
                            : format(customDateRange.from, "LLL dd, y", {locale: ptBR}))
                            : <span>Escolha o intervalo</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                        <ShadCalendar
                        initialFocus
                        mode="range"
                        defaultMonth={customDateRange.from || new Date()}
                        selected={customDateRange}
                        onSelect={setCustomDateRange}
                        numberOfMonths={2}
                        locale={ptBR}
                        />
                    </PopoverContent>
                </Popover>
            )}
        </div>
        <div className="flex-1">
            <Label htmlFor="orderTypeFilterReports" className="text-sm font-medium text-foreground">Tipo de Pedido</Label>
            <Select value={orderTypeFilterReports} onValueChange={setOrderTypeFilterReports}>
                <SelectTrigger id="orderTypeFilterReports" className="w-full sm:w-[280px] mt-1 bg-card border-border focus:ring-primary">
                    <SelectValue placeholder="Todos os Tipos" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                    <SelectItem value="all">Todos (Delivery + No Restaurante)</SelectItem>
                    <SelectItem value="Delivery">Apenas Delivery</SelectItem>
                    <SelectItem value="No Restaurante">Apenas No Restaurante</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-md bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Total de Pedidos</CardTitle>
            <ShoppingBag className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalPedidos}</div>
            <p className="text-xs text-muted-foreground">Pedidos reais do período</p>
          </CardContent>
        </Card>
        <Card className="shadow-md bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Faturamento Bruto</CardTitle>
            <DollarSign className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">R$ {faturamentoBruto.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
            <p className="text-xs text-muted-foreground">Faturamento real</p>
          </CardContent>
        </Card>
        <Card className="shadow-md bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Ticket Médio</CardTitle>
            <Users className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">R$ {ticketMedio.toLocaleString('pt-BR', {minimumFractionDigits:2})}</div>
            <p className="text-xs text-muted-foreground">Ticket médio real</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" /> Vendas por Horário
            </CardTitle>
            <CardDescription className="text-muted-foreground">Performance de vendas ao longo do dia.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pr-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={vendasPorHorarioArr} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="horario" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line type="monotone" dataKey="vendas" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 6 }} name="Nº de Vendas" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Pedidos por Tipo</CardTitle>
            <CardDescription className="text-muted-foreground">Distribuição entre Delivery e No Restaurante.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pedidosPorTipoArr} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {pedidosPorTipoArr.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                <Legend wrapperStyle={{ fontSize: "12px" }}/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md bg-card border-border">
            <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2"><PackageSearch className="h-5 w-5 text-orange-500"/>Produtos Mais Vendidos</CardTitle>
                <CardDescription className="text-muted-foreground">Itens populares no período selecionado.</CardDescription>
            </CardHeader>
            <CardContent>
                {[ { id: 'p1', name: 'Pizza Margherita', vendidos: 80, image: 'pizza_margherita_thumb.jpg' }, { id: 'p2', name: 'Hambúrguer Clássico', vendidos: 65, image: 'hamburger_classic_thumb.jpg' }, { id: 'p3', name: 'Coca-Cola Lata', vendidos: 150, image: 'coca_cola_thumb.jpg' } ].map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                        <div className="flex items-center gap-2">
                            <img  class="h-10 w-10 rounded object-cover border" alt={item.name} src="https://images.unsplash.com/photo-1694388001616-1176f534d72f" />
                            <div><p className="text-sm font-medium text-foreground">{item.name}</p></div>
                        </div>
                        <p className="text-sm text-primary font-semibold">{item.vendidos} vendidos</p>
                    </div>
                ))}
            </CardContent>
        </Card>
         <Card className="shadow-md bg-card border-border">
            <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2"><BarChartHorizontal className="h-5 w-5 text-red-500"/>Giro de Estoque (Menor Rotatividade)</CardTitle>
                <CardDescription className="text-muted-foreground">Produtos com menor saída (dados de exemplo).</CardDescription>
            </CardHeader>
            <CardContent>
                {[ { name: 'Farinha Trigo', rotatividade: 20, icon: TrendingUp }, { name: 'Queijo Mussarela', rotatividade: 15, icon: TrendingUp }, { name: 'Molho Especial X', rotatividade: 5, icon: TrendingDown }, { name: 'Camarão Rosa', rotatividade: 2, icon: TrendingDown } ].filter(item => item.icon === TrendingDown).map(item => (
                    <div key={item.name} className="flex items-center justify-between p-2 border-b last:border-b-0">
                       <div className="flex items-center gap-2">
                         <item.icon className="h-4 w-4 text-red-500"/>
                         <p className="text-sm font-medium text-foreground">{item.name}</p>
                       </div>
                       <p className="text-sm text-muted-foreground">Rotatividade: {item.rotatividade}</p>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
       <Card className="shadow-md bg-card border-border">
            <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2"><Speaker className="h-5 w-5 text-indigo-500"/>Dashboard Posts x Leads</CardTitle>
                <CardDescription className="text-muted-foreground">Desempenho de posts agendados (dados de exemplo).</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] pr-2">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={[ { post: 'Promo Segunda', leads: 15, impressoes: 1200 }, { post: 'Novo Prato!', leads: 28, impressoes: 2500 }, { post: 'Sorteio FDS', leads: 5, impressoes: 800 } ]} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis dataKey="post" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                        <Legend wrapperStyle={{ fontSize: "12px" }}/>
                        <Bar dataKey="leads" fill="hsl(var(--primary))" name="Leads Gerados" barSize={20} />
                        <Bar dataKey="impressoes" fill="hsl(var(--secondary))" name="Impressões" barSize={20} />
                    </RechartsBarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>

    </div>
  );
};

export default ReportsPage;
