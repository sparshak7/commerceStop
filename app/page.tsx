import Image from "next/image";
import prisma from "./lib/db";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";
import { AddToCart } from "@/components/ProductActions";
import CardGrid from "@/components/CardGrid";
import Cookie from "@/components/Cookie";

export default async function Home() {
  const products = await prisma.product.findMany({
    select: {
      name: true,
      price: true,
      description: true,
      image: true,
      id: true,
      isAvailableForPurchase: true,
      createdAt: true,
      _count: { select: { Cart: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) {
    return (
      <p className="text-secondary-foreground text-center mt-6 font-bold">
        No products found
      </p>
    );
  }
  return (
    <main>
      <Cookie />
      {/* <div className="grid grid-cols-3 gap-6">
        {products.map((product) => (
          <div>
            <Link href={`products/${product.id}`}>
              <div className="flex flex-col gap-4" key={product.id}>
                <div className="relative h-96">
                  <Image
                    alt={product.name}
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product.image}`}
                    fill={true}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <h1 className="line-clamp-1">{product.name}</h1>
                <h2>₹{new Intl.NumberFormat("en-US").format(product.price)}</h2>
              </div>
            </Link>
            <AddToCart id={product.id}/>
          </div>
        ))}
      </div> */}
      <CardGrid />
    </main>
  );
}
