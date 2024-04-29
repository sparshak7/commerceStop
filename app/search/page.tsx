import { Product } from "@prisma/client";
import prisma from "../lib/db";
import Search from "./_components/Search"
import Card from "./_components/Card";
import ProductPagination from "@/components/ProductPagination";

type SearchPageProps = {
  searchParams: {
    query?: string;
    page?: string;
  }
}

const SearchPage = async({searchParams}: SearchPageProps) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  let searchRes: Product[] = [];
  let searchPerformed = false;
  const itemsPerPage = 1;
  let totalItems = 0;

  if (query.trim() !== "") {
    const skip = (currentPage - 1) * itemsPerPage;
    searchRes = await prisma.product.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      skip,
      take: itemsPerPage,
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
    <div>
      <Search />
      <div className="mt-4 mb-32">
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
        {searchPerformed && searchRes.length > 0 && <ProductPagination currentPage={currentPage} totalItems={totalItems} itemsPerPage={itemsPerPage} />}
      </div>
      {/* <ProductPagination /> */}
    </div>
  );
}
export default SearchPage