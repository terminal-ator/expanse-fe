import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { categoryAtom } from "../atom";
import pb from "../pb";
import { Category } from "../types";

const ListCategories = () => {
  const setCategory = useSetAtom(categoryAtom);
  const getCategory = useAtomValue(categoryAtom);
  const { data, isLoading } = useQuery("categories", () =>
    pb.collection("categories").getFullList<Category>({ sort: "name" })
  );
  const selectCategory = (c: Category) => {
    setCategory(c);
  };

  useEffect(() => {
    // if (data) setCategory(data[0]);
  }, [data]);

  if (isLoading) {
    return <div className="loading"></div>;
  }

  return (
    <div className="sticky top-12 left-0 z-20 bg-white">
      <div className=" mt-2 flex flex-row gap-2 w-full overflow-x-scroll p-2 ">
        {getCategory ? (
          <button
            onClick={() => {
              setCategory(null);
            }}
            className="btn btn-sm btn-error rounded-3xl"
          >
            Clear
          </button>
        ) : null}
        {data?.map((c) => (
          <button
            key={c.id}
            id={c.id}
            className={`btn btn-sm  rounded-3xl ${
              getCategory && getCategory.id === c.id
                ? " btn-primary"
                : "btn-outline"
            } `}
            onClick={() => {
              selectCategory(c);
            }}
          >
            {c.name.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ListCategories;
