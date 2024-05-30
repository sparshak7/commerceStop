import { Loader2 } from "lucide-react";

const loading = () => {
  return (
    <div className="h-full mt-64 mb:mt-72 flex justify-center items-center overflow-hidden">
      <Loader2 className="size-8 animate-spin text-red-500" />
    </div>
  );
};
export default loading;
