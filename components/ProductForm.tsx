'use client'
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { addProduct, editProduct } from "@/actions/product-actions";
import { Product } from "@prisma/client";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";

type EditProductFormProps = {
  product?: Product | null;
}

const ProductForm = ({product}: EditProductFormProps) => {
  const [error, action] = useFormState(
    product == null ? addProduct : editProduct.bind(null, product.id), {}
  );

  const presentCategories = product?.categories.join(", ")

  return (
    <form className="space-y-8" action={action}>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-secondary-foreground">
          Name
        </Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Enter product name"
          autoComplete="off"
          className="text-secondary-foreground"
          defaultValue={product?.name || ""}
        />
        {error.name && <p className="text-red-500">{error.name}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="price" className="text-secondary-foreground">
          Price
        </Label>
        <Input
          inputMode="numeric"
          id="price"
          name="price"
          placeholder="Enter price"
          autoComplete="off"
          className="text-secondary-foreground"
          defaultValue={product?.price || ""}
        />
        {error.price && <p className="text-red-500">{error.price}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description" className="text-secondary-foreground">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter product description"
          autoComplete="off"
          className="text-secondary-foreground"
          defaultValue={product?.description || ""}
        />
        {error.description && (
          <p className="text-red-500">{error.description}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="image" className="text-secondary-foreground">
          Image
        </Label>
        <Input
          type="file"
          id="image"
          name="image"
          className="text-secondary-foreground file:bg-secondary file:text-secondary-foreground file:mr-4 file:cursor-pointer"
        />
        {product?.image ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${product.image}`}
            width={250}
            height={250}
            alt={product?.name}
          />
        ) : "Loading"}
        {error.image && <p className="text-red-500">{error.image}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="categories" className="text-secondary-foreground">
          Categories (comma separated)
        </Label>
        <Input
          type="text"
          id="categories"
          name="categories"
          autoComplete="off"
          className="text-secondary-foreground"
          defaultValue={presentCategories || ""}
        />
        <div className="flex items-center gap-2 mt-2">
          {product?.categories &&
            product.categories.map((category, id) => (
              <Badge key={id} className="bg-accent text-secondary-foreground">
                {category}
              </Badge>
            ))}
        </div>

        {error.categories && <p className="text-red-500">{error.categories}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      variant="outline"
      disabled={pending}
      className="w-full bg-primary text-secondary"
      type="submit"
    >
      {pending ? <Loader2 className="animate-spin size-4 text-black"/> : "Save"}
    </Button>
  );
}
export default ProductForm