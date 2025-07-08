
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Facebook, Instagram, MessageSquare as WhatsAppIcon, BarChart2 as ResultsIcon, Edit3, Image as ImageIcon, Video as VideoIcon, ListChecks } from 'lucide-react';
import { format, formatDistanceToNowStrict, isFuture, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PostStatusBadge = ({ status }) => {
  let bgColor, textColor;
  switch (status) {
    case 'Agendado': bgColor = 'bg-blue-100 dark:bg-blue-900'; textColor = 'text-blue-700 dark:text-blue-300'; break;
    case 'Publicado': bgColor = 'bg-green-100 dark:bg-green-900'; textColor = 'text-green-700 dark:text-green-300'; break;
    case 'Falhou': bgColor = 'bg-red-100 dark:bg-red-900'; textColor = 'text-red-700 dark:text-red-300'; break;
    default: bgColor = 'bg-gray-100 dark:bg-gray-700'; textColor = 'text-gray-700 dark:text-gray-300';
  }
  return <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>{status}</span>;
};

const PlatformDisplayIcon = ({ platform, override }) => {
  let IconComponent;
  let colorClass;
  let title = platform.charAt(0).toUpperCase() + platform.slice(1);

  if (platform === 'facebook') { IconComponent = Facebook; colorClass = 'text-blue-600'; }
  else if (platform === 'instagram') { IconComponent = Instagram; colorClass = 'text-pink-500'; }
  else if (platform === 'whatsapp') { IconComponent = WhatsAppIcon; colorClass = 'text-green-500'; }
  else return null;

  return (
    <div className="flex items-center gap-0.5">
      <IconComponent className={`h-4 w-4 ${colorClass}`} title={title} />
      {platform === 'whatsapp' && override?.broadcastLink && (
        <Badge variant="outline" className="text-xs px-1 py-0 border-green-500 text-green-600"><ListChecks className="h-2.5 w-2.5"/>Lista</Badge>
      )}
    </div>
  );
};

const getNextPostTimeText = (dateTime) => {
    if (!isFuture(dateTime)) return "Publicado ou Passado";
    const daysDiff = differenceInDays(dateTime, new Date());
    if (daysDiff === 0) return "Hoje";
    if (daysDiff === 1) return "Amanhã";
    if (daysDiff > 1 && daysDiff <= 7) return `Em ${daysDiff} dias (${format(dateTime, 'EEEE', { locale: ptBR })})`;
    if (daysDiff > 7) return `Em ${daysDiff} dias`;
    return formatDistanceToNowStrict(dateTime, { locale: ptBR, addSuffix: true });
};

const PostList = ({ posts, currentMonth, onEditPost, onViewResults }) => {
  // Sort posts by date for display
  const sortedPosts = [...posts].sort((a,b) => new Date(a.dateTime) - new Date(b.dateTime));

  return (
    <Card className="shadow-md bg-card border-border h-full">
      <CardHeader>
        <CardTitle className="text-foreground">Posts Agendados</CardTitle>
        <CardDescription className="text-muted-foreground">
          {sortedPosts.length > 0 ? `Posts para ${format(currentMonth, 'MMMM', { locale: ptBR })}.` : 'Nenhum post agendado para este mês.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[calc(100vh-280px)] overflow-y-auto pr-2 space-y-3">
        {sortedPosts.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum post encontrado.</p>
        )}
        {sortedPosts.map(post => (
          <div key={post.id} className="p-3 border border-border rounded-lg bg-background hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
              <div className="h-16 w-16 rounded-md border border-border flex items-center justify-center bg-muted overflow-hidden">
                {post.mediaType === 'image' && post.image && <img alt={post.text.substring(0,20)} class="h-full w-full object-cover" src={post.image.startsWith('blob:') ? post.image : `/images-placeholder/${post.image}`} />}
                {post.mediaType === 'video' && post.image && <VideoIcon className="h-8 w-8 text-muted-foreground" />}
                {!post.image && <ImageIcon className="h-8 w-8 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground line-clamp-1">{post.text}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(post.dateTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                <p className="text-xs text-blue-500 font-medium">Próximo: {getNextPostTimeText(new Date(post.dateTime))}</p>
                <div className="flex items-center gap-2 mt-1">
                  <PostStatusBadge status={post.status} />
                  {post.platforms.map(pKey => <PlatformDisplayIcon key={pKey} platform={pKey} override={post.overrides?.[pKey]} />)}
                </div>
              </div>
            </div>
            <div className="mt-2 flex justify-end gap-2">
              {post.status === 'Publicado' && post.results && (
                <Button variant="outline" size="sm" onClick={() => onViewResults(post)} className="text-xs border-accent text-accent hover:bg-accent/10">
                  <ResultsIcon className="h-3 w-3 mr-1" /> Resultados
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => onEditPost(post)} className="text-xs border-primary/70 text-primary hover:bg-primary/10">
                <Edit3 className="h-3 w-3 mr-1" /> Editar
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PostList;
