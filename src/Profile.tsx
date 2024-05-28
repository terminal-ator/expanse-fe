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
    <div className="container">
      <h1>Profile</h1>
      <button className="btn btn-error" onClick={onlogout}>
        Logout
      </button>
      <ListOrders />
    </div>
  );
}

export default ProfilePage;
