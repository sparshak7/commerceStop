import prisma from "@/app/lib/db";
import { AddToCart } from "@/components/ProductActions";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import CheckOutButton from "@/components/CheckOutButton";

type ProductDetailsProps = {
  params: {
    id: string;
  };
};

const ProductDetails = async ({ params }: ProductDetailsProps) => {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const cartItems = await prisma.cart.findMany({
    where: {
      kindeAuth: user?.id,
    },
  });

  const isInCart = cartItems.some((cartItem) => cartItem?.id === product?.id);

  if (product == null)
    return (
      <div className="flex justify-between items-center text-2xl font-bold">
        Something went wrong.
      </div>
    );

  const similarProducts = await prisma.product.findMany({
    where: {
      categories: {
        hasSome: product.categories,
      },
      id: {
        not: product.id,
      },
    },
  });

  return (
    <div className="pb-28 md:pb-2">
      <div className="h-full flex flex-col md:flex-row px-12 py-4 gap-8">
        <div className="relative h-[300px] md:h-[500px] md:w-1/2 rounded-2xl border border-border">
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product?.image}`}
            alt={product?.name}
            fill={true}
            className="object-contain p-4"
          />
        </div>
        <div className="items-center md:items-start flex flex-col gap-4 justify-center p-2 md:w-1/2">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <h2 className="text-xl font-bold">
            ₹{new Intl.NumberFormat("en-IN").format(product.price)}
          </h2>
          {/* <p className="text-base font-medium">{product.description}</p> */}
          <div className="flex gap-4 flex-col md:flex-row md:items-center">
            {!isInCart ? (
              user ? (
                <AddToCart id={product.id} />
              ) : (
                <Link href="/api/auth/login">
                  <Button
                    variant="ghost"
                    className="my-2 w-full border border-border bg-accent hover:opacity-75 duration-100 transition-opacity ease-in-out"
                  >
                    Add to Cart
                  </Button>
                </Link>
              )
            ) : (
              <Link
                href={`/cart/${user?.id}`}
                className="bg-accent hover:opacity-75 duration-100 transition-opacity ease-in-out px-2 py-3 rounded-2xl"
              >
                Already in cart
              </Link>
            )}
            {/* <CheckOutButton product={product} /> */}
            <Link
              href={
                product.isAvailableForPurchase
                  ? `/products/purchase/${product.id}`
                  : "#"
              }
            >
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
      <div className="flex flex-col gap-4 py-6 px-4">
        <h2 className="text-2xl font-bold">Product Details</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Product Description</AccordionTrigger>
            <AccordionContent>
              <p className="text-base font-medium">{product.description}</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Tags</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-4 flex-wrap items-center">
                {product.categories.map((c, id) => (
                  <Link href={`/products/categories/${c}`} key={id}>
                    <Badge className="bg-accent text-accent-foreground">
                      {c}
                    </Badge>
                  </Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex flex-col gap-4 px-4 py-2">
        <h2 className="text-2xl font-bold">Similar products</h2>
        <div className="flex flex-wrap gap-4 items-center">
          {similarProducts.length === 0 ? (
            <p className="text-center">No similar products found.</p>
          ) : (
            <div className="flex items-center overflow-x-auto gap-4">
              {similarProducts.map((product) => (
                <Link href={`/products/${product.id}`} key={product.id}>
                  <div className="flex flex-col gap-2 items-center border border-border p-2 rounded-2xl hover:bg-gray-900 duration-200 transition ease-in-out w-[200px]">
                    <div className="relative w-[100px] h-[100px]">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product?.image}`}
                        alt={product?.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-bold line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-gray-500 font-semibold">
                        ₹{new Intl.NumberFormat("en-IN").format(product.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
