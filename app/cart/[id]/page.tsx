import { CartCheckout } from "@/actions/product-actions";
import prisma from "@/app/lib/db";
import Pagination from "@/components/Pagination";
import { QuantityChanger, RemoveFromCart } from "@/components/ProductActions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Minus, MoreVertical, Plus } from "lucide-react";
import { Link } from "next-view-transitions";
import Image from "next/image";
import Checkout from "../_components/Checkout";

type CartItemsProps = {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    limit?: string;
    order?: string;
  };
};

const CartItems = async ({ params, searchParams }: CartItemsProps) => {
  const page = Number(searchParams.page) || 1;
  const limit = Number(searchParams.limit) || 5;
  const offset = (page - 1) * limit;
  const order = searchParams.order || "desc";

  if (!params.id) {
    return (
      <div className="mt-64 mb:mt-72 flex justify-center items-center text-2xl">
        Something went wrong.
      </div>
    );
  }

  const [cart, total] = await prisma.$transaction([
    prisma.cart.findMany({
      where: { kindeAuth: params.id },
      select: { Product: true, quantity: true, id: true, productId: true  },
      orderBy: { createdAt: order } as any,
      skip: offset,
      take: limit,
    }),
    prisma.cart.count({ where: { kindeAuth: params.id } }),
  ]);

  const totalSum = cart.reduce((sum, item) => {
    return sum + item?.Product?.price! * item?.quantity;
  }, 0);

  if (cart === null) {
    return (
      <div className="mt-64 mb:mt-72 flex justify-center items-center text-2xl">
        Something went wrong.
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="mt-64 mb:mt-72 flex justify-center items-center text-2xl">
        Your cart is empty.
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="pb-28 px-4 md:pb-2">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-sm md:text-xl">Your Cart Items</h1>
          <h3 className="text-md">
            Your current total:{" "}
            <span className="text-red-500 tracking-wider">
              ₹{new Intl.NumberFormat("en-IN").format(totalSum)}
            </span>
          </h3>
        </div>
        {/* <Link href={`/purchases/${params.id}?page=1`}>
          <Button
            variant="ghost"
            className="border border-border bg-accent hover:opacity-75 duration-100 transition-opacity ease-in-out"
          >
            Your Orders
          </Button>
        </Link> */}
        <Checkout />
      </div>
      <div className="flex flex-col gap-4">
        {cart &&
          cart?.map((item) => (
            <div
              className="flex justify-between items-center md:hover:bg-accent border-b border-accent py-3 px-2 rounded-2xl mb-4"
              key={item?.Product?.id!}
            >
              <div className="flex gap-4 items-center">
                <Link href={`/products/${item?.Product?.id!}`}>
                  <div className="relative h-[80px] w-[80px]">
                    <Image
                      fill={true}
                      src={`${process.env
                        .NEXT_PUBLIC_SUPABASE_URL!}/storage/v1/object/public/Zephyr-products/${item
                        ?.Product?.image!}`}
                      alt={item?.Product?.name!}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                </Link>

                <div className="flex flex-col gap-2">
                  <h2 className="line-clamp-1 md:line-clamp-none">
                    {item?.Product?.name!}
                  </h2>
                  <h2 className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </h2>
                  <h2>
                    ₹
                    {new Intl.NumberFormat("en-IN").format(
                      item?.Product?.price! * item?.quantity
                    )}
                  </h2>
                </div>
              </div>

              <div className="flex-col gap-6 md:flex hidden">
                <div className="flex gap-4 items-center">
                  <QuantityChanger id={item?.id} order="des">
                    <Minus
                      className={`size-6 md:hover:bg-gray-500 rounded-full ${
                        item?.quantity === 1 && "hidden"
                      } border border-gray-200`}
                    />
                  </QuantityChanger>
                  <p className="text-lg">{item?.quantity}</p>
                  <QuantityChanger id={item?.id} order="asc">
                    <Plus className="size-6 md:hover:bg-gray-500 rounded-full border border-gray-200" />
                  </QuantityChanger>
                </div>
                <div>
                  <RemoveFromCart id={item?.id} />
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
                        <QuantityChanger id={item?.Product?.id!} order="des">
                          <Minus
                            className={`size-6 md:hover:bg-gray-500 rounded-full ${
                              item?.quantity === 1 && "hidden"
                            } border border-gray-200`}
                          />
                        </QuantityChanger>
                        <p className="text-lg">{item?.quantity}</p>
                        <QuantityChanger id={item?.Product?.id!} order="asc">
                          <Plus className="size-6 md:hover:bg-gray-500 rounded-full border border-gray-200" />
                        </QuantityChanger>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <RemoveFromCart id={item?.Product?.id!} />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
      </div>
      <Pagination total={totalPages} />
    </div>
  );
};
export default CartItems;
