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
    <Link href={`/products/${product?.id}`}>
      <div className="rounded-xl border border-accent p-4 md:hover:bg-accent md:opacity-75 md:transition md:duration-200 md:ease-in-out md:transform md:hover:-skew-y-2 overflow-hidden md:h-[400px] h-[325px]">
        <div className="relative overflow-hidden md:h-[200px] h-[125px]">
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product?.image}`}
            alt={product?.name}
            fill
            className="object-contain w-full h-auto"
          />
        </div>
        <div className="flex flex-col gap-1 mt-4 px-2 py-3">
          <p className="line-clamp-1 italic font-normal">{product?.name}</p>
          <h2>₹{new Intl.NumberFormat("en-US").format(product?.price)}</h2>
          <div className="flex items-center gap-2 flex-wrap mt-4">
            {product.categories.slice(0, 5).map((c, id) => (
              <Badge
                key={id}
                className="bg-accent text-secondary-foreground border-accent-foreground"
              >
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
