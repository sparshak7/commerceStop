import prisma from "@/app/lib/db";
import GoBack from "@/components/GoBack";
import ProductForm from "@/components/ProductForm";

type EditProductProps = {
  params: {
    id: string;
  };
};

const EditProduct = async ({ params }: EditProductProps) => {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  return (
    <div>
      <div className="flex items-center gap-4 mb-6 justify-center">
        <GoBack />
        <h1 className="text-3xl font-bold tracking-wide">Edit Product</h1>
      </div>
      <ProductForm product={product} />
    </div>
  );
};

export default EditProduct;
