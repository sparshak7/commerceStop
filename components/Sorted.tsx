"use client";

import { Link } from "next-view-transitions";
import { usePathname, useSearchParams } from "next/navigation";

const Sorted = ({ text }: { text: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageURL = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    return `${pathname}?${params.toString()}`;
  };

  // const createQueryString = useCallback(
  //   (order: string) => {
  //     if (params.get("order") === "asc") {
  //       params.set("order", "desc");
  //     } else {
  //       params.set("order", "asc");
  //     }

  //     return params.toString();
  //   },
  //   [searchParams, currOrder]
  // );

  return (
    <Link href={createPageURL(text === "Price descending" ? "desc" : "asc")}>
      <p>{`${text} ${text === "Latest first" ? "(default)" : ""}`}</p>
    </Link>
  );
};
export default Sorted;
