"use client";

import { Product } from "@prisma/client";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type CheckoutFormProps = {
  product: Product;
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const CheckoutForm = ({ product, clientSecret }: CheckoutFormProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="pb-16 lg:p-2">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col px-2 pt-20 h-full items-center justify-center">
          <div className="relative h-[200px] w-full">
            <Image
              alt={product.name}
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product?.image}`}
              fill
              className="object-contain"
            />
          </div>
          <div className="my-8">
            <h1 className="text-2xl font-bold">{`${product.name} (x${quantity})`}</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              disabled={quantity === 1}
              onClick={() => setQuantity((prev) => prev - 1)}
              variant="ghost"
              className="border border-border bg-accent hover:opacity-75 duration-100 transition-opacity ease-in-out"
            >
              -
            </Button>
            <div className="text-bold text-red-500 text-md">{quantity}</div>
            <Button
              disabled={quantity === 10}
              onClick={() => setQuantity((prev) => prev + 1)}
              variant="ghost"
              className="border border-border bg-accent hover:opacity-75 duration-100 transition-opacity ease-in-out"
            >
              +
            </Button>
          </div>
        </div>
        <div className="flex px-4 pt-20 h-full items-center justify-center">
          <Elements
            options={{ clientSecret, appearance: { theme: "night" } }}
            stripe={stripePromise}
          >
            <Form price={product.price} quantity={quantity} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

function Form({ price, quantity }: { price: number; quantity: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState<string>();

  const finalPrice = new Intl.NumberFormat("en-IN").format(price * quantity);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (stripe == null || elements == null) return;
    setLoading(true);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_PAYMENT_REDIRECT_URL}/stripe/purchase-success`,
        },
      })
      .then(({ error }) => {
        if (error.type === "card_error" || error.type === "validation_error") {
          setError(error.message);
        } else {
          console.log(error);
          setError("An unexpected error occurred.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3">
            <CardTitle>Checkout</CardTitle>
            <div className="flex flex-col">
              <CardTitle className="text-md text-gray-400 font-semibold">{`Price to pay: ₹${finalPrice}`}</CardTitle>
              <CardTitle className="text-md text-gray-400 font-semibold">
                Quantity: {quantity}
              </CardTitle>
            </div>
            <CardTitle className="text-sm font-bold text-red-500">
              Please use the India Stripe Test Card Number 4000003560000008.
              This is a personal project so refrain from using actual card
              number.
            </CardTitle>
          </div>
          {errors && (
            <CardDescription className="text-destructive">
              {errors}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <PaymentElement />
          <div className="mt-4">
            <LinkAuthenticationElement />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={
              stripe == null ||
              elements == null ||
              loading ||
              finalPrice === "0"
            }
          >
            {loading ? "Paying..." : "Pay"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
export default CheckoutForm;
