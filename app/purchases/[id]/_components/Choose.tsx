"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const Choose = ({currOrder}: {currOrder: string}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams.toString());

  const createQueryString = useCallback(
    (order: string) => {
      if (params.get("order") === null) {
        params.set("order", "desc");
      } else {
        params.set("order", order);
      }

      return params.toString();
    },
    [searchParams, currOrder]
  );

  return (
    <div className="flex gap-2 items-center">
      <p className="cursor-pointer" onClick={() => router.push(pathname + "&" + createQueryString("asc"))}>
        ASC
      </p>
      <p className="cursor-pointer" onClick={() => router.push(pathname + "&" + createQueryString("desc"))}>
        DESC
      </p>
    </div>
  );
};
export default Choose;
