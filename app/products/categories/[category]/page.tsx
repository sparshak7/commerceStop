import prisma from "@/app/lib/db";
import Card from "@/app/search/_components/Card";

type CategoryProps = {
  params: {
    category: string;
  }
}

const Category = async({params}: CategoryProps) => {
  const products = await prisma.product.findMany({
    where: {
      categories: {
        has: params.category
      }
    }
  })

  console.log(products);

  if(products === null || products.length === 0) return (
    <div className="text-secondary-foreground flex justify-center items-center text-2xl font-medium">No products found</div>
  )

  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4">
      {products.map((product) => (
        <Card key={product.id} product={product} />
      ))}
    </div>
  );
}
export default Category