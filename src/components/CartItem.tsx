import { FC } from "react";
import pb from "../pb";
import { Product } from "../types";
import { useCartStore } from "../store";

interface ICartItem {
  p: Product;
  quantity: number;
  onRemove: () => void;
}
const CartItem: FC<ICartItem> = ({ p, quantity, onRemove }) => {
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
  const url = pb.files.getUrl(p, imageName, { thumb: "100x100" });

  return (
    <div
      key={p.id}
      className=" w-full sm:w-1/2 flex flex-row  p-2 pt-0 pb-2 mt-4 bg-base-100 border-b-2 "
    >
      <div className="flex flex-col">
        <figure className="w-full m-auto rounded  mt-1">
          <img
            className="h-100 rounded object-cover"
            src={url}
            alt={"Image lost"}
          />
        </figure>
        <div className="font-bold">
          <input
            type="number"
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
          <p>Total: ₹ {p.amount_2 * quantity}</p>
        </div>
        <div>
          <button
            onClick={onRemove}
            className="btn btn-circle btn-error btn-sm "
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
        </div>
      </div>
    </div>
  );
};

export default CartItem;
