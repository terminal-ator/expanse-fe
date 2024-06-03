import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware'
import { CartItem } from './types';
import { immer } from 'zustand/middleware/immer';


interface CartStore {
    cart:Map<string, CartItem>;
    statusCode: string;
    addItem: (id: string, cartItem: CartItem) => void;
    deleteItem: (id: string) => void;
    changeStatus: ()=>void
  }
  
  export const useCartStore = create<CartStore>()(persist(
    immer(
      (set, get) => ({
        cart: new Map(),
        changeStatus: ()=>{
          const stat = crypto.randomUUID().toString()
          set({
            statusCode: stat
          })
        },
        statusCode:"",
        addItem: (id: string, cartItem: CartItem) => {
          set((state)=>{
            console.log(state);
            console.log( id, cartItem)
            return state.cart.set(id, cartItem);
          })
          console.log("updating cart")
          console.log(get().cart);
        },
        deleteItem: (id: string) => {
          set((state)=>(
            state.cart.delete(id)
          ))
        },
      }),
     
    ),
    {
      name: 'cart-store',
      storage: createJSONStorage(() => localStorage),
    }
  ));