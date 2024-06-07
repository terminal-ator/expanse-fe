import { useQuery } from "react-query";
import pb from "../pb";
import { IOrder } from "../types";
import { Link } from "wouter";

const ListOrders = () => {
  const { data: orders, isLoading } = useQuery("orders", () =>
    pb.collection("orders").getFullList<IOrder>({
      sort: "-created",
      expand: "at_address, of_user, orderlines_via_of_order",
    })
  );

  // console.log({ orders });

  if (isLoading) {
    return (
      <div className="pt-2">
        <div className="loading"></div>
      </div>
    );
  }
  return (
    <div className="container">
      <h2 className="font-extrabold">Your Orders</h2>
      {orders
        ? orders.map((o) => (
            <Link key={o.id} href={`/order/${o.id}`}>
              <div className="card my-2 rounded-xl bordered p-2">
                <div>
                  <p className="badge badge-primary">{o.id}</p>
                  <p className="badge ">{o.order_status}</p>
                  <p>Ordered: {o.created}</p>
                </div>
              </div>
            </Link>
          ))
        : "You have no orders"}
    </div>
  );
};

export default ListOrders;
