import { FC, useState, FormEvent } from "react";
import { useMutation } from "react-query";
import { Link } from "wouter";
import pb from "../pb";
import { useCartStore } from "../store";
import { CartItem, Product } from "../types";
import posthog from "posthog-js";
 // Assume this utility function exists
 function getRandomGradient(): string {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const color1 = colors[Math.floor(Math.random() * colors.length)];
  const color2 = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(45deg, ${color1}, ${color2})`;
}

interface IProductItem {
  p: Product;
}
const ProductItem: FC<IProductItem> = ({ p }) => {
  const [quant, setQuant] = useState(1); // get state from store;
  const [added, setAdded] = useState(false);
  // const { changeStatus } = useCartStore();
  const addItem = useCartStore((s) => s.addItem);
  const cart = useCartStore((s) => s.cart);

  const addToCart = async () => {
    // const user_id: string = pb.authStore.model?.id;
    const item: CartItem = {
      id: crypto.randomUUID().toString(),
      quantity: quant,
      expand: {
        of_product: p,
      },
    };
    addItem(p.id, item);
    posthog.capture("product added", { p, quant });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1000);

    // try {
    //   const data = await pb
    //     .collection("cart_items")
    //     .create({ of_user: user_id, of_product: p.id, quantity: quant });
    //   console.log({ data });
    // } catch (e) {
    //   const record = await pb
    //     .collection("cart_items")
    //     .getFirstListItem(`of_user.id="${user_id}" && of_product.id="${p.id}"`);
    //   const data = await pb.collection("cart_items").update(record.id, {
    //     of_user: user_id,
    //     of_product: p.id,
    //     quantity: quant,
    //   });
    //   console.log({ data });

    //   // console.log( { e });
    //   // console.log("error")
    // } finally {
    //   changeStatus();
    // }
  };

  const addCartMutation = useMutation({ mutationFn: addToCart });

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (quant < 1) return;
    addCartMutation.mutate();
  };

  const imageName = p.images[0];
  const url = imageName ? pb.files.getUrl(p, imageName, { thumb: "200x200" }) : null;

  return (
    <div
      key={p.id}
      className="flex w-full sm:min-w-32  border-b-2 sm:border-none sm:min-h-52 sm:flex-col align-middle p-2 pt-0 pb-2 mt-4 bg-base-100 sm:w-48 overflow-x-hidden"
    >
      <div className="w-full h-full m-auto rounded mt-1 p-2">
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
      </div>
      <div className="flex w-full flex-col gap-2">
        <span className="font-bold min-h-11  w-full overflow-x-hidden">
          {p.name}
        </span>
        <div className=" mt-2 justify-start">
          {pb.authStore.isValid ? (
            <div>
              <div className="">Mrp: ₹ {p.amount_1}</div>
              <div className="">Price: ₹ {p.amount_2}</div>

              <form className="flex w-full   gap-4" onSubmit={handleSave}>
                <input
                  required
                  className="input input-sm  input-bordered w-1/2"
                  value={quant}
                  disabled={addCartMutation.isLoading}
                  onChange={(e) => {
                    // if(e.target.value == "") return;
                    // if (e.target.value == "") {
                    //   setQuant(0);
                    //   return;
                    // }
                    setQuant(parseInt(e.target.value));
                  }}
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  placeholder="quantity"
                  type="number"
                />
                <button
                  disabled={addCartMutation.isLoading}
                  type={"submit"}
                  className="btn btn-sm rounded-3xl"
                  value={"add"}
                >
                  {addCartMutation.isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Add"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div>
              To view prices and add to cart, please
              <Link className={"link ml-1"} href="/login">
                login
              </Link>
            </div>
          )}
        </div>
        <div>
          {cart[p.id] ? (
            <div className="badge badge-primary p-2">
              {" "}
              {`${cart[p.id].quantity} in cart`}{" "}
            </div>
          ) : (
            <div className="badge p-2 invisible"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
