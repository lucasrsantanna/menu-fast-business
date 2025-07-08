
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Facebook, Instagram, MessageSquare as WhatsAppIcon, Edit3, ExternalLink } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";


const platformConfigDetails = {
  facebook: { label: 'Facebook', icon: Facebook, destinations: ['Feed', 'Status'] },
  instagram: { label: 'Instagram', icon: Instagram, formats: ['Feed', 'Stories', 'Reels'] },
  whatsapp: { label: 'WhatsApp', icon: WhatsAppIcon, types: ['Status', 'Chat'] },
};

const PlatformOverrides = ({ platforms, setPlatforms, overrides, setOverrides }) => {
  const { toast } = useToast();

  const handlePlatformChange = (platformKey) => {
    setPlatforms(prev => 
      prev.includes(platformKey) ? prev.filter(p => p !== platformKey) : [...prev, platformKey]
    );
    if (!overrides[platformKey]) {
      const defaultOverrides = { text: '' };
      if (platformKey === 'instagram') {
        defaultOverrides.format = 'Feed';
        defaultOverrides.hashtags = '';
      }
      if (platformKey === 'facebook') {
        defaultOverrides.destination = 'Feed';
      }
      if (platformKey === 'whatsapp') {
        defaultOverrides.type = 'Chat';
        defaultOverrides.broadcastLink = '';
      }
      setOverrides(prev => ({ ...prev, [platformKey]: defaultOverrides }));
    }
  };

  const handleOverrideChange = (platformKey, field, value) => {
    setOverrides(prev => ({
      ...prev,
      [platformKey]: { ...prev[platformKey], [field]: value }
    }));
  };
  
  const openWhatsAppList = (platformKey) => {
    if(overrides[platformKey]?.broadcastLink) {
        window.open(overrides[platformKey].broadcastLink, '_blank');
    } else {
        toast({title: "Link não informado", description: "Por favor, insira o link da lista de transmissão do WhatsApp.", variant: "destructive"});
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium text-foreground">Plataformas</Label>
      <div className="mt-2 space-y-1">
        {Object.entries(platformConfigDetails).map(([key, platformConfig]) => (
          <div key={key}>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
              <Checkbox 
                id={`platform-${key}`} 
                checked={platforms.includes(key)} 
                onCheckedChange={() => handlePlatformChange(key)} 
                className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-primary" 
              />
              <Label htmlFor={`platform-${key}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground flex items-center gap-1.5 cursor-pointer flex-1">
                <platformConfig.icon className={`h-5 w-5 text-${key === 'facebook' ? 'blue' : key === 'instagram' ? 'pink' : 'green'}-600`} /> {platformConfig.label}
              </Label>
              {platforms.includes(key) && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`override-${key}`} className="border-none">
                     <AccordionTrigger className="text-xs text-primary hover:no-underline py-0 px-2 h-auto">
                       <Edit3 className="h-3 w-3 mr-1"/> Editar para {platformConfig.label}
                     </AccordionTrigger>
                     <AccordionContent className="pt-2 space-y-3 bg-muted/30 p-3 rounded-md mt-1">
                      <div>
                          <Label htmlFor={`override-text-${key}`} className="text-xs text-foreground">Texto Específico {platformConfig.label}</Label>
                          <Textarea id={`override-text-${key}`} value={overrides[key]?.text || ''} onChange={(e) => handleOverrideChange(key, 'text', e.target.value)} placeholder={`Texto customizado para ${platformConfig.label}...`} className="mt-1 bg-background border-border focus:ring-primary text-sm min-h-[80px]" />
                      </div>
                      {key === 'facebook' && platformConfig.destinations && (
                        <div>
                          <Label htmlFor={`override-destination-${key}`} className="text-xs text-foreground">Destino Facebook</Label>
                          <Select value={overrides[key]?.destination || 'Feed'} onValueChange={(value) => handleOverrideChange(key, 'destination', value)}>
                              <SelectTrigger className="w-full mt-1 bg-background border-border focus:ring-primary text-sm h-9"><SelectValue/></SelectTrigger>
                              <SelectContent className="bg-card border-border text-sm">
                                  {platformConfig.destinations.map(dest => <SelectItem key={dest} value={dest}>{dest}</SelectItem>)}
                              </SelectContent>
                          </Select>
                        </div>
                      )}
                      {key === 'instagram' && platformConfig.formats && (
                        <>
                          <div>
                            <Label htmlFor={`override-format-${key}`} className="text-xs text-foreground">Formato Instagram</Label>
                              <Select value={overrides[key]?.format || 'Feed'} onValueChange={(value) => handleOverrideChange(key, 'format', value)}>
                                  <SelectTrigger className="w-full mt-1 bg-background border-border focus:ring-primary text-sm h-9"><SelectValue/></SelectTrigger>
                                  <SelectContent className="bg-card border-border text-sm">
                                      {platformConfig.formats.map(fmt => <SelectItem key={fmt} value={fmt}>{fmt}</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                          <div>
                            <Label htmlFor={`override-hashtags-${key}`} className="text-xs text-foreground">Hashtags (Opcional)</Label>
                            <Input id={`override-hashtags-${key}`} value={overrides[key]?.hashtags || ''} onChange={(e) => handleOverrideChange(key, 'hashtags', e.target.value)} placeholder="#exemplo #hashtags" className="mt-1 bg-background border-border focus:ring-primary text-sm h-9" />
                          </div>
                        </>
                      )}
                      {key === 'whatsapp' && platformConfig.types && (
                         <>
                          <div className="flex items-center space-x-2">
                              <Checkbox id={`override-type-${key}`} checked={overrides[key]?.type === 'Status'} onCheckedChange={(checked) => handleOverrideChange(key, 'type', checked ? 'Status' : 'Chat')} />
                              <Label htmlFor={`override-type-${key}`} className="text-xs">Postar no Status</Label>
                          </div>
                          <div>
                              <Label htmlFor={`override-broadcast-${key}`} className="text-xs text-foreground">Link Lista Transmissão (Chat)</Label>
                              <Input id={`override-broadcast-${key}`} value={overrides[key]?.broadcastLink || ''} onChange={(e) => handleOverrideChange(key, 'broadcastLink', e.target.value)} placeholder="https://chat.whatsapp.com/..." className="mt-1 bg-background border-border focus:ring-primary text-sm h-9" />
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={() => openWhatsAppList(key)} className="mt-1 text-xs h-8 border-green-500 text-green-600 hover:bg-green-500/10">
                              <ExternalLink className="h-3 w-3 mr-1"/> Abrir Lista
                          </Button>
                         </>
                      )}
                     </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformOverrides;
