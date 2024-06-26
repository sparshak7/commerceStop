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
import Quantity from "./_components/Quantity";
import { Metadata, ResolvingMetadata } from "next";

type ProductDetailsProps = {
  params: {
    id: string;
  };
};

type Props = {
  params: {
    id: string;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) {
    return { title: "", description: "" };
  }

  return {
    title: product.name || "",
    description: product.description || "",
    openGraph: {
      images: [
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product?.image}`,
      ],
    },
    alternates: {
      canonical: `/product/${id}`,
    },
  };
}

const ProductDetails = async ({ params }: ProductDetailsProps) => {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const cartItems = await prisma.cart.findMany({
    where: {
      kindeAuth: user?.id,
    },
  });

  const isInCart = cartItems.some((cartItem) => cartItem?.productId === product?.id);

  if (product == null)
    return (
      <div className="flex justify-between items-center text-2xl font-bold">
        Something went wrong.
      </div>
    );

  const similarProducts = await prisma.product.findMany({
    where: {
      categories: {
        hasSome: product?.categories,
      },
      id: {
        not: product?.id,
      },
    },
  });

  return (
    <div className="pb-4 md:pb-2">
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
          <h1 className="text-2xl font-bold text-center md:text-start">
            {product?.name}
          </h1>
          <h2 className="text-xl font-bold">
            ₹{new Intl.NumberFormat("en-IN").format(product?.price)}
          </h2>
          <div className="flex gap-2 flex-col md:flex-row md:items-center">
            {!user ? (
              <Link href="/api/auth/login">
                <Button
                  variant="ghost"
                  className="w-full border border-border bg-accent hover:opacity-75 duration-100 transition-opacity ease-in-out"
                >
                  Add to Cart
                </Button>
              </Link>
            ) : !isInCart ? (
              <AddToCart id={product?.id} />
            ) : (
              <AddToCart id={product?.id} quantity />
            )}
            <Quantity
              isAvailable={product.isAvailableForPurchase}
              id={product.id}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 py-6 px-4">
        <h2 className="text-2xl font-bold">Product Details</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Product Description</AccordionTrigger>
            <AccordionContent>
              <p className="text-base font-medium">{product?.description}</p>
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
      <div className="py-6 px-4">
        <h2 className="text-2xl font-bold">Similar products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 py-6 px-4">
          {similarProducts?.length === 0 ? (
            <p className="text-center w-full pt-2 font-semibold">
              No similar products found.
            </p>
          ) : (
            similarProducts.map((product) => (
              <Link href={`/products/${product?.id}`} key={product?.id}>
                <div className="rounded-xl border border-accent p-4 md:hover:bg-accent md:opacity-75 md:transition md:duration-200 md:ease-in-out md:transform md:hover:-skew-y-2 overflow-hidden md:h-[300px] h-[250px]">
                  <div className="relative overflow-hidden md:h-[170px] h-[125px]">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product?.image}`}
                      alt={product?.name}
                      fill
                      className="object-contain w-full h-auto"
                    />
                  </div>
                  <div className="flex flex-col gap-1 mt-4 px-2 py-3">
                    <p className="line-clamp-1 italic font-normal">
                      {product?.name}
                    </p>
                    <h2>
                      ₹{new Intl.NumberFormat("en-IN").format(product?.price)}
                    </h2>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductDetails;
