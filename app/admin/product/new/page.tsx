import GoBack from "@/components/GoBack";
import ProductForm from "@/components/ProductForm";

const page = () => {
  return (
    <div>
      <div className="flex items-center gap-4 mb-6 justify-center">
        <GoBack />
        <h1 className="text-3xl font-bold tracking-wide">
          Add Product
        </h1>
      </div>
      <ProductForm />
    </div>
  );
};
export default page;
