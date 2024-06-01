import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "wouter";
import pb from "../pb";
import { useCartStore } from "../store";
import { CartItem } from "../types";

function NavBar() {
  const [user, setUser] = useState("");
  const { statusCode } = useCartStore();
  const [count, setCount] = useState(0);
  const { data: cartData } = useQuery(["cart", statusCode], () => {
    return pb
      .collection("cart_items")
      .getFullList<CartItem>({ expand: "of_product" });
  });

  useEffect(() => {
    pb.authStore.onChange((us) => {
      setUser(us);
    });
  }, []);

  useEffect(() => {
    if (pb.authStore.isValid) {
      setUser("sadas");
    }
  }, []);

  useEffect(() => {
    if (cartData) {
      let c = cartData.length;
      setCount(c);
    }
  }, [cartData]);

  return (
    <nav className="shadow-md p-2  flex justify-between items-center  w-full sm:m-auto navbar-start">
      <Link className="text-4xl font-extrabold text-red-500" href="/">
        Good Deal
      </Link>
      <div className="flex flex-row gap-4 justify-center h-full ">
        {user == "" ? (
          <Link className="btn rounded-3xl" href="/login">
            Login
          </Link>
        ) : (
          <Link className="btn rounded-3xl" href="/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
          </Link>
        )}
        <Link
          className="btn flex flex-row  bg-red-600 text-white rounded-3xl justify-between"
          href="/cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          <span>{count}</span>
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
