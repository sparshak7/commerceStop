import { Product } from "@prisma/client";
import prisma from "../lib/db";
import Search from "./_components/Search";
import Card from "./_components/Card";
import Pagination from "../../components/Pagination";

type SearchPageProps = {
  searchParams: {
    query?: string;
    page?: string;
    limit?: string;
  };
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 2;
  const limit = Number(searchParams?.limit) || 2;
  const offset = (currentPage - 1) * limit;
  let searchRes: Product[] = [];
  let searchPerformed = false;
  let totalItems = 0;

  if (query.trim() !== "") {
    searchRes = await prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      skip: offset,
      take: limit,
    });

    totalItems = await prisma.product.count({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
    });
    searchPerformed = true;
  }

  return (
    <div className="pb-8 md:p-2">
      <Search />
      <div className="mt-4">
        {searchPerformed ? (
          searchRes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
              {searchRes.map((product) => (
                <Card key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center h-[300px] text-2xl font-semibold">
              No such product found
            </div>
          )
        ) : (
          <div className="flex justify-center items-center h-[300px] text-2xl font-semibold">
            Try searching!
          </div>
        )}
        {searchPerformed && searchRes.length > 0 && (
          <Pagination total={totalItems} />
        )}
      </div>
      {/* <ProductPagination /> */}
    </div>
  );
};
export default SearchPage;
