import React from "react";
import { Link } from "wouter";

const OrderStatusPage = () => {
  return (
    <div className="container p-4">
      <h1>
        Congrats, we have received your order. View your profile to see updates.
        Our team might contact you for further details
      </h1>
      <Link href="/" className="btn ">
        Need more product? Create another order!
      </Link>
    </div>
  );
};

export default OrderStatusPage;
