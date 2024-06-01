import { useAtomValue } from "jotai";

import { useQuery } from "react-query";
import { categoryAtom } from "../atom";
import pb from "../pb";
import { Product } from "../types";
import ProductItem from "./ProductItem";

const ListProducts = () => {
  const selectedcategory = useAtomValue(categoryAtom);

  const fetchProductsOfCategory = () => {
    return pb.collection("products").getFullList<Product>({
      filter: `category.id?="${selectedcategory?.id}"`,
    });
  };

  const { data, error, isLoading } = useQuery(
    ["products", selectedcategory],
    fetchProductsOfCategory
  );

  if (error) return <h2>Choose a category</h2>;
  if (isLoading)
    return (
      <div className="w-full h-full">
        <div className="relative loading top-8 left-8 "></div>
      </div>
    );

  return (
    <div className="flex flex-col p-2">
      <h1 className=" font-bold text-2xl">{selectedcategory?.name}</h1>
      <div className="flex flex-row flex-1  sm:justify-start  flex-wrap gap-2 overflow-y-scroll">
        {data
          ? data.map((p) => <ProductItem key={p.id} p={p} />)
          : "Choose a category"}
        {data && data?.length < 1 ? (
          <h2>Choose a category to get started</h2>
        ) : null}
      </div>
    </div>
  );
};

export default ListProducts;
