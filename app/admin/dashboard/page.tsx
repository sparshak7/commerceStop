import ProductTable from "@/components/ProductTable"
import { Button } from "@/components/ui/button"
import { Link } from "next-view-transitions"

const page = async() => {
  
  return (
    <div className="flex flex-col gap-6">
      <div className="w-full flex justify-between items-center">
        <h1 className="font-bold text-2xl">All Products</h1>
        <Button variant="outline">
          <Link href="/admin/product/new">Add New Product</Link>
        </Button>
      </div>
      <ProductTable />
    </div>
  );
}
export default page