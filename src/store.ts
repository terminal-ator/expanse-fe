import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CartItem } from "./types";
import { immer } from "zustand/middleware/immer";

interface CartStore {
  cart: Record<string, CartItem>;
  statusCode: string;
  addItem: (id: string, cartItem: CartItem) => void;
  deleteItem: (id: string) => void;
  changeStatus: () => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    immer((set, get) => ({
      cart: {},
      changeStatus: () => {
        const stat = crypto.randomUUID().toString();
        set({
          statusCode: stat,
        });
      },
      statusCode: "",
      addItem: (id: string, cartItem: CartItem) => {
        set((state) => {
          state.cart[id] = cartItem;
        });
        console.log(get().cart);
      },
      deleteItem: (id: string) => {
        set((state) => {
          delete state.cart[id];
        });
      },
      clearCart: () => {
        set((state) => {
          state.cart = {};
        });
      },
    })),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
