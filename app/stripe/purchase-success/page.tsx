import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Link } from "next-view-transitions";
import { notFound, redirect } from "next/navigation";
import Stripe from "stripe";

type PaymentSuccessProps = {
  searchParams: {
    payment_intent: string;
  };
};
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PaymentSuccess = async ({ searchParams }: PaymentSuccessProps) => {
  const { getUser } = getKindeServerSession();

  const user = await getUser();

  if (user == null) redirect("/");

  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );

  if (paymentIntent.metadata.productId == null) {
    return (
      <div className="h-full mt-64 mb:mt-72 flex justify-center items-center overflow-hidden">
        Either the payment link has expired or something has gone wrong with the
        payment.
      </div>
    );
  }

  const product = await prisma.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  });

  if (product == null) {
    return (
      <div className="h-full mt-64 mb:mt-72 flex justify-center items-center overflow-hidden">
        Product was not found. Please try again.
      </div>
    );
  }

  const isSuccess = paymentIntent.status === "succeeded";

  return (
    <>
      {isSuccess ? (
        <div className="h-full mt-60 mb:mt-68 flex justify-center items-center px-4">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-2xl font-bold">
              You have succesfully bought the product.
            </p>
            <Link
              href={`/purchases/${user?.id}?page=1`}
            >
              <Button className="bg-red-500 my-2 w-full" variant="ghost">
                Check orders
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="h-full mt-60 mb:mt-68 flex justify-center items-center px-4">
          <div className="flex flex-col gap-2 items-center">
            <p className="text-2xl font-bold">
              The transaction could not be completed.
            </p>
            <Link
              href={`/products/purchase/${paymentIntent.metadata.productId}`}
            >
              <Button className="bg-red-500 my-2 w-full" variant="ghost">
                Try again.
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
export default PaymentSuccess;
