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
      className="flex w-full sm:w-64 overflow-hidden border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md bg-white sm:flex-col p-3 sm:p-4  sm:mb-6"
    >
      <div className="w-1/3 sm:w-full h-full m-auto rounded overflow-hidden">
        {url ? (
          <img
            className="h-24 sm:h-40 w-full object-cover transition-transform duration-300 hover:scale-105"
            src={url}
            alt={p.name}
          />
        ) : (
          <img
            className="h-24 sm:h-40 w-full object-cover transition-transform duration-300 hover:scale-105"
            src={'/product.png'}
            alt={p.name}
          />
        )}
      </div>
      <div className="flex w-2/3 sm:w-full flex-col gap-2 sm:gap-3 ml-3 sm:ml-0 sm:mt-3">
        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 text-gray-800">
          {p.name}
        </h3>
        <div className="mt-auto">
          {pb.authStore.isValid ? (
            <div>
              <div className="text-xs sm:text-sm text-gray-500">MRP: <span className="line-through">₹{p.amount_1}</span></div>
              <div className="text-sm sm:text-base font-medium text-gray-900">Price: ₹{p.amount_2}</div>

              <form className="flex w-full gap-2 mt-2" onSubmit={handleSave}>
                <input
                  required
                  className="input input-sm input-bordered w-1/2 focus:ring-2 focus:ring-primary"
                  value={quant}
                  disabled={addCartMutation.isLoading}
                  onChange={(e) => {
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
                  className="btn btn-sm btn-primary rounded-md text-white hover:opacity-90 transition-opacity duration-300"
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
            <div className="text-sm text-gray-600">
              To view prices and add to cart, please
              <Link className="link link-primary ml-1 font-medium" href="/login">
                login
              </Link>
            </div>
          )}
        </div>
        <div>
          {cart[p.id] ? (
            <div className="badge badge-primary badge-sm p-2 text-xs">
              {`${cart[p.id].quantity} in cart`}
            </div>
          ) : (
            <div className="h-6"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
