import { useEffect } from "react";
import { useQueryClient } from "react-query";
import { useLocation } from "wouter";
import ListOrders from "./components/ListOrders";
import pb from "./pb";

function ProfilePage() {
  const qc = useQueryClient();
  const [_, setlocation] = useLocation();

  useEffect(() => {
    pb.authStore.onChange((tk) => {
      if (!tk) {
        setlocation("/login");
      }
    });
  });

  const onlogout = () => {
    pb.authStore.clear();
    qc.removeQueries();
  };
  return (
    <div className="container p-2">
      <div className="flex w-full sm:w-1/2 justify-between">
        <h1>Hi, {pb.authStore?.model?.username}</h1>
        <button
          className="btn btn-error text-white rounded-3xl"
          onClick={onlogout}
        >
          Logout
        </button>
      </div>
      <ListOrders />
    </div>
  );
}

export default ProfilePage;
