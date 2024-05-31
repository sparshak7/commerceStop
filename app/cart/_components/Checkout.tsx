"use client";

import { BuyProduct, CartCheckout } from "@/actions/product-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Copy, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import toast from "react-hot-toast";

const Checkout = () => {
  const handleCopy = () => {
    try {
      navigator?.clipboard.writeText("4000003560000008");
      toast.success("Copied to clipboard", { position: "top-center" });
    } catch (error) {
      toast.error("Failed to copy", { position: "top-center" });
    }
  };

  return (
    <div className="p-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="border border-border bg-accent hover:opacity-75 duration-100 transition-opacity ease-in-out"
          >
            Checkout
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <div className="mt-2 flex flex-col">
            <p className="text-sm text-red-500 font-medium">
              Please use the India Stripe Test Card Number. This is a personal
              project so refrain from using actual card number.
            </p>
            <div className="flex gap-4 items-center mt-2">
              <p className="text-sm font-bold text-red-500">4000003560000008</p>
              <div onClick={handleCopy}>
                <Copy className="size-4 cursor-pointer" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <form action={CartCheckout}>
              <BuyButton />
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function BuyButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled className="w-full my-2 bg-red-500">
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
        </Button>
      ) : (
        <Button
          className="bg-red-500 my-2 w-full"
          variant="ghost"
          type="submit"
        >
          Buy
        </Button>
      )}
    </>
  );
}

export default Checkout;
