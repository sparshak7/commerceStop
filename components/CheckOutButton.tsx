import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "./ui/button";
import { Product } from "@prisma/client";
import Link from "next/link";

type CheckOutProps = {
  product: Product;
}

const CheckOutButton = async({product}: CheckOutProps) => {
  const {getUser} = getKindeServerSession()
  const user = await getUser()
  return (
    <>
      {!product.isAvailableForPurchase ? (
        <Button
          disabled
          className="border-accent bg-secondary-foreground text-background"
          variant="ghost"
        >
          Out of Stock
        </Button>
      ) : (
        <Link
          href={`${product.stripe_link}?user=${user?.id!}`}
        >
          <Button
            className="border-accent bg-secondary-foreground text-background w-full"
            variant="ghost"
          >
            Buy
          </Button>
        </Link>
      )}
    </>
  );
}
export default CheckOutButton

