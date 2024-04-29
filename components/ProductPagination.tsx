"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
};

const ProductPagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
}: PaginationProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    if (pageNumber) {
      params.set("page", pageNumber.toString());
    }
    return `${pathname}?${params.toString()}`;
  };

  const renderPaginationLinks = () => {
    const paginationLinks = [];

    for (let i = 1; i <= totalPages; i++) {
      paginationLinks.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            href={createPageURL(i.toString())}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return paginationLinks;
  };

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL((currentPage - 1).toString())}
            className={currentPage === 1 ? "pointer-events-none" : ""}
          />
        </PaginationItem>
        {renderPaginationLinks()}
        <PaginationItem>
          <PaginationNext
            href={createPageURL((currentPage + 1).toString())}
            className={
              currentPage + 1 > totalPages ? "pointer-events-none" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ProductPagination;
