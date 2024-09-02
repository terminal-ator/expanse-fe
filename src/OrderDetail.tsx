import React from "react";
import { useMutation, useQueries, useQuery } from "react-query";
import { useLocation, useParams } from "wouter";
import pb from "./pb";
import { CartItem as ICartItem } from "./types";
import CartItem from "./components/CartItem";

const OrderDetail = () => {
  const [_, setLocation] = useLocation();
  const params = useParams();

  const results = useQueries([
    {
      queryKey: ["orders", params.id],
      queryFn: () => pb.collection("orders").getOne(params.id!),
    },
    {
      queryKey: ["lines", params.id],
      queryFn: () =>
        pb.collection("orderlines").getFullList<ICartItem>({
          filter: `of_order = '${params.id}'`,
          expand: "of_product",
        }),
    },
  ]);

  const cancelOrderMutation = useMutation({
    mutationFn: () => {
      return pb
        .collection("orders")
        .update(params.id!, { order_status: "cancelled" });
    },
    onSuccess: () => {
      setLocation("/profile");
    },
  });

  if (results[0].isLoading || results[1].isLoading) {
    return (
      <div className="p-2">
        <div className="loading"></div>
      </div>
    );
  }

  console.log(results);

  return (
    <div className="p-2">
      <h1>Viewing order: {params.id}</h1>
      <div className="flex flex-row justify-between">
        <div className="badge badge-primary">
          {results[0]?.data?.order_status}
        </div>
        <div>Order Amount: ₹ {results[0]?.data?.order_amount}</div>
        <div>
          {results[0]?.data?.order_status === "pending" ? (
            <div>
              <button
                disabled={cancelOrderMutation.isLoading}
                onClick={() => {
                  const res = confirm(
                    "Do you really want to cancel this order?"
                  );
                  if (res) {
                    cancelOrderMutation.mutate();
                  }
                }}
                className="btn btn-error text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <a className="link" href="mailto:itushargarg@gmail.com">
                Contact us
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="font-bold">Items</div>
      {results[1]?.data?.map((x) => {
        if (!x) return null;
        console.log({ x });
        if (!x?.expand?.of_product) return null;
        return (
          <CartItem
            onRemove={() => {}}
            immutableMode={true}
            key={x.id}
            p={x?.expand?.of_product}
            quantity={x.quantity}
          />
        );
      })}
    </div>
  );
};

export default OrderDetail;
