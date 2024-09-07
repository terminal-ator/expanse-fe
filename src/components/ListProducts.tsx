import { useAtomValue } from "jotai";

import { useQuery } from "react-query";
import { categoryAtom } from "../atom";
import pb from "../pb";
import { Product } from "../types";
import ProductItem from "./ProductItem";
import { useRoute } from "wouter";

const ListProducts = () => {
  const [_, params ] = useRoute("/category/:id/:name")
 
  const fetchProductsOfCategory = async () => {
    console.log({params})
    if (params?.id) {
      return await pb.collection("products").getFullList<Product>({
        filter: `category.id?="${params?.id}"`,
        sort: "name",
      });
    } else {
      console.log({ " no params found": "wow"})
      const prods = await pb.collection("products").getList<Product>(1, 30, {
        filter: "featured = true",
        sort: "name",
      });
      return prods.items;
    }
  };

  const { data, error, isLoading } = useQuery(
    ["products", params?.id],
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
    <div className="flex flex-col pt-8">
      <h1 className=" font-bold text-2xl">
        {params?.name ? params?.name?.toUpperCase() : "Featured"}
      </h1>
      <div className="flex flex-row  w-full flex-wrap gap-2  overflow-x-scroll sm:overflow-x-hidden">
        {data ? (
          data.map((p) => <ProductItem key={p.id} p={p} />)
        ) : (
          <div className="loading"></div>
        )}
        {data && data?.length < 1 ? (
          <h2>Choose a category to get started</h2>
        ) : null}
      </div>
    </div>
  );
};

export default ListProducts;
