'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { addItem, createCartAction, getCartAction, removeItem, updateItem } from './actions';
type AcarsData = { title: string; quantity: number; price: string } | null;

type CartContextType = {
  cart: any | null;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (merchandiseId: string, quantity: number, productInfo?: { title: string, price: string }) => Promise<void>;
  removeFromCart: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, quantity: number) => Promise<void>;
  isLoading: boolean;
  acarsData: AcarsData;
  closeAcarsModal: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [acarsData, setAcarsData] = useState<AcarsData>(null);

  useEffect(() => {
    async function initCart() {
      const cartId = localStorage.getItem('shopify_cart_id');
      if (cartId) {
        try {
          const result = await getCartAction(cartId);
          if (result.success && result.cart) {
            setCart(result.cart);
          } else {
            // Cart might be expired, create a new one
            localStorage.removeItem('shopify_cart_id');
            await initCart();
            return;
          }
        } catch (e) {
          console.error("Error fetching cart", e);
        }
      }
      setIsLoading(false);
    }
    initCart();
  }, []);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const closeAcarsModal = () => setAcarsData(null);

  const addToCart = async (merchandiseId: string, quantity: number, productInfo?: { title: string, price: string }) => {
    try {
      setIsLoading(true);
      let cartId = localStorage.getItem('shopify_cart_id');
      let currentCart = cart;

      if (!cartId || !currentCart) {
        const createResult = await createCartAction();
        if (!createResult.success || !createResult.cart) throw new Error("Could not create cart");
        currentCart = createResult.cart;
        cartId = currentCart.id;
        localStorage.setItem('shopify_cart_id', cartId!);
      }

      const result = await addItem(cartId!, merchandiseId, quantity);
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setCart(result.cart);
      
      if (productInfo) {
        setAcarsData({
          title: productInfo.title,
          quantity,
          price: productInfo.price
        });
      } else {
        openCart();
      }
    } catch (e) {
      console.error("Error adding to cart:", e);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (lineId: string) => {
    try {
      setIsLoading(true);
      const cartId = localStorage.getItem('shopify_cart_id');
      if (!cartId) return;
      const result = await removeItem(cartId, [lineId]);
      if (!result.success) throw new Error(result.error);
      if (result.cart) setCart(result.cart);
    } catch (e) {
      console.error("Error removing from cart:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(lineId);
    }
    try {
      setIsLoading(true);
      const cartId = localStorage.getItem('shopify_cart_id');
      if (!cartId) return;
      const result = await updateItem(cartId, [{ id: lineId, quantity }]);
      if (!result.success) throw new Error(result.error);
      if (result.cart) setCart(result.cart);
    } catch (e) {
      console.error("Error updating quantity:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cart, isCartOpen, openCart, closeCart, addToCart, removeFromCart, updateQuantity, isLoading, acarsData, closeAcarsModal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
