'use server';

import { addToCart as addToCartApi, createCart as createCartApi, getCart as getCartApi, removeFromCart, updateCartLines } from '@/lib/shopify';
import { revalidateTag } from 'next/cache';

export async function addItem(cartId: string, merchandiseId: string, quantity: number) {
  try {
    const cart = await addToCartApi(cartId, [{ merchandiseId, quantity }]);
    revalidateTag('cart');
    return { success: true, cart };
  } catch (error) {
    console.error('Error in addItem server action:', error);
    return { success: false, error: 'Failed to add item to cart' };
  }
}

export async function createCartAction() {
  try {
    const cart = await createCartApi();
    return { success: true, cart };
  } catch (error) {
    console.error('Error in createCartAction:', error);
    return { success: false, error: 'Failed to create cart' };
  }
}

export async function getCartAction(cartId: string) {
  try {
    const cart = await getCartApi(cartId);
    return { success: true, cart };
  } catch (error) {
    console.error('Error in getCartAction:', error);
    return { success: false, error: 'Failed to get cart' };
  }
}

export async function removeItem(cartId: string, lineIds: string[]) {
  try {
    const cart = await removeFromCart(cartId, lineIds);
    revalidateTag('cart');
    return { success: true, cart };
  } catch (error) {
    console.error('Error in removeItem server action:', error);
    return { success: false, error: 'Failed to remove item from cart' };
  }
}

export async function updateItem(cartId: string, lines: { id: string; quantity: number }[]) {
  try {
    const cart = await updateCartLines(cartId, lines);
    revalidateTag('cart');
    return { success: true, cart };
  } catch (error) {
    console.error('Error in updateItem server action:', error);
    return { success: false, error: 'Failed to update item in cart' };
  }
}
