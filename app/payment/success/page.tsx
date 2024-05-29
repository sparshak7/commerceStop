import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Check } from "lucide-react";
import { Link } from "next-view-transitions";

const SuccessRoute = async() => {
  const {getUser} = getKindeServerSession()
  const user = await getUser()
  return (
    <section className="w-full min-h-[80vh] flex justify-center items-center">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <Check className="w-12 h-12 rounded-full text-green-500 p-2" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-lg leading-6 font-medium">
              Payment succesful.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You have succesfully purchased the product. Check your orders.
            </p>
            <Button
              className="mt-5 sm:mt-6 border border-border bg-accent hover:opacity-75 duration-100 transition-opacity ease-in-out"
              variant="ghost"
            >
              <Link href={`/purchases/${user?.id}`}>Your Orders</Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
};
export default SuccessRoute;
