import prisma from "@/app/lib/db";
import CheckoutForm from "@/components/CheckoutForm";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Product } from "@prisma/client";
import { redirect } from "next/navigation";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

type BuyProductProps = {
  params: {
    id: string;
  }
}

const BuyProduct = async({params}: BuyProductProps) => {
  const product = await prisma.product.findUnique({where: {id: params.id}})
  const {getUser, isAuthenticated} = getKindeServerSession()

  const user = await getUser()

  if(user == null) {
    redirect("/")
  }

  if(product == null) {
    return <div>Product not found.</div>
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product?.price!,
    currency: "inr",
    metadata: {productId: product?.id}
  })

  if(paymentIntent.client_secret == null) {
    throw Error("Stripe failed to create payment link.")
  }
  return (
    <CheckoutForm product={product as Product} clientSecret={paymentIntent.client_secret} />
  )
}
export default BuyProduct