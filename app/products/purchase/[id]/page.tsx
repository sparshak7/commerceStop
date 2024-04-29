import prisma from "@/app/lib/db";
import CheckoutForm from "@/components/CheckoutForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Product } from "@prisma/client";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

type BuyProductProps = {
  params: {
    id: string;
  }
}

const BuyProduct = async({params}: BuyProductProps) => {
  const product = await prisma.product.findUnique({where: {id: params.id}})
  const {getUser} = getKindeServerSession()

  const user = await getUser()

  if(product == null) {
    <div>Product not found.</div>
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product?.price!,
    currency: "inr",
    description: product?.description!.slice(0,500),
    customer: user?.given_name!,
    shipping: {name: user?.given_name!, address: {
      city: "Kolkata",
      state: "West Bengal",
      country: "IN",
    }},
    metadata: {
      name: product?.id!,
    }

  })

  if(paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment link.")
  }
  return (
    <CheckoutForm product={product as Product} clientSecret={paymentIntent.client_secret} />
  )
}
export default BuyProduct