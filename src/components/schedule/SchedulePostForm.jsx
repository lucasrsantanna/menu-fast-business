
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/components/ui/use-toast";
import MediaUpload from '@/components/schedule/form/MediaUpload';
import DateTimeRecurrence from '@/components/schedule/form/DateTimeRecurrence';
import PlatformOverrides from '@/components/schedule/form/PlatformOverrides';

const SchedulePostForm = ({ post, onSubmit, onCancel }) => {
  const [text, setText] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState('image');
  const [platforms, setPlatforms] = useState([]);
  const [recurrence, setRecurrence] = useState('once');
  const [customRecurrenceDates, setCustomRecurrenceDates] = useState([]);
  const [overrides, setOverrides] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (post) {
      setText(post.text || '');
      setSelectedDateTime(post.dateTime ? new Date(post.dateTime) : new Date());
      setMediaPreview(post.image ? (post.mediaType === 'video' ? null : `/images-placeholder/${post.image}`) : null); 
      setMediaType(post.mediaType || 'image');
      setPlatforms(post.platforms || []);
      setRecurrence(post.recurrence || 'once');
      setCustomRecurrenceDates(post.customDates ? post.customDates.map(d => new Date(d)) : []);
      setOverrides(post.overrides || {});
    } else {
      setText('');
      setSelectedDateTime(new Date());
      setMediaFile(null);
      setMediaPreview(null);
      setMediaType('image');
      setPlatforms([]);
      setRecurrence('once');
      setCustomRecurrenceDates([]);
      setOverrides({});
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text || !selectedDateTime || platforms.length === 0) {
      toast({ title: "Erro de Validação", description: "Texto, data/hora e pelo menos uma plataforma são obrigatórios.", variant: "destructive" });
      return;
    }
    if (recurrence === 'custom' && customRecurrenceDates.length === 0) {
      toast({ title: "Erro de Validação", description: "Para recorrência personalizada, selecione pelo menos uma data.", variant: "destructive" });
      return;
    }
    
    const newPostData = {
      id: post ? post.id : `sp${Date.now()}`,
      text,
      dateTime: selectedDateTime,
      image: mediaFile ? mediaFile.name : (post ? post.image : (mediaType === 'video' ? 'default_video.mp4' : 'default_post.png')),
      mediaType,
      status: 'Agendado',
      platforms,
      recurrence,
      customDates: recurrence === 'custom' ? customRecurrenceDates.map(d => d.toISOString()) : [],
      overrides,
    };
    onSubmit(newPostData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="post-text" className="text-sm font-medium text-foreground">Texto do Post</Label>
        <Textarea id="post-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Digite a mensagem para todas as redes..." className="mt-1 bg-background border-border focus:ring-primary min-h-[100px]" />
      </div>
      
      <MediaUpload 
        mediaFile={mediaFile}
        setMediaFile={setMediaFile}
        mediaPreview={mediaPreview}
        setMediaPreview={setMediaPreview}
        mediaType={mediaType}
        setMediaType={setMediaType}
        postImage={post?.image}
      />

      <DateTimeRecurrence
        selectedDateTime={selectedDateTime}
        setSelectedDateTime={setSelectedDateTime}
        recurrence={recurrence}
        setRecurrence={setRecurrence}
        customRecurrenceDates={customRecurrenceDates}
        setCustomRecurrenceDates={setCustomRecurrenceDates}
      />
      
      <PlatformOverrides
        platforms={platforms}
        setPlatforms={setPlatforms}
        overrides={overrides}
        setOverrides={setOverrides}
      />
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-secondary text-secondary-foreground hover:bg-secondary/20">Cancelar</Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {post ? 'Salvar Alterações' : 'Agendar Post'}
        </Button>
      </div>
    </form>
  );
};

export default SchedulePostForm;
