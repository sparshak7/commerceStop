import { Badge } from "@/components/ui/badge";
import { Product } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";

type CardProps = {
  product: Product;
};

const Card = ({ product }: CardProps) => {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="rounded-xl border border-accent p-4 md:hover:bg-accent md:opacity-75 md:transition md:duration-200 md:ease-in-out md:transform md:hover:-skew-y-2 md:h-[500px]">
        <div className="relative h-72 overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product.image}`}
            alt={product.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col gap-3 mt-4">
          <p className="line-clamp-2 italic font-normal">{product.name}</p>
          <h2>₹{new Intl.NumberFormat("en-US").format(product.price)}</h2>
          <div className="flex items-center gap-2 flex-wrap">
            {product.categories.slice(0, 5).map((c, id) => (
              <Badge className="bg-accent text-secondary-foreground border-accent-foreground">
                {c}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};
export default Card;
