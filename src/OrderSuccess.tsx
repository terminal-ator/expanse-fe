import React from "react";
import { Link } from "wouter";

const OrderStatusPage = () => {
  return (
    <div className="container p-2">
      <h1>Your Order is placed</h1>
      <Link href="/" className="btn ">
        New Order
      </Link>
    </div>
  );
};

export default OrderStatusPage;
