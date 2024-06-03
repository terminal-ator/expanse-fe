import { FC, useState, FormEvent } from "react";
import { useMutation } from "react-query";
import { Link } from "wouter";
import pb from "../pb";
import { useCartStore } from "../store";
import { CartItem, Product } from "../types";

interface IProductItem {
  p: Product;
}
const ProductItem: FC<IProductItem> = ({ p }) => {
  const [quant, setQuant] = useState(1); // get state from store;
  const { changeStatus } = useCartStore();
  const addItem = useCartStore((s) => s.addItem);

  const addToCart = async () => {
    const user_id: string = pb.authStore.model?.id;
    const item: CartItem = {
      quantity: quant,
      expand: {
        of_product: p,
      },
    };
    addItem(p.id, item);
    try {
      const data = await pb
        .collection("cart_items")
        .create({ of_user: user_id, of_product: p.id, quantity: quant });
      console.log({ data });
    } catch (e) {
      const record = await pb
        .collection("cart_items")
        .getFirstListItem(`of_user.id="${user_id}" && of_product.id="${p.id}"`);
      const data = await pb.collection("cart_items").update(record.id, {
        of_user: user_id,
        of_product: p.id,
        quantity: quant,
      });
      console.log({ data });

      // console.log( { e });
      // console.log("error")
    } finally {
      changeStatus();
    }
  };

  const addCartMutation = useMutation({ mutationFn: addToCart });

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    addCartMutation.mutate();
  };

  const imageName = p.images[0];
  const url = pb.files.getUrl(p, imageName, { thumb: "200x200" });

  return (
    <div
      key={p.id}
      className="flex w-full sm:min-w-32  border-b-2 sm:border-none sm:min-h-52 sm:flex-col align-middle p-2 pt-0 pb-2 mt-4 bg-base-100 sm:w-48 overflow-x-hidden"
    >
      <figure className="w-full m-auto rounded  mt-1">
        <img
          className="h-200 sm:h-100 rounded object-cover"
          src={url}
          alt={"Image lost"}
        />
      </figure>
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
                  className="input input-sm  input-bordered w-1/2"
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
                  className="btn btn-sm rounded-3xl"
                  value="Add"
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
      </div>
    </div>
  );
};

export default ProductItem;
