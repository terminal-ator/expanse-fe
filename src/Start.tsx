import React, { FormEvent, useState } from "react";
import { z } from "zod";
import { usePincodeStore } from "./store";
import pb from "./pb";

const StartPage = () => {
  const [pincode, setTempPincode] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { setPincode } = usePincodeStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    if (pincode) {
      const validPincode = z
        .string()
        .length(6)
        .refine((val) => /^[0-9]+$/.test(val));
      const res = validPincode.safeParse(pincode);
      if (res.success) {
        // get pincode data
        const data = await pb
          .collection("pincodes")
          .getFullList({ filter: `pincode = '${pincode}'` });
        if (data.length < 1) {
          alert("We dont service your area");
          setLoading(false);
          return;
        }
        setPincode(pincode);
      } else {
        alert("Enter correct pincode");
      }
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="w-full flex flex-col gap-2 sm:w-max m-auto relative top-24 text-center">
        <h1 className="text-6xl font-extrabold">Good Deals, Everyday.</h1>
        <h2 className="font-bold text-2xl ">
          Buy products at wholesale prices
        </h2>
        <div>Enter your pincode to get started</div>
        <div>
          <form
            className="p-2 justify-center flex gap-2"
            onSubmit={handleSubmit}
          >
            <input
              onChange={(e) => {
                setTempPincode(e.target.value);
              }}
              type="text"
              className="input input-bordered w-full max-w-xs"
              placeholder="Enter 6 digit pincode"
            />
            <button disabled={loading} type="submit" className="btn">
              {loading ? <div className="loading" /> : null}
              Continue
            </button>
          </form>
        </div>
        <div>
          <p className="text-red-500">{err}</p>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
