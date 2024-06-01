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
      url: "https://jpgn.in",
      text: "Buy every product at wholesale prices.",
    });
  };

  return (
    <div className="p-2 ">
      <h3 className="text-lg ">
        Every Product at wholesale price. Next day delivery*
        <button
          className="btn"
          onClick={() => {
            share();
          }}
        >
          share with friends
        </button>
      </h3>

      <ListCategories />
      <ListProducts />
    </div>
  );
}

export default Home;
