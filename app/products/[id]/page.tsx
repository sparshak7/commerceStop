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
            ₹{new Intl.NumberFormat().format(product.price)}
          </h2>
          {/* <p className="text-base font-medium">{product.description}</p> */}
          <div className="flex gap-4 flex-col md:flex-row md:items-center">
            {!isInCart ? (
              <AddToCart id={product.id} />
            ) : (
              <Link
                href={`/cart/${user?.id}`}
                className="bg-accent hover:opacity-75 duration-100 transition-opacity ease-in-out px-2 py-3 rounded-2xl"
              >
                Already in cart
              </Link>
            )}

            <Link href="#">
              <Button
                className="border-accent bg-secondary-foreground text-background w-full"
                variant="ghost"
                // disabled={!product.isAvailableForPurchase}
                disabled
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
    </div>
  );
};
export default ProductDetails;
