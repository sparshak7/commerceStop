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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
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
    <div className="p-4">
      <div className="flex gap-4 items-center mb-4">
        <div className="relative">
          <Image
            alt={product.name}
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product?.image}`}
            fill={true}
            style={{objectFit: "cover"}}
          />
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <h2 className="text-xl font-bold">
            ₹{new Intl.NumberFormat().format(product.price)}
          </h2>
          <p className="text-lg line-clamp-5">{product.description}</p>
        </div>
      </div>
      <Elements options={{ clientSecret, appearance: {theme: "night"} }} stripe={stripePromise}>
        <Form/>
      </Elements>
    </div>
  );
};

function Form() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState<string>();

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if(stripe==null || elements==null) return
    setLoading(true)

    stripe.confirmPayment({elements, confirmParams: {
      return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`
    }}).then(({error}) => {
      if(error.type === "card_error" || error.type === "validation_error") {
        setError(error.message)
      } else {
        console.log(error)
        setError("An unexpected error occurred.")
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
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
