import { useAtomValue } from "jotai";

import { useQuery } from "react-query";

import pb from "./pb";
import { Product } from "./types";
import ProductItem from "./components/ProductItem";
import { Redirect, useRoute } from "wouter";
import ListCategories from "./components/ListCategories";

const FeaturedProducts = () => {
 
  return (
    <Redirect href="/app" />
  );
};

export default FeaturedProducts;
