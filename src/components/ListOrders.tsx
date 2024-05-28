import { useQuery } from "react-query";
import pb from "../pb";
import { IOrder } from "../types";

const ListOrders = () => {
  const { data: orders } = useQuery("orders", () =>
    pb.collection("orders").getFullList<IOrder>({ sort: "-id" })
  );
  return (
    <div className="container">
      <h2 className="font-extrabold">Your Orders</h2>
      {orders
        ? orders.map((o) => (
            <div className="card ">
              <div>
                <p>Order ID: {o.id}</p>
                <p>Status: {o.order_status}</p>
                <p>Ordered: {o.created_at}</p>
              </div>
            </div>
          ))
        : "You have no orders"}
    </div>
  );
};

export default ListOrders;
