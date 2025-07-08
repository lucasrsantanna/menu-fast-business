import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings as SettingsIcon, Upload, Copy, Save, Clock, MapPin, Route, PlusCircle, Trash2, Truck } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { signOutUser } from '@/firebase';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

const SettingsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [restaurantName, setRestaurantName] = useState('Meu Restaurante Gourmet');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [facebookLogin, setFacebookLogin] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('(99) 99999-9999');
  const [contactEmail, setContactEmail] = useState('contato@meurestaurante.com');
  const [openingHours, setOpeningHours] = useState(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { open: '09:00', close: '22:00', enabled: true };
      return acc;
    }, {})
  );
  const [storeClosed, setStoreClosed] = useState(false);
  const publicMenuLink = 'https://menufast.app/meu-restaurante';

  const [deliveryType, setDeliveryType] = useState('fixed'); 
  const [fixedDeliveryFee, setFixedDeliveryFee] = useState('5.00');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [pricePerKm, setPricePerKm] = useState('2.00');
  const [minDistanceKm, setMinDistanceKm] = useState('');
  const [deliveryZones, setDeliveryZones] = useState([{ id: 'zone1', name: 'Zona 1', maxDistance: '5', fixedRate: '7.00' }]);
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');

  const handleLogoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleOpeningHoursChange = (day, field, value) => {
    setOpeningHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleAddZone = () => {
    setDeliveryZones(prev => [...prev, { id: `zone${Date.now()}`, name: `Zona ${prev.length + 1}`, maxDistance: '', fixedRate: '' }]);
  };

  const handleRemoveZone = (zoneId) => {
    setDeliveryZones(prev => prev.filter(zone => zone.id !== zoneId));
  };

  const handleZoneChange = (zoneId, field, value) => {
    setDeliveryZones(prev => prev.map(zone => zone.id === zoneId ? { ...zone, [field]: value } : zone));
  };
  
  const handleSaveChanges = () => {
    toast({ title: "Configurações Salvas!", description: "Suas alterações foram salvas com sucesso.", className: "bg-status-ready border-status-ready text-white" });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicMenuLink);
    toast({ title: "Link Copiado!", description: "O link do cardápio público foi copiado para a área de transferência." });
  };

  const handleLogout = async () => {
    const result = await signOutUser();
    if (result.error) {
      toast({ title: 'Erro', description: result.error, variant: 'destructive' });
    } else {
      toast({ title: 'Logout', description: 'Você saiu da conta.' });
      navigate('/login');
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Ajuste as preferências do sistema e informações do restaurante.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSaveChanges} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
            <Save className="mr-2 h-4 w-4" /> Salvar Alterações
          </Button>
          <Button onClick={handleLogout} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
            Sair
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Informações do Restaurante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="restaurantName" className="text-foreground">Nome Comercial</Label>
                <Input id="restaurantName" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="mt-1 bg-background border-border focus:ring-primary" />
              </div>
              <div>
                <Label htmlFor="logoUpload" className="text-foreground">Logo</Label>
                <div className="mt-1 flex items-center gap-3 w-full">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview do Logo" className="h-12 w-12 rounded-md object-contain border border-border p-1 bg-white" />
                  ) : (
                    <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center border border-border">
                      <Upload className="h-7 w-7 text-muted-foreground" />
                    </div>
                  )}
                  <input
                    type="file"
                    id="logoUpload"
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="logoUpload"
                    className="px-3 py-2 bg-red-100 text-red-700 rounded cursor-pointer border border-red-300 hover:bg-red-200 transition text-sm font-semibold whitespace-nowrap"
                    style={{ minWidth: 120 }}
                  >
                    Escolher arquivo
                  </label>
                  <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {logoFile ? logoFile.name : "Nenhum arquivo escolhido"}
                  </span>
                </div>
              </div>
              <div>
                <Label htmlFor="facebookLogin" className="text-foreground">Login Meta/Facebook (Opcional)</Label>
                <Input id="facebookLogin" value={facebookLogin} onChange={(e) => setFacebookLogin(e.target.value)} placeholder="Seu usuário do Facebook" className="mt-1 bg-background border-border focus:ring-primary" />
              </div>
              <div>
                <Label htmlFor="whatsappNumber" className="text-foreground">WhatsApp (com DDD)</Label>
                <Input id="whatsappNumber" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} placeholder="(00) 00000-0000" className="mt-1 bg-background border-border focus:ring-primary" />
              </div>
              <div>
                <Label htmlFor="contactEmail" className="text-foreground">E-mail de Contato</Label>
                <Input id="contactEmail" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="seuemail@exemplo.com" className="mt-1 bg-background border-border focus:ring-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2"><Clock className="h-5 w-5 text-primary"/> Horário de Funcionamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {daysOfWeek.map(day => (
                <div key={day} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center p-2 border-b border-border last:border-b-0">
                  <Label className="sm:col-span-1 text-foreground font-medium">{day}</Label>
                  <div className="sm:col-span-1">
                    <Input type="time" value={openingHours[day].open} onChange={(e) => handleOpeningHoursChange(day, 'open', e.target.value)} disabled={!openingHours[day].enabled} className="bg-background border-border focus:ring-primary disabled:opacity-50" />
                  </div>
                  <div className="sm:col-span-1">
                    <Input type="time" value={openingHours[day].close} onChange={(e) => handleOpeningHoursChange(day, 'close', e.target.value)} disabled={!openingHours[day].enabled} className="bg-background border-border focus:ring-primary disabled:opacity-50" />
                  </div>
                  <div className="sm:col-span-1 flex items-center justify-end space-x-2">
                    <Label htmlFor={`enabled-${day}`} className="text-xs text-muted-foreground">Aberto</Label>
                    <Switch id={`enabled-${day}`} checked={openingHours[day].enabled} onCheckedChange={(checked) => handleOpeningHoursChange(day, 'enabled', checked)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2"><Truck className="h-5 w-5 text-primary"/> Configuração de Frete</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="storeClosed" className="text-foreground">Loja Fechada (Pausa Pedidos)</Label>
                <Switch id="storeClosed" checked={storeClosed} onCheckedChange={setStoreClosed} />
              </div>
              
              <div>
                <Label className="text-foreground mb-2 block">Tipo de Frete</Label>
                <RadioGroup value={deliveryType} onValueChange={setDeliveryType} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed-delivery" />
                        <Label htmlFor="fixed-delivery">Fixo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="distance" id="distance-delivery" />
                        <Label htmlFor="distance-delivery">Por Distância</Label>
                    </div>
                </RadioGroup>
              </div>

              {deliveryType === 'fixed' && (
                <div>
                  <Label htmlFor="fixedDeliveryFee" className="text-foreground">Valor do Frete Fixo (R$)</Label>
                  <Input id="fixedDeliveryFee" type="number" step="0.01" value={fixedDeliveryFee} onChange={(e) => setFixedDeliveryFee(e.target.value)} className="mt-1 bg-background border-border focus:ring-primary" />
                </div>
              )}

              {deliveryType === 'distance' && (
                <div className="space-y-4 pt-2 border-t border-border mt-4">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2"><Route className="h-4 w-4 text-primary"/> Config. Frete por Distância</h4>
                  <div>
                    <Label htmlFor="restaurantAddress" className="text-foreground">Endereço do Restaurante</Label>
                    <Input id="restaurantAddress" value={restaurantAddress} onChange={(e) => setRestaurantAddress(e.target.value)} placeholder="Rua Exemplo, 123, Bairro, Cidade" className="mt-1 bg-background border-border focus:ring-primary" />
                    <p className="text-xs text-muted-foreground mt-1">Usado para calcular distância. (Google Maps API - integração futura)</p>
                  </div>
                  <div>
                    <Label htmlFor="pricePerKm" className="text-foreground">Preço por Km (R$/km)</Label>
                    <Input id="pricePerKm" type="number" step="0.01" value={pricePerKm} onChange={(e) => setPricePerKm(e.target.value)} className="mt-1 bg-background border-border focus:ring-primary" />
                  </div>
                  <div>
                    <Label htmlFor="minDistanceKm" className="text-foreground">Distância Mínima (km - opcional)</Label>
                    <Input id="minDistanceKm" type="number" step="0.1" value={minDistanceKm} onChange={(e) => setMinDistanceKm(e.target.value)} placeholder="Ex: 2 (cobra apenas acima de 2km)" className="mt-1 bg-background border-border focus:ring-primary" />
                  </div>
                  <div>
                    <Label className="text-foreground">Zonas de Entrega (Opcional)</Label>
                    {deliveryZones.map((zone, index) => (
                        <Card key={zone.id} className="p-3 mt-2 bg-muted/30 border-border relative">
                            <div className="grid grid-cols-2 gap-2">
                                <Input value={zone.name} onChange={(e) => handleZoneChange(zone.id, 'name', e.target.value)} placeholder="Nome da Zona" className="bg-background text-sm"/>
                                <Input type="number" value={zone.maxDistance} onChange={(e) => handleZoneChange(zone.id, 'maxDistance', e.target.value)} placeholder="Dist. Máx (km)" className="bg-background text-sm"/>
                                <Input type="number" value={zone.fixedRate} onChange={(e) => handleZoneChange(zone.id, 'fixedRate', e.target.value)} placeholder="Tarifa Fixa (R$)" className="col-span-2 bg-background text-sm"/>
                            </div>
                             {deliveryZones.length > 0 && (
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveZone(zone.id)} className="absolute top-1 right-1 h-6 w-6 text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-3 w-3"/>
                                </Button>
                             )}
                        </Card>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleAddZone} className="mt-2 w-full border-dashed border-primary text-primary hover:bg-primary/10">
                        <PlusCircle className="h-4 w-4 mr-2"/> Nova Zona
                    </Button>
                  </div>
                   <div>
                    <Label htmlFor="googleMapsApiKey" className="text-foreground">API Key do Google Maps (Opcional)</Label>
                    <Input id="googleMapsApiKey" value={googleMapsApiKey} onChange={(e) => setGoogleMapsApiKey(e.target.value)} placeholder="Sua chave da API do Google Maps Platform" className="mt-1 bg-background border-border focus:ring-primary" />
                     <p className="text-xs text-muted-foreground mt-1">Necessária para geocodificação e cálculo preciso de distância.</p>
                  </div>
                </div>
              )}


              <div className="border-t border-border pt-4">
                <Label className="text-foreground">Link Público do Cardápio</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Input type="text" value={publicMenuLink} readOnly className="flex-1 bg-muted border-border text-muted-foreground" />
                  <Button variant="outline" size="icon" onClick={handleCopyLink} className="border-primary text-primary hover:bg-primary/10">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
