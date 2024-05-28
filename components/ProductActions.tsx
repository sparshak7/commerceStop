"use client";

import {
  addToCart,
  changeQuantity,
  deleteFromCart,
  deleteProduct,
  toggleProductAvailability,
} from "@/actions/product-actions";
import { useRouter } from "next/navigation";
import { ReactNode, useTransition } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Loader2, Minus, Trash } from "lucide-react";
import toast from "react-hot-toast";

type ActiveToggleProductAdminProps = {
  id: string;
  isAvailableForPurchase: boolean;
};

type DeleteProductAdminProps = {
  id: string;
  disabled: boolean;
};

export const ActiveToggleProductAdmin = ({
  id,
  isAvailableForPurchase,
}: ActiveToggleProductAdminProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      className={isAvailableForPurchase ? "text-red-600" : "text-primary"}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailableForPurchase);
          toast.success(`Product is now ${!isAvailableForPurchase ? "available." : "not available."}`, {
            position: "bottom-right",
          });
          router.refresh();
        })
      }
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
};

export const DeleteProductAdmin = ({
  id,
  disabled,
}: DeleteProductAdminProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <DropdownMenuItem
      className="text-red-600"
      disabled={disabled || isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteProduct(id);
          toast.success("Deleted from database.", {
            position: "bottom-right",
          });
          router.refresh();
        })
      }
    >
      Delete
    </DropdownMenuItem>
  );
};

export const AddToCart = ({ id }: { id: string }) => {
  const [isPending, startTransition] = useTransition();
  return (
    <div>
      <Button
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            await addToCart(id);
            toast.success("Added to cart!", {
              position: "bottom-right",
            });
          });
        }}
        variant="ghost"
        className="my-2 w-full border border-border bg-accent hover:opacity-75 duration-100 transition-opacity ease-in-out"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Add to Cart"
        )}
      </Button>
    </div>
  );
};

export const QuantityChanger = ({
  id,
  order,
  children,
}: {
  id: string;
  order: string;
  children: ReactNode;
}) => {
  const [isPending, startTransition] = useTransition();
  return (
    <div
      onClick={() =>
        startTransition(async () => {
          await changeQuantity(id, order);
        })
      }
    >
      {children}
    </div>
  );
};

export const RemoveFromCart = ({ id, userId }: { id: string, userId: string }) => {
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await deleteFromCart(id, userId);
          toast.success("Removed from cart!", {
            position: "bottom-right",
          });
        })
      }
      variant="outline"
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-500 w-full"
    >
      <Trash />
    </Button>
  );
};
