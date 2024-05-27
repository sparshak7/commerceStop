import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
export async function POST(req: NextRequest ) {
  const params = req.nextUrl.searchParams
  const userID = params.get("user")
  console.log(userID)
  const payload = await req.text()
  const response = JSON.parse(payload)
  
  
  const sig = req.headers.get("Stripe-Signature")

  const dateTime = new Date(response?.created * 1000).toLocaleDateString()
  const timeString = new Date(response?.created * 1000).toLocaleDateString()

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig!, process.env.STRIPE_WEBHOOK_SECRET!)
    // return NextResponse.json({status: "Success", event: event.type})
  } catch (error) {
    return NextResponse.json({status: "Failed", error})
  }
  console.log("event.type", JSON.stringify(event.type))
  if(event.type === "checkout.session.completed") {
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(event.data.object.id, {expand: ['line_items']})
    const lineItems = sessionWithLineItems.line_items
    if(!lineItems) return NextResponse.json({status: "Failed"})
    try {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      console.log(user?.id)
      const name = lineItems.data[0].description
      const found = await prisma.product.findMany({where: {name: name}})
      await prisma.purchased.create({data: {
        id: found[0].id,
        kindeAuth: userID!,
      }})

    } catch (error) {
      console.log(error)
    }
  }
}

// import Stripe from "stripe";
// import { NextResponse, NextRequest } from "next/server";
// import prisma from "@/app/lib/db";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
// export async function POST(req: NextRequest, res: NextResponse) {
//   const { productId, userId } = await req.json()
//   try {
//     // Fetch product details from the database
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product) {
//       return NextResponse.json({ error: "Product not found" });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "inr",
//             product_data: {
//               name: product.name,
//             },
//             unit_amount: product.price * 100
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `https://localhost:3000`,
//       cancel_url: `https://localhost:3000`,
//       metadata: {
//         productId,
//         userId,
//       },
//     });

//     NextResponse.json({ id: session.id });
//   } catch (error) {
//     NextResponse.json({ error: error });
//   }
// }



