import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useQuery, useMutation } from "react-query";
import { Link, useLocation } from "wouter";
import CartItem from "./components/CartItem";
import pb from "./pb";
import { useCartStore } from "./store";
import { IAddress, CartItem as ICartItem } from "./types";

const Cart = () => {
  const { statusCode, cart, deleteItem, clearCart } = useCartStore();
  const [showAddress, setShowAddress] = useState(false);
  const [total, setTotal] = useState(0);
  const { register, handleSubmit, reset } = useForm<IAddress>();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (cart) {
      const t = Object.entries(cart).reduce((sum, [_, t]) => {
        if (isNaN(t.quantity)) {
          return sum + 0;
        }
        return sum + t.quantity * t.expand.of_product.amount_2;
      }, 0);
      setTotal(Math.round(t));
    }
  }, [cart]);

  const { data: addressData, refetch: addressRefetch } = useQuery(
    ["address"],
    () => {
      return pb.collection("addresses").getFullList<IAddress>();
    }
  );

  const [addressID, setAddressID] = useState<string>();

  const addAddress = (add: IAddress) => {
    const id = pb.authStore?.model?.id;
    return pb.collection("addresses").create({ ...add, of_user: id });
  };

  const mutateNewAddress = useMutation({
    mutationFn: addAddress,
    onSuccess: async () => {
      await addressRefetch();
      reset();
      setShowAddress(false);
    },
  });

  const onSubmit: SubmitHandler<IAddress> = (data) => {
    console.log(data);
    mutateNewAddress.mutate(data);
  };

  const placeOrder = async () => {
    // create order
    const id = pb.authStore?.model?.id;
    const orderData = {
      order_status: "pending",
      order_amount: total,
      is_complete: false,
      of_user: id,
      at_address: addressID,
    };
    // add cart to order lines
    const orderRecord = await pb.collection("orders").create(orderData);

    const order_lines = Object.entries(cart).map(([_, d]) => ({
      of_order: orderRecord.id,
      of_product: d.expand.of_product.id,
      quantity: d.quantity,
    }));
    if (order_lines) {
      const zpromise = order_lines.map((o) => {
        return pb.collection("orderlines").create(o, { $autoCancel: false });
      });
      await Promise.all(zpromise);
      clearCart();
      setLocation("/confirmation");
    }

    // delete cart
  };

  const placeOrderMutation = useMutation({ mutationFn: placeOrder, onError: (err)=>{
    console.log({ err });
  } });

  if (!pb.authStore.isValid) {
    return <div className="p-2">Please login to view your cart</div>;
  }

  if (cart && Object.entries(cart).length < 1) {
    return (
      <div className="p-2">
        Your cart is empty{" "}
        <Link href="/" className="btn">
          Add items
        </Link>
      </div>
    );
  }

  if (placeOrderMutation.isSuccess) {
    return <div>Your Order has been placed</div>;
  }

  return (
    <div className="p-2">
      <h1 className="text-3xl font-extrabold">Your Cart</h1>

      <div className="flex flex-row flex-wrap gap-2">
        {Object.entries(cart).map(([idx, ct]) => (
          <CartItem
            key={ct.id}
            p={ct.expand.of_product}
            quantity={ct.quantity}
            onRemove={() => {
              deleteItem(idx);
            }}
          />
        ))}
      </div>
      <div className="w-full flex justify-between font-extrabold text-lg sm:w-1/2">
        Total: <span>₹ {total}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Choose address</h2>
        <button
          className="btn sm:w-48"
          onClick={() => {
            setShowAddress(!showAddress);
          }}
        >
          {showAddress ? "Close" : "Add a new  Address"}
        </button>
        {showAddress ? (
          <div>
            <h4>New Address</h4>
            <form
              className="flex flex-col w-full sm:w-1/2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <input
                placeholder="Name*"
                className="input input-bordered"
                {...register("name", { required: true })}
              />
              <input
                className="input input-bordered"
                placeholder="Address Line 1"
                {...register("addr_1", { required: true })}
              />
              <input
                className="input input-bordered"
                placeholder="Address Line 2"
                {...register("addr_2")}
              />
              <input
                className="input input-bordered"
                placeholder="Pincode*"
                {...(register("pincode"), { required: true })}
              />
              <input
                className="input input-bordered"
                placeholder="Mobile Number*"
                {...register("mobile", { required: true })}
              />
              <input
                className="input input-bordered"
                placeholder="GSTIN"
                {...register("gstin")}
              />
              <input className="btn btn-primary" type={"submit"} />
            </form>
          </div>
        ) : null}
        <form>
          {addressData?.map((ad) => {
            return (
              <div
                key={ad.id}
                className={`card p-2 hover:cursor-pointer ${
                  ad.id == addressID ? "border-2" : ""
                }`}
                onClick={() => {
                  setAddressID(ad.id);
                }}
              >
                <label htmlFor={ad.id}>{ad.name}</label>
                <p style={{ display: "flex", flexDirection: "column" }}>
                  <span>{ad.addr_1}</span>
                  <span>{ad.addr_2}</span>
                  <span>{ad.city}</span>
                  <span>{ad.pincode}</span>
                  <span>{ad.mobile}</span>
                  <span>{ad.gstin}</span>
                </p>
              </div>
            );
          })}
        </form>
      </div>

      <div className="flex flex-col w-full mt-2">
        <h2 className="text-3xl font-extrabold">Payment</h2>
        <p className="p-2">
          We acccept only cash on delivery or upi on delivery right now. When
          you place order, our team will contact you to confirm your order. View
          our terms and conditions here. On placing order you confirm to our
          terms and conditions.
        </p>
      </div>
      <button
        disabled={!addressID || total <= 0 || placeOrderMutation.isLoading}
        className="btn btn-primary w-full sm:w-1/3"
        onClick={() => {
          placeOrderMutation.mutate();
        }}
      >
        {placeOrderMutation.isLoading ? (
          <div className="loading"></div>
        ) : (
          <div></div>
        )}
        {addressID && total > 0
          ? `Place order: ₹${total}`
          : "Complete steps above"}
      </button>
    </div>
  );
};

export default Cart;
