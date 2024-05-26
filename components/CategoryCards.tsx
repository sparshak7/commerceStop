import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";
import { AddToCart } from "@/components/ProductActions";
import CardGrid from "@/components/CardGrid";
import Cookie from "@/components/Cookie";
import prisma from "@/app/lib/db";

const CategoryCards = async() => {
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
  return <div>CategoryCards</div>;
};
export default CategoryCards;
