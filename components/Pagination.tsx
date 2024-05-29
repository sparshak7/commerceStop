"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const Pagination = ({ total }: { total: number }) => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const pathname = usePathname();
  
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };


  return (
    <div className="flex justify-center items-center gap-8 mt-4">
      <Button size="icon" asChild variant="outline">
        <Link
          href={createPageURL(currentPage - 1)}
          className={
            currentPage - 1 === 0 ? `pointer-events-none opacity-50` : ""
          }
        >
          -
        </Link>
      </Button>
      <p className="text-secondary-foreground">{currentPage}/{total}</p>
      <Button size="icon" asChild variant="outline">
        <Link
          href={createPageURL(currentPage + 1)}
          className={
            currentPage >= total ? `pointer-events-none opacity-50` : ""
          }
        >
          +
        </Link>
      </Button>
    </div>
  );
};
export default Pagination;
