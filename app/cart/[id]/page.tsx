import prisma from "@/app/lib/db";
import GoBack from "@/components/GoBack";
import { QuantityChanger, RemoveFromCart } from "@/components/ProductActions";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Minus, MoreVertical, Plus } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";

type CartItemsProps = {
  params: {
    id: string;
  };
};

const CartItems = async ({ params }: CartItemsProps) => {
  const cart = await prisma.cart.findMany({
    where: { kindeAuth: params.id },
    select: { Product: true, quantity: true },
    orderBy: { createdAt: "desc" },
  });

  if (cart.length === 0) {
    return <div className="flex justify-center items-center text-2xl">
      <div className="flex gap-4 items-center">
        <GoBack />
        Your cart is empty.
      </div>  
    </div>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl">Your Cart Items</h1>
      <div className="flex flex-col gap-4">
        {cart.map((item) => (
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
                <h2>
                  ₹
                  {new Intl.NumberFormat("en-US").format(
                    item.Product?.price! * item.quantity
                  )}
                </h2>
              </div>
            </div>

            <div className="flex-col gap-6 md:flex hidden">
              <div className="flex gap-4 items-center">
                <QuantityChanger id={item.Product?.id!} order="des">
                  <Minus
                    className={`size-6 md:hover:bg-gray-500 rounded-full ${
                      item.quantity === 1 && "hidden"
                    } border border-gray-200`}
                  />
                </QuantityChanger>
                <p className="text-lg">{item.quantity}</p>
                <QuantityChanger id={item.Product?.id!} order="asc">
                  <Plus className="size-6 md:hover:bg-gray-500 rounded-full border border-gray-200" />
                </QuantityChanger>
              </div>
              <div>
                <RemoveFromCart id={item.Product?.id!} />
              </div>
            </div>
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <div className="flex gap-4 items-center">
                      <QuantityChanger id={item.Product?.id!} order="des">
                        <Minus
                          className={`size-6 md:hover:bg-gray-500 rounded-full ${
                            item.quantity === 1 && "hidden"
                          } border border-gray-200`}
                        />
                      </QuantityChanger>
                      <p className="text-lg">{item.quantity}</p>
                      <QuantityChanger id={item.Product?.id!} order="asc">
                        <Plus className="size-6 md:hover:bg-gray-500 rounded-full border border-gray-200" />
                      </QuantityChanger>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <RemoveFromCart id={item.Product?.id!} />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CartItems;