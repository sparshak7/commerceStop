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
import { FormEvent, useState } from "react";

type CheckoutFormProps = {
  product: Product;
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

const CheckoutForm = ({ product, clientSecret }: CheckoutFormProps) => {
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
          <div className="mt-8">
            <h1 className="text-2xl font-bold">{product.name}</h1>
          </div>
        </div>
        <div className="flex px-4 pt-20 h-full items-center justify-center">
          <Elements
            options={{ clientSecret, appearance: { theme: "night" } }}
            stripe={stripePromise}
          >
            <Form price={product.price} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

function Form({ price }: { price: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState<string>();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (stripe == null || elements == null) return;
    setLoading(true);

    stripe
      .confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
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
          <div className="flex flex-col gap-2">
            <CardTitle>Checkout</CardTitle>
            <CardTitle className="text-md text-gray-400 font-semibold">{`Price to pay: ₹${new Intl.NumberFormat(
              "en-IN"
            ).format(price)}`}</CardTitle>
            <CardTitle className="text-sm font-bold text-red-500">
              Please use the India Stripe Test Card Number 4000003560000008. This is a personal project so refrain from using actual card number.
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
            disabled={stripe == null || elements == null || loading}
          >
            {loading ? "Paying..." : "Pay"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
export default CheckoutForm;
