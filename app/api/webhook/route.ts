import { headers } from "next/headers";
import prisma from "@/app/lib/db";
import { stripe } from "@/utils/stripe";
import { Resend } from "resend";
import ReceiptEmail from "@/components/ReceiptEmail";

const resend = new Resend(process.env.RESEND_API_KEY as string);

export async function POST(req: Request) {
  const payload = await req.text();
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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      const type = session.metadata?.type || "normal";

      console.log(type)

      if (type === "cart") {
        console.log("In cart")
        const userId = session.metadata?.userId as string;

        const cart = await prisma.cart.findMany({
          where: { kindeAuth: userId },
          select: {Product: true, quantity: true}
        });

        if (cart === null) {
          return new Response("Product not found", { status: 400 });
        }

        const promises = cart.map((c) =>
          prisma.purchased.create({
            data: {
              id: c.Product?.id,
              kindeAuth: userId,
              pricePaid: (c.Product?.price as number) * c.quantity,
              quantity: c.quantity.toString(),
            },
          })
        );

        await Promise.all(promises);
        await prisma.cart.deleteMany({ where: { kindeAuth: userId } });

      } else if(type === "normal") {
        console.log("In normal")
        const productId = session.metadata?.productId as string;
        const userId = session.metadata?.userId as string;
        const quantity = session.metadata?.quantity as string;
        const price = session.amount_total as number;

        const product = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (product == null) {
          return new Response("Product not found", { status: 400 });
        }

        await prisma.purchased.create({
          data: {
            id: productId,
            kindeAuth: userId,
            pricePaid: price / 100,
            quantity,
          },
        });

        const { data, error } = await resend.emails.send({
          from: "CommerceStop <onboarding@resend.dev>",
          to: session.customer_details?.email as string,
          subject: "Payment Receipt from CommerceStop",
          react: ReceiptEmail({
            total: price,
            name: session.customer_details?.name as string,
            email: session.customer_details?.email as string,
            quantity: quantity,
            productName: product?.name,
            image: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product?.image}`,
          }),
        });
      }

      break;
    }
    default: {
      console.log("Unhandled event type.");
    }
  }
  return new Response(null, { status: 200 });
}
