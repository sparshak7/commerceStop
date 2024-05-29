"use client";

import { Link } from "next-view-transitions";
import { usePathname, useSearchParams } from "next/navigation";

const Order = ({ text }: { text: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageURL = (order: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("order", order);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Link href={createPageURL(text === "Latest first" ? "desc" : "asc")}>
      <p>
        {`${text} ${text === "Latest first" ? "(default)" : ""}`}
      </p>
    </Link>
  );
};
export default Order;
