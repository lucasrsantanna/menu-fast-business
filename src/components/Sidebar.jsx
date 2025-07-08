import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, Package, Ticket, CalendarDays, BarChart3, Settings, Users, MessageCircle, Star, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { signOutUser } from '@/firebase';

const Sidebar = ({ onLinkClick, hasNewOrder, clearNewOrderNotification, hasFailedPost, clearFailedPostNotification }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const logoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/e6560319-1585-4cfb-a2dd-914e6379e924/40b432338d41114edb6703359e2655d2.png";

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Painel de Pedidos', notification: hasNewOrder, clearNotification: clearNewOrderNotification },
    { to: '/products', icon: Package, label: 'Produtos' },
    { to: '/promotions', icon: Ticket, label: 'Promoções & Cupons' },
    { to: '/schedule-posts', icon: CalendarDays, label: 'Agendar Posts', notification: hasFailedPost, clearNotification: clearFailedPostNotification },
    { to: '/reports', icon: BarChart3, label: 'Relatórios' },
    { to: '/feedbacks', icon: Star, label: 'Feedbacks' },
    { to: '/settings', icon: Settings, label: 'Configurações' },
    { to: '/users', icon: Users, label: 'Usuários' },
  ];
  

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-background md:w-64">
      <div className="flex h-20 items-center justify-center border-b border-border px-6">
        <NavLink to="/" className="flex flex-col items-center gap-2 font-semibold text-primary">
          <img src={logoUrl} alt="Menu Fast Business Logo" className="h-12 object-contain" />
        </NavLink>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="space-y-1 px-4">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                onClick={() => {
                  onLinkClick();
                  if (item.clearNotification) item.clearNotification();
                }}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
                    (isActive || (item.to === '/dashboard' && location.pathname === '/')) && 'bg-primary/10 text-primary font-medium shadow-sm border border-primary/20'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </div>
                {item.notification && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-4 border-t border-border flex flex-col gap-2">
        <button
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition text-sm font-medium"
          onClick={async () => {
            await signOutUser();
            navigate('/login');
          }}
        >
          <LogOut className="h-5 w-5" /> Sair
        </button>
        <p className="text-xs text-muted-foreground text-center mt-2">&copy; {new Date().getFullYear()} Menu Fast Business</p>
      </div>
    </aside>
  );
};

export default Sidebar;
