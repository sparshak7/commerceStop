import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import { Link } from "next-view-transitions"

const CancelRoute = () => {
  return (
    <section className="w-full min-h-[70vh] md:min-h-[80vh] flex justify-center items-center px-2">
      <Card className="w-[350px]">
        <div className="p-6">
          <div className="w-full flex justify-center">
            <XCircle className="w-12 h-12 rounded-full text-red-500 p-2" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h3 className="text-lg leading-6 font-medium">
              Payment cancelled.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong with your payment.
            </p>
            <Button
              className="mt-5 sm:mt-6 border border-border bg-accent hover:opacity-75 duration-100 transition-opacity ease-in-out"
              variant="ghost"
            >
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </div>
      </Card>
    </section>
  );
}
export default CancelRoute