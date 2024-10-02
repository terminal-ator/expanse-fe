import { FC, useState, FormEvent } from "react";
import { useMutation } from "react-query";
import { Link } from "wouter";
import pb from "../pb";
import { useCartStore } from "../store";
import { CartItem, Product } from "../types";
import posthog from "posthog-js";
// Assume this utility function exists
function getRandomGradient(): string {
  const colors = [
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
  ];
  const color1 = colors[Math.floor(Math.random() * colors.length)];
  const color2 = colors[Math.floor(Math.random() * colors.length)];
  return `linear-gradient(45deg, ${color1}, ${color2})`;
}

interface IProductItem {
  p: Product;
}
const ProductItem: FC<IProductItem> = ({ p }) => {
  const [quant, setQuant] = useState(p.recommended == 0 ? 1 : p.recommended); // get state from store;
  const [added, setAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const { changeStatus } = useCartStore();
  const addItem = useCartStore((s) => s.addItem);
  const cart = useCartStore((s) => s.cart);
  const removeItem = useCartStore((s) => s.deleteItem);

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
  const url = imageName
    ? pb.files.getUrl(p, imageName, { thumb: "200x200" })
    : null;

  // Calculate the amount saved
  const amountSaved = Math.round(p.amount_1 - p.amount_2);
  // const percentSaved = Math.round((amountSaved / p.amount_1) * 100);

  const removeFromCart = async () => {
    removeItem(p.id);
    posthog.capture("product removed", { p });
  };

  const removeCartMutation = useMutation({ mutationFn: removeFromCart });

  return (
    <>
      <div
        key={p.id}
        className="flex w-full sm:w-64 overflow-hidden border border-gray-200 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md bg-white sm:flex-col p-3 sm:p-4 sm:mb-6 cursor-pointer"
      >
        <div
          onClick={() => setShowModal(true)}
          className="w-1/3 sm:w-full h-full m-auto rounded overflow-hidden relative"
        >
          {url ? (
            <img
              className="h-24 sm:h-40 w-full object-cover transition-transform duration-300 hover:scale-105"
              src={url}
              alt={p.name}
            />
          ) : (
            <img
              className="h-24 sm:h-40 w-full object-cover transition-transform duration-300 hover:scale-105"
              src={"/product.png"}
              alt={p.name}
            />
          )}
          {cart[p.id] && (
            <div className="absolute top-0 right-0 bg-primary text-white p-1 rounded-bl-md text-xs">
              {`${cart[p.id].quantity} in cart`}
            </div>
          )}
        </div>
        <div className="flex w-2/3 sm:w-full flex-col gap-2 sm:gap-3 ml-3 sm:ml-0 sm:mt-3">
          <h3
            onClick={() => setShowModal(true)}
            className="font-semibold text-sm sm:text-base truncate text-gray-800"
            title={p.name}
          >
            {p.name}
          </h3>
          <div className="mt-auto">
            {pb.authStore.isValid ? (
              <div>
                <div className="text-xs sm:text-sm text-gray-500">
                  MRP: <span className="line-through">₹{p.amount_1}</span>
                </div>
                <div className="text-sm sm:text-base font-medium text-gray-900">
                  Price: ₹{p.amount_2}{" "}
                  {amountSaved > 0 && pb.authStore.isValid && (
                    <div className="relative bottom-0 left-0  w-1/2 bg-green-600 text-white p-1 text-xs text-center">
                      Save ₹{amountSaved}
                    </div>
                  )}
                </div>

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
                <span className=" ml-1 font-medium">login</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{p.name}</h2>
            <div className="relative">
              <img
                src={url || "/product.png"}
                alt={p.name}
                className="w-full h-64 object-cover mb-4 rounded"
              />
              {cart[p.id] && (
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm">
                  {cart[p.id].quantity} in cart
                </div>
              )}
            </div>
            <p className="text-gray-700 mb-4">{p.description}</p>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-lg font-semibold">₹{p.amount_2}</p>
                {pb.authStore.isValid
                  ? amountSaved > 0 && (
                      <p className="text-sm text-green-600">
                        Save ₹{amountSaved}
                      </p>
                    )
                  : null}
              </div>
              {pb.authStore.isValid && (
                <form className="flex gap-2" onSubmit={handleSave}>
                  <input
                    type="number"
                    value={quant}
                    onChange={(e) => setQuant(parseInt(e.target.value))}
                    className="input input-sm input-bordered w-20"
                    min="1"
                  />
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    disabled={addCartMutation.isLoading}
                  >
                    {addCartMutation.isLoading ? "Adding..." : "Add to Cart"}
                  </button>
                </form>
              )}
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-sm btn-outline w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductItem;
