import prisma from "@/app/lib/db";
import { AddToCart } from "@/components/ProductActions";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";
import Image from "next/image";

type ProductDetailsProps = {
  params: {
    id: string;
  };
};

const ProductDetails = async ({ params }: ProductDetailsProps) => {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (product == null)
    return (
      <div className="flex justify-between items-center text-2xl font-bold">
        Something went wrong.
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
      <div className="relative h-[600px]">
        <Image
          src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product?.image}`}
          alt={product?.name}
          fill={true}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <h2 className="text-xl font-bold">
          ₹{new Intl.NumberFormat().format(product.price)}
        </h2>
        <p className="text-base font-medium">{product.description}</p>
        <div className="flex items-center gap-2">
          <AddToCart id={product.id} />
          <Link href={`/products/purchase/${product.id}`}>
            <Button
              className="bg-red-500 my-2 w-full"
              variant="ghost"
              disabled={!product.isAvailableForPurchase}
            >
              {product.isAvailableForPurchase ? "Buy" : "Out of Stock"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
