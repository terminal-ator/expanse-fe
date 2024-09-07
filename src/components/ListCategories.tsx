import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { categoryAtom } from "../atom";
import pb from "../pb";
import { Category } from "../types";
import { Link, useLocation, useRoute } from "wouter";

const ListCategories = () => {

  const [ location, setLocation ]= useLocation();
  const [_, params ] = useRoute("/category/:id/:name")
  const [ showAll, setShowAll] = useState(false);
  const { data, isLoading } = useQuery("categories", () =>
    pb.collection("categories").getFullList<Category>({ sort: "name" })
  );
 
  useEffect(() => {
    // if (data) setCategory(data[0]);
  }, [data]);

  if (isLoading) {
    return <div className="loading"></div>;
  }

  return (
    <div className="sticky top-12 left-0 z-20 bg-white pt-4 p-2 border-b border-gray-200">
      <div className={`top-2 flex flex-row flex sm:flex-wrap gap-2 w-full overflow-x-scroll p-2  bg-white ${showAll ? "flex-wrap" : ""}`}> 
        {data?.map((c) => (
          <Link href={`/category/${c.id}/${c.name}`} >
          <button
            key={c.id}
            id={c.id}
            className={`btn btn-sm  rounded-3xl ${
              params?.id && params?.id === c.id
                ? " btn-neutral"
                : "btn-outline"
            } `}
           
          >
            {c.name.toUpperCase()}
          </button>
          </Link>
        ))}
      </div>
      
      <button className="btn btn-sm mt-2" onClick={() => setShowAll(!showAll)}>{showAll ? "Show Less" : "View All Categories"}</button>
    </div>
  );
};

export default ListCategories;
