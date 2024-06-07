import React from "react";
import { useQuery } from "react-query";
import { useParams } from "wouter";
import pb from "./pb";
import { CartItem as ICartItem } from "./types";
import CartItem from "./components/CartItem";

const OrderDetail = () => {
  const params = useParams();

  const { data: order, isLoading: orderLoading } = useQuery([params.id], () =>
    pb.collection("order").getOne(params.id!)
  );

  const { data: lines, isLoading } = useQuery([params.id], () =>
    pb.collection("orderlines").getFullList<ICartItem>({
      filter: `of_order = '${params.id}'`,
      expand: "of_product",
    })
  );

  if (isLoading || orderLoading) {
    return (
      <div className="p-2">
        <div className="loading"></div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h1>Viewing order: {params.id}</h1>
      <div className="badge ">{order?.status}</div>
      {lines?.map((x) => (
        <CartItem
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
