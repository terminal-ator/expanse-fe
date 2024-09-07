import { useQuery } from "react-query";
import pb from "../pb";
import { IOrder } from "../types";
import { Link } from "wouter";
import SmallOrderImage from "./SmallOrderImage";

const ListOrders = () => {
  const { data: orders, isLoading } = useQuery("orders", () =>
    pb.collection("orders").getFullList<IOrder>({
      sort: "-created",
      expand: "at_address, of_user, orderlines_via_of_order.of_product,",
    })
  );

  console.log({ orders });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-extrabold mb-6">Your Orders</h2>
      {orders && orders.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((o) => (
            <Link key={o.id} href={`/order/${o.id}`}>
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge badge-primary">{o.id}</span>
                    <span className="badge badge-outline">{o.order_status}</span>
                  </div>
                  <p className="text-sm text-gray-500">Ordered: {new Date(o.created).toLocaleString()}</p>
                  <ul className="list-none p-0 flex flex-row w-full overflow-x-scroll">
                    {o.expand?.orderlines_via_of_order?.map((ol) => (
                      <li key={ol.id}>
                        <SmallOrderImage product={ol.expand?.of_product} />
                      </li>
                    ))}
                  </ul>
                  <p className="text-lg font-semibold mt-2">Amount: ₹{o.order_amount.toFixed(2)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">You have no orders</div>
      )}
    </div>
  );
};

export default ListOrders;
