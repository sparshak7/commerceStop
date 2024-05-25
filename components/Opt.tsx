"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const Opt = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [verify, setVerify] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      setVerify(localStorage.getItem("verify"));
    }
  }, []);

  const manageCookie = (msg: string) => {
    if (isClient) {
      if (msg === "N") {
        if (localStorage.getItem("verify")) {
          localStorage.removeItem("verify");
          toast.success("Opted out successfully.");
        } else {
          localStorage.setItem("verify", "N");
          toast.success("Opted out successfully.");
        }
      } else {
        localStorage.setItem("verify", "Y");
        toast.success("Opted in successfully.");
      }
      setVerify(localStorage.getItem("verify"));
      router.refresh();
    }
  };

  if (!isClient) {
    return
  }

  return (
    <div className="p-4 rounded-2xl w-[300px] md:w-[500px] border-border bg-accent text-secondary-foreground">
      <p className="text-xl">
        Do you wish to opt in/out of our usage of cookies for user preferences?
      </p>
      <div className="flex justify-end mt-8">
        {verify && verify === "Y" && (
          <Button onClick={() => manageCookie("N")}>Opt Out</Button>
        )}
        {verify && verify === "N" && (
          <Button onClick={() => manageCookie("Y")}>Opt In</Button>
        )}
        {!verify && (
          <div className="flex gap-4 items-center">
            <Button onClick={() => manageCookie("Y")} className="bg-yellow-300">
              Opt In
            </Button>
            <Button onClick={() => manageCookie("N")} className="bg-red-400">
              Opt Out
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Opt;
