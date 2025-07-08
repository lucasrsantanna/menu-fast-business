import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DialogFooter } from '@/components/ui/dialog';
import { FileImage as LucideImageIcon, ChevronsUpDown, PackageCheck, Scale, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const ProductForm = ({ product, onSubmit, onCancel, categories }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  
  const [controlStock, setControlStock] = useState(true);
  const [unit, setUnit] = useState('Quantidade'); // KG or Quantidade
  const [stock, setStock] = useState(0);
  const [avgUsedPerOrder, setAvgUsedPerOrder] = useState(1);
  const [lowStockAlert, setLowStockAlert] = useState(10); // Percentage or absolute value based on unit

  const { toast } = useToast();

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setCategory(product.category || (categories && categories.length > 0 ? categories[0] : ''));
      setPrice(product.price || '');
      setImagePreview(product.image ? `/images-placeholder/${product.image}` : null);
      setIsFeatured(product.featured || false);
      setIsBestSeller(product.bestSeller || false);
      
      setControlStock(product.controlStock !== undefined ? product.controlStock : true);
      setUnit(product.unit || 'Quantidade');
      setStock(product.stock || 0);
      setAvgUsedPerOrder(product.avgUsedPerOrder || 1);
      setLowStockAlert(product.lowStockAlert || 10);
    } else {
      setName('');
      setDescription('');
      setCategory(categories && categories.length > 0 ? categories[0] : '');
      setPrice('');
      setImageFile(null);
      setImagePreview(null);
      setIsFeatured(false);
      setIsBestSeller(false);

      setControlStock(true);
      setUnit('Quantidade');
      setStock(0);
      setAvgUsedPerOrder(1);
      setLowStockAlert(10);
    }
  }, [product, categories]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !category || !price) {
        toast({
            title: "Erro de Validação",
            description: "Nome, categoria e preço são obrigatórios.",
            variant: "destructive",
        });
        return;
    }
    const newProductData = { 
      id: product ? product.id : `p${Date.now()}`, 
      name, description, category, price, 
      status: product ? product.status : 'Ativo', 
      image: imageFile ? imageFile.name : (product ? product.image : 'default_product.png'), 
      featured: isFeatured, 
      bestSeller: isBestSeller,
      controlStock,
      unit: controlStock ? unit : '',
      stock: controlStock ? parseFloat(stock) : 0,
      avgUsedPerOrder: controlStock ? parseFloat(avgUsedPerOrder) : 0,
      lowStockAlert: controlStock ? parseFloat(lowStockAlert) : 0,
    };
    onSubmit(newProductData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div>
        <Label htmlFor="product-name" className="text-sm font-medium text-foreground">Nome do Produto</Label>
        <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Pizza Calabresa" className="mt-1 bg-background border-border focus:ring-primary" />
      </div>
      <div>
        <Label htmlFor="product-description" className="text-sm font-medium text-foreground">Descrição</Label>
        <Input id="product-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Molho de tomate, calabresa, cebola..." className="mt-1 bg-background border-border focus:ring-primary" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="product-category" className="text-sm font-medium text-foreground">Categoria</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full mt-1 flex justify-between items-center border-border bg-background hover:bg-muted/50 text-foreground focus:ring-primary">
                {category || "Selecionar Categoria"} <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] bg-card border-border">
              {categories.map(cat => (
                <DropdownMenuItem key={cat} onSelect={() => setCategory(cat)} className="hover:bg-muted/50 focus:bg-muted/80">
                  {cat}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <Label htmlFor="product-price" className="text-sm font-medium text-foreground">Preço (R$)</Label>
          <Input id="product-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: 29.90" className="mt-1 bg-background border-border focus:ring-primary" />
        </div>
      </div>
      
      <div className="space-y-3 pt-3 border-t border-border">
        <div className="flex items-center space-x-2">
            <Checkbox id="control-stock" checked={controlStock} onCheckedChange={setControlStock} className="border-primary data-[state=checked]:bg-primary"/>
            <Label htmlFor="control-stock" className="text-sm font-medium text-foreground flex items-center gap-1"><PackageCheck className="h-4 w-4 text-primary"/>Controlar Estoque</Label>
        </div>
        {controlStock && (
            <div className="space-y-3 pl-2 border-l-2 border-primary/30 ml-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="stock-unit" className="text-sm font-medium text-foreground flex items-center gap-1"><Scale className="h-4 w-4 text-muted-foreground"/>Unidade de Medida</Label>
                        <Select value={unit} onValueChange={setUnit}>
                            <SelectTrigger className="w-full mt-1 bg-background border-border focus:ring-primary"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-card border-border">
                                <SelectItem value="Quantidade">Quantidade (Porções/Unidades)</SelectItem>
                                <SelectItem value="KG">Quilograma (KG)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="product-stock" className="text-sm font-medium text-foreground">Qtd. em Estoque Atual</Label>
                        <Input id="product-stock" type="number" step={unit === 'KG' ? "0.001" : "1"} value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Ex: 50" className="mt-1 bg-background border-border focus:ring-primary" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="avg-used" className="text-sm font-medium text-foreground">Qtd. Média por Pedido</Label>
                        <Input id="avg-used" type="number" step={unit === 'KG' ? "0.001" : "1"} value={avgUsedPerOrder} onChange={(e) => setAvgUsedPerOrder(e.target.value)} placeholder={unit === 'KG' ? "Ex: 0.150" : "Ex: 1"} className="mt-1 bg-background border-border focus:ring-primary" />
                    </div>
                    <div>
                        <Label htmlFor="low-stock-alert" className="text-sm font-medium text-foreground flex items-center gap-1"><AlertTriangle className="h-4 w-4 text-orange-500"/>Alerta Estoque Baixo ({unit === 'KG' ? 'kg' : 'unid.'})</Label>
                        <Input id="low-stock-alert" type="number" step={unit === 'KG' ? "0.1" : "1"} value={lowStockAlert} onChange={(e) => setLowStockAlert(e.target.value)} placeholder="Ex: 5" className="mt-1 bg-background border-border focus:ring-primary" />
                    </div>
                </div>
            </div>
        )}
      </div>

      <div>
        <Label htmlFor="product-image" className="text-sm font-medium text-foreground">Imagem do Produto</Label>
        <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {imagePreview ? (
            <img  alt={name || "Preview do produto"} className="h-20 w-20 rounded-md object-cover shadow-sm border border-border" src={imagePreview.startsWith('blob:') ? imagePreview : "https://images.unsplash.com/photo-1635865165118-917ed9e20936"} />
          ) : (
            <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center border border-border">
              <LucideImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          {/* Custom file input */}
          <div className="flex-1 flex items-center gap-2">
            <input
              type="file"
              id="product-image"
              onChange={handleImageChange}
              className="hidden"
            />
            <label
              htmlFor="product-image"
              className="px-3 py-2 bg-red-100 text-red-700 rounded cursor-pointer border border-red-300 hover:bg-red-200 transition text-sm font-semibold"
            >
              Escolher arquivo
            </label>
            <span className="text-xs text-muted-foreground truncate max-w-xs">
              {imageFile ? imageFile.name : "Nenhum arquivo escolhido"}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-primary" />
          <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">Produto em Destaque</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="best-seller" checked={isBestSeller} onCheckedChange={setIsBestSeller} className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:ring-primary" />
          <Label htmlFor="best-seller" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground">Mais Vendido</Label>
        </div>
      </div>
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-secondary text-secondary-foreground hover:bg-secondary/20">Cancelar</Button>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          {product ? 'Salvar Alterações' : 'Adicionar Produto'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProductForm;
