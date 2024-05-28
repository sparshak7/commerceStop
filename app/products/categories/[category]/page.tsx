import prisma from "@/app/lib/db";
import Card from "@/app/search/_components/Card";

type CategoryProps = {
  params: {
    category: string;
  };
};

const Category = async ({ params }: CategoryProps) => {
  const products = await prisma.product.findMany({
    where: {
      categories: {
        has: params.category,
      },
    },
  });

  if (products === null || products.length === 0)
    return (
      <div className="mt-64 mb:mt-72 text-secondary-foreground flex justify-center items-center text-2xl font-medium">
        No products found
      </div>
    );

  return (
    <div className="pb-28 mb:p-2">
      <h1 className="text-2xl font-medium mb-4">Results for {params.category}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
        {products.map((product) => (
          <Card key={product?.id} product={product} />
        ))}
      </div>
    </div>
  );
};
export default Category;
