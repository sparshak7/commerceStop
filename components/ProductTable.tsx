import prisma from "@/app/lib/db";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Edit2, MoreVertical, Trash2, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Link } from "next-view-transitions";
import { ActiveToggleProductAdmin, DeleteProductAdmin } from "./ProductActions";

const ProductTable = async () => {
  const products = await prisma.product.findMany({
    select: {
      name: true,
      price: true,
      description: true,
      image: true,
      id: true,
      isAvailableForPurchase: true,
      createdAt: true,
      categories: true,
      _count: {select: {Cart: true}},
    },
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) {
    return (
      <p className="text-secondary-foreground text-center mt-6 font-bold">
        No products found
      </p>
    );
  }

  return (
    <div>
      <Table>
        <TableCaption>All products in CommerceStop.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <span className="sr-only">Availablity</span>
            </TableHead>
            <TableHead>Serial No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Image</TableHead>
            <TableHead className="w-0">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, id) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.isAvailableForPurchase ? (
                  <>
                    <span className="sr-only">Available</span>
                    <CheckCircle2 className="text-primary" />
                  </>
                ) : (
                  <>
                    <span className="sr-only">Unavailable</span>
                    <XCircleIcon className="text-destructive" />
                  </>
                )}
              </TableCell>
              <TableCell>{id + 1}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>
                <p className="line-clamp-2 w-full">{product.description}</p>
              </TableCell>
              <TableCell>
                {product.categories.length > 0 && product.categories.map((category, id) => (
                  <p key={id} className="line-clamp-2">{category},</p>
                ))}
              </TableCell>
              <TableCell>
                <Image
                  width={50}
                  height={50}
                  alt={product.name}
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product.image}`}
                />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <span className="sr-only">Actions</span>
                    <MoreVertical />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/product/edit/${product.id}`}>
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <ActiveToggleProductAdmin
                      id={product.id}
                      isAvailableForPurchase={product.isAvailableForPurchase}
                    />
                    <DeleteProductAdmin
                      id={product.id}
                      disabled={product._count.Cart > 0}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default ProductTable;
