"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SuccessRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-full mt-60 mb:mt-68 flex justify-center items-center">
        <div className="flex flex-col gap-2 items-center">
          <p className="text-2xl font-bold">
            You have succesfully bought the product.
          </p>
          <p className="text-xl font-bold text-red-500">
            You will be redirected to the homepage in 5 seconds. Do not refresh
            the page.
          </p>
        </div>
    </div>
  );
};

export default SuccessRedirect;
