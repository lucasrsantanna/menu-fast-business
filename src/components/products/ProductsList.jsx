import React from 'react';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';
import { FileImage as LucideImageIcon } from 'lucide-react';

const ProductsList = ({ products, onEditProduct, onDeleteProduct, onToggleStatus }) => {
  return (
    <div className="flex-1 overflow-auto pr-1 pb-4">
      {products.length === 0 ? (
        <div className="text-center py-10">
          <LucideImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum produto encontrado</h3>
          <p className="mt-1 text-sm text-muted-foreground">Tente ajustar sua busca ou adicione novos produtos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard 
                  product={product}
                  onEdit={() => onEditProduct(product)}
                  onDelete={() => onDeleteProduct(product.id)}
                  onToggleStatus={() => onToggleStatus(product.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
