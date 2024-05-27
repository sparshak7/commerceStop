import prisma from "@/app/lib/db";
import GoBack from "@/components/GoBack";
import { QuantityChanger, RemoveFromCart } from "@/components/ProductActions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Minus, MoreVertical, Plus } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";

type PurchaseProps = {
  params: {
    id: string;
  };
};

const Purchases = async ({ params }: PurchaseProps) => {

  const purchased = await prisma.purchased.findMany({
    where: { kindeAuth: params.id },
    select: { Product: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  if (purchased.length === 0) {
    return (
      <div className="mt-64 mb:mt-72 flex justify-center items-center text-2xl">
        You have not purchased anything yet.
      </div>
    );
  }

  return (
    <div className="pb-28 px-4 md:pb-2">
      <h1 className="mb-6 text-2xl">Your Purchase History</h1>
      <div className="flex flex-col gap-4">
        {purchased.map((item) => (
          <div
            className="flex justify-between items-center md:hover:bg-accent border-b border-accent py-3 px-2 rounded-2xl mb-4"
            key={item.Product?.id}
          >
            <div className="flex gap-4 items-center">
              <Link href={`/products/${item.Product?.id}`}>
                <div className="relative h-[80px] w-[80px]">
                  <Image
                    fill={true}
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${item.Product?.image}`}
                    alt={item.Product?.name!}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </Link>

              <div className="flex flex-col gap-2">
                <h2 className="line-clamp-2 md:line-clamp-none">
                  {item.Product?.name}
                </h2>
                <h2 className="line-clamp-2 md:line-clamp-none">
                  Purchased on:{" "}
                  {`${new Intl.DateTimeFormat("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                    timeZone: "Asia/Kolkata",
                  }).format(item.createdAt)}`}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Purchases;
