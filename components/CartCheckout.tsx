// "use client";

// import { loadStripe } from "@stripe/stripe-js";
// import { Button } from "./ui/button";
// import { Cart, Product } from "@prisma/client";

// type CartCheckoutProps = {
//   product: Cart[];
// };

// const CartCheckout = ({ product }: CartCheckoutProps) => {
//   const makePayment = async () => {
//     const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

//     const lineItems = product.map((p) => ({
//       price: "price_1PKcmESCOLZ5xbkkI7IkSp06", quantity: p.quantity
//     }));

//     await stripe?.redirectToCheckout({
//       mode: "payment",

//       lineItems: [{ price: "price_1PKcmESCOLZ5xbkkI7IkSp06", quantity: 1 }],
//       successUrl: "https://localhost:3000/",
//       cancelUrl: "https://localhost:3000/",
//       shippingAddressCollection: {
//         allowedCountries: ["IN"],
//       },
//     });

//     // const body = {
//     //   product: product
//     // }
//     // const headers = {
//     //   "Content-Type": "application/json"
//     // }

//     // const res = await fetch("/api/webhook", {
//     //   method: "POST",
//     //   headers,
//     //   body: JSON.stringify(body)
//     // })

//     // const session = await res.json()
//     // const result = await stripe?.redirectToCheckout({
//     //   sessionId: session.id
//     // })

//     // if(result?.error) {
//     //   console.log(result.error)
//     // }
//   };

//   return (
//     <Button
//       className="border-accent bg-secondary-foreground text-background"
//       variant="ghost"
//       onClick={makePayment}
//     >
//       Proceed to checkout
//     </Button>
//   );
// };
// export default CartCheckout;
