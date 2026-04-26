"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const add = () =>
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border border-white/25 dark:border-white/10 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-amaranth-100 flex items-center justify-center">
            <span className="text-amaranth-600 font-black text-xl">{product.name[0]}</span>
          </div>
        )}
        
        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-linear-to-t from-black/60 to-transparent flex justify-center gap-4">
          <button
            onClick={add}
            className="p-2 bg-white/95 rounded-full text-amaranth-700 hover:bg-amaranth-600 hover:text-white transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart size={18} />
          </button>
          <button className="p-2 bg-white/95 rounded-full text-amaranth-700 hover:bg-amaranth-600 hover:text-white transition-colors" aria-label="Wishlist (coming soon)">
            <Heart size={18} />
          </button>
          <button className="p-2 bg-white/95 rounded-full text-amaranth-700 hover:bg-amaranth-600 hover:text-white transition-colors" aria-label="Quick view (coming soon)">
            <Eye size={18} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-amaranth-500">{product.category}</p>
          <p className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100">₹{product.price.toFixed(2)}</p>
        </div>
        <h3 className="text-base sm:text-lg font-black text-zinc-800 dark:text-zinc-100 mb-1 truncate">{product.name}</h3>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-4 min-h-10">
          {product.description || "No description available for this premium item."}
        </p>
        
        <Button
          className="w-full"
          size="md"
          onClick={add}
        >
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
