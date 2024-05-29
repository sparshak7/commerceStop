import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
export async function POST(req: NextRequest ) {
  const payload = await req.text()
  const response = JSON.parse(payload)
  const sig = req.headers.get("Stripe-Signature")

  const event = stripe.webhooks.constructEvent(
    payload,
    sig!,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  
  if(event.type === "payment_intent.succeeded") {
    const charge = event.data.object

    const productId = charge.metadata.productId
    const userId = charge.metadata.userId
    // const email = charge.billing_details.email
    const price = charge.amount

    const product = await prisma.product.findUnique({where: {id: productId}})

    if(product == null) {
      return new NextResponse("Bad Request", {status: 400})
    }

    await prisma.purchased.create({
      data: {
        id: product.id,
        kindeAuth: userId,
        pricePaid: price,
      }
    })
  }
}


