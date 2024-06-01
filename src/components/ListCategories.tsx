import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { categoryAtom } from "../atom";
import pb from "../pb";
import { Category } from "../types";

const ListCategories = () => {
  const setCategory = useSetAtom(categoryAtom);
  const { data } = useQuery("categories", () =>
    pb.collection("categories").getFullList<Category>({ sort: "name" })
  );
  const selectCategory = (c: Category) => {
    setCategory(c);
  };

  useEffect(() => {
    if (data) setCategory(data[0]);
  }, []);

  return (
    <div className="sticky top-11 left-0 z-20 glass">
      <div className=" mt-2 flex flex-row gap-2 w-full overflow-x-scroll p-2 ">
        {data?.map((c) => (
          <button
            key={c.id}
            id={c.id}
            className="btn btn-sm btn-outline rounded-3xl"
            onClick={() => {
              selectCategory(c);
            }}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListCategories;
