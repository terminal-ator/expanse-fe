import { useEffect, useState } from "react";

import "./App.css";
import pb from "./pb";

import ListCategories from "./components/ListCategories";
import ListProducts from "./components/ListProducts";

function Home() {
  const [, setUser] = useState("");

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

  const share = () => {
    navigator.share({
      url: window.location.href,
      text: "Buy every product at wholesale prices.",
    });
  };

  return (
    <div className="p-2 ">
      <h3 className="text-lg ">
        Buy products at wholesale rate.
        <button
          className="link ml-2"
          onClick={() => {
            share();
          }}
        >
          Share with friends
        </button>
      </h3>

      <ListCategories />
      <ListProducts />
    </div>
  );
}

export default Home;
