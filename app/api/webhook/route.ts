import { headers } from "next/headers";
import prisma from "@/app/lib/db";
import { stripe } from "@/utils/stripe";

export async function POST(req: Request ) {
  const payload = await req.text()
  const sig = headers().get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    return new Response("Webhook error", { status: 400 });
  }

  switch(event.type) {
    case "checkout.session.completed" : {
      const session = event.data.object;

      const productId = session.metadata?.productId as string
      const userId = session.metadata?.userId as string
      const quantity = session.metadata?.quantity as string
      const price = session.amount_total as number

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if(product == null) {
        return new Response("Product not found", { status: 400 });
      }

      await prisma.purchased.create({
        data: {
          id: productId,
          kindeAuth: userId,
          pricePaid: (price/100),
          quantity
        },
      });

      console.log("Done")
      break;
    }
    default: {
      console.log("Unhandled event type.")
    }
  }
  return new Response(null, {status: 200})
}


