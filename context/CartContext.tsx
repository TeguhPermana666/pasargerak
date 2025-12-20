'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  // Load cart dari localStorage saat awal buka
  useEffect(() => {
    const saved = localStorage.getItem('pg_cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  // Simpan ke localStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('pg_cart', JSON.stringify(cart));
  }, [cart]);
  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decreaseFromCart = (id: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing && existing.quantity > 1) {
        // Jika lebih dari 1, kurangi 1
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prev.filter((item) => item.id !== id);
      }
    });
  };
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <CartContext.Provider value={{ cart, addToCart, decreaseFromCart, removeFromCart, clearCart, total, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);