import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Search, PackageOpen, PackageX, ArchiveX } from 'lucide-react';

const ProductsHeader = ({ onNewProductClick, searchTerm, onSearchTermChange, stockFilter, onStockFilterChange, statusFilter, onStatusFilterChange }) => {
  return (
    <header className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Produtos
          </h1>
          <p className="text-muted-foreground">Gerencie seu cardápio e estoque.</p>
        </div>
        <Button onClick={onNewProductClick} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md transition-transform hover:scale-105">
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Produto
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar produtos por nome ou categoria..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10 w-full bg-card border-border focus:ring-primary"
          />
        </div>
        <Select value={stockFilter} onValueChange={onStockFilterChange}>
            <SelectTrigger className="w-full sm:w-[220px] bg-card border-border focus:ring-primary">
                <SelectValue placeholder="Filtrar por estoque" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
                <SelectItem value="all">Todos os Estoques</SelectItem>
                <SelectItem value="lowStock"><PackageOpen className="h-4 w-4 mr-2 inline text-orange-500"/>Em Falta (Baixo Estoque)</SelectItem>
                <SelectItem value="outOfStock"><PackageX className="h-4 w-4 mr-2 inline text-red-500"/>Sem Estoque (0)</SelectItem>
                <SelectItem value="notControlled"><ArchiveX className="h-4 w-4 mr-2 inline text-gray-500"/>Não Controlado</SelectItem>
            </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px] bg-card border-border focus:ring-primary">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all">Todos os Produtos</SelectItem>
            <SelectItem value="Ativo">Ativos</SelectItem>
            <SelectItem value="Pausado">Pausados</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
};

export default ProductsHeader;
