import prisma from "@/app/lib/db";
import Card from "@/app/search/_components/Card";
import Order from "@/components/Order";
import Pagination from "@/components/Pagination";
import Sorted from "@/components/Sorted";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Filter } from "lucide-react";

type CategoryProps = {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
    limit?: string;
    order?: string;
    sort?: string;
  };
};

const Category = async ({ params, searchParams }: CategoryProps) => {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 4;
  const offset = (page - 1) * limit;
  const order = searchParams.order || "desc";
  const sort = searchParams.sort || "desc";
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where: {
        categories: {
          has: params.category,
        },
      },
      orderBy: {createdAt: order as any},
      skip: offset,
      take: limit,
    }),
    prisma.product.count({
      where: {
        categories: {
          has: params.category,
        },
      },
    }),
  ]);

  if (products === null || total === 0)
    return (
      <div className="mt-64 mb:mt-72 text-secondary-foreground flex justify-center items-center text-2xl font-medium">
        No products found
      </div>
    );

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pb-28 mb:p-2">
      <div className="flex items-center justify-between mb-4 px-2">
        <h1 className="text-sm md:text-xl font-medium">
          Results for {params.category}
        </h1>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <Filter />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem className="w-full">
                <Order text="Latest first" />
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full">
                <Order text="Earliest first" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <ArrowUpDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem className="w-full">
                <Sorted text="Price descending" />
              </DropdownMenuItem>
              <DropdownMenuItem className="w-full">
                <Sorted text="Price ascending" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
        {products.map((product) => (
          <Card key={product?.id} product={product} />
        ))}
      </div>
      <Pagination total={totalPages} />
    </div>
  );
};
export default Category;
