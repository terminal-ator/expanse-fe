import { FC } from "react";
import pb from "../pb";
import { Product } from "../types";
import { useCartStore } from "../store";

interface ICartItem {
  p: Product;
  quantity: number;
  onRemove: () => void;
  immutableMode?: boolean;
}
const CartItem: FC<ICartItem> = ({ p, quantity, onRemove, immutableMode }) => {
  //   const addToCart = async () => {
  //     const user_id: string = pb.authStore.model?.id;
  //     try {
  //       const data = await pb
  //         .collection("cart_items")
  //         .create({ of_user: user_id, of_product: p.id, quantity: quant });
  //       console.log({ data });
  //     } catch (e) {
  //       const record = await pb
  //         .collection("cart_items")
  //         .getFirstListItem(`of_user.id="${user_id}" && of_product.id="${p.id}"`);
  //       const data = await pb.collection("cart_items").update(record.id, {
  //         of_user: user_id,
  //         of_product: p.id,
  //         quantity: quant,
  //       });
  //       console.log({ data });
  //       // console.log( { e });
  //       // console.log("error")
  //     } finally {
  //       changeStatus();
  //     }
  //   };
  const { addItem } = useCartStore();
  const imageName = p.images[0];
  const url = imageName ? pb.files.getUrl(p, imageName, { thumb: "100x100" }) : null;

  return (
    <div
      key={p.id}
      className=" w-full sm:w-1/2 flex flex-row  p-2 pt-0 pb-2 mt-4 bg-base-100 border-b-2 "
    >
      <div className="flex flex-col">
        <figure className="w-full m-auto rounded  mt-1">
        {url ? (
          <img
            className="h-200 sm:h-100 rounded object-cover"
            src={url}
            alt={p.name}
          />
        ) : (
          <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="m 4 1 c -1.644531 0 -3 1.355469 -3 3 v 1 h 1 v -1 c 0 -1.109375 0.890625 -2 2 -2 h 1 v -1 z m 2 0 v 1 h 4 v -1 z m 5 0 v 1 h 1 c 1.109375 0 2 0.890625 2 2 v 1 h 1 v -1 c 0 -1.644531 -1.355469 -3 -3 -3 z m -5 4 c -0.550781 0 -1 0.449219 -1 1 s 0.449219 1 1 1 s 1 -0.449219 1 -1 s -0.449219 -1 -1 -1 z m -5 1 v 4 h 1 v -4 z m 13 0 v 4 h 1 v -4 z m -4.5 2 l -2 2 l -1.5 -1 l -2 2 v 0.5 c 0 0.5 0.5 0.5 0.5 0.5 h 7 s 0.472656 -0.035156 0.5 -0.5 v -1 z m -8.5 3 v 1 c 0 1.644531 1.355469 3 3 3 h 1 v -1 h -1 c -1.109375 0 -2 -0.890625 -2 -2 v -1 z m 13 0 v 1 c 0 1.109375 -0.890625 2 -2 2 h -1 v 1 h 1 c 1.644531 0 3 -1.355469 3 -3 v -1 z m -8 3 v 1 h 4 v -1 z m 0 0" fill="#2e3434" fill-opacity="0.34902"/>
      </svg>
        )}
        </figure>
        <div className="font-bold">
          <input
            disabled={immutableMode}
            type="number"
            onFocus={(e) => {
              e.target.select();
            }}
            className="input input-xs w-1/2 input-bordered"
            onChange={(e) => {
              const num = parseInt(e.target.value) ?? 0;
              addItem(p.id, {
                quantity: num,
                expand: {
                  of_product: p,
                },
              });
            }}
            value={quantity}
          />
        </div>
      </div>
      <div className="flex w-full flex-col">
        <h2 className="font-bold w-full overflow-x-hidden">{p.name}</h2>
        <div className="card-actions ">
          <p>Price / item : ₹ {p.amount_2}</p>
          {isNaN(quantity) ? <p></p> : <p>Total: ₹ {p.amount_2 * quantity}</p>}
        </div>
        <div>
          {immutableMode ? null : (
            <button
              onClick={onRemove}
              className="btn btn-circle btn-error btn-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
