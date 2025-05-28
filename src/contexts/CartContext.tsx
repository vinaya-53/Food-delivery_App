import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db } from "../services/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { MenuItem } from "../components/FoodItem";

type CartItem = MenuItem & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  loadCart: () => Promise<void>;
  getTotal: () => number;
  clearCart: () => void; 
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const defaultUserId = "user_123";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const clearCart = () => setCart([]);

  const loadCart = async () => {
    const cartRef = doc(db, "carts", defaultUserId);
    const cartSnap = await getDoc(cartRef);
    if (cartSnap.exists()) {
      const data = cartSnap.data();
      setCart(data.items || []);
    } else {
      setCart([]);
    }
  };

  const saveCart = async (updatedCart: CartItem[]) => {
    const cartRef = doc(db, "carts", defaultUserId);
    await setDoc(cartRef, { items: updatedCart });
  };

  const addToCart = async (item: MenuItem, quantity: number) => {
    const existing = cart.find((ci) => ci.id === item.id);
    let newCart;
    if (existing) {
      newCart = cart.map((ci) =>
        ci.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
      );
    } else {
      newCart = [...cart, { ...item, quantity }];
    }
    setCart(newCart);
    await saveCart(newCart);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    const newCart = cart
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    setCart(newCart);
    await saveCart(newCart);
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, loadCart, getTotal,clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
