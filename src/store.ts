import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware'
import { Product } from './types';


interface CartStore {
    cart: {};
    statusCode: string;
    addItem: (product: Product, quantity: number) => void;
    deleteItem: (id: string) => void;
    changeStatus: ()=>void
  }
  
  export const useCartStore = create<CartStore>()(
    persist(
      (set, get) => ({
        cart: {},
        changeStatus: ()=>{
          const stat = crypto.randomUUID().toString()
          set({
            statusCode: stat
          })
        },
        statusCode:"",

        addItem: (product: Product, quantity: number) => {
          let cart = get().cart;
          let c = { ...cart, [product.id]: { product, quantity} };
          set({ cart: c });
        },
        deleteItem: (id: string) => {
          let cart = get().cart;
          let c = { ...cart, [id]: {quantity:0} };
          set({ cart: c });
        },
      }),
      {
        name: 'cart-store',
        storage: createJSONStorage(() => localStorage),
      }
    )
  );