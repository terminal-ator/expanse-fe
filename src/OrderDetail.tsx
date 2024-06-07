import React from "react";
import { useQueries, useQuery } from "react-query";
import { useParams } from "wouter";
import pb from "./pb";
import { CartItem as ICartItem } from "./types";
import CartItem from "./components/CartItem";

const OrderDetail = () => {
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

  if (results[0].isLoading || results[1].isLoading) {
    return (
      <div className="p-2">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h1>Viewing order: {params.id}</h1>
      <div className="flex flex-row justify-between">
        <div className="badge badge-primary">
          {results[0]?.data?.order_status}
        </div>
        <div>
          {results[0]?.data?.order_status === "pending" ? (
            <div>
              <button
                onClick={() => {
                  confirm("Do you really want to cancel this order?");
                }}
                className="btn btn-error text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              Order has been fulfilled, call <a>7982255302</a> for queries
            </div>
          )}
        </div>
      </div>
      <div className="font-bold">Items</div>
      {results[1].data?.map((x) => (
        <CartItem
          onRemove={() => {}}
          immutableMode={true}
          key={x.id}
          p={x.expand.of_product}
          quantity={x.quantity}
        />
      ))}
    </div>
  );
};

export default OrderDetail;
