import Stripe from "stripe";
import { NextResponse, NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIP_SECRET_KEY as string)
export async function POST(req: NextRequest ) {
  const payload = await req.text()
  const response = JSON.parse(payload)
  
  const sig = req.headers.get("Stripe-Signature")

  const dateTime = new Date(response?.created * 1000).toLocaleDateString()
  const timeString = new Date(response?.created * 1000).toLocaleDateString()

  try {
    let event = stripe.webhooks.constructEvent(payload, sig!, process.env.STRIPE_WEBHOOK_SECRET!)

    console.log(event.type)

    return NextResponse.json({status: "Success", event: event.type})
  } catch (error) {
    return NextResponse.json({status: "Failed", error})
  }
}