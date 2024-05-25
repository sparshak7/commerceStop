"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const Opt = () => {
  const router = useRouter();
  const manageCookie = (msg: string) => {
    if (msg === "N") {
      if (localStorage.getItem("verify")) {
        localStorage.removeItem("verify");
        toast.success("Opted out succesfully.")
      } else {
        localStorage.setItem("verify", "N");
        toast.success("Opted out succesfully.")
      }
    } else {
      localStorage.setItem("verify", "Y");
      toast.success("Opted in succesfully.")
    }

    router.refresh()
  };

  return (
    <div className="p-4 rounded-2xl w-[300px] md:w-[500px] border-border bg-accent text-secondary-foreground">
      <p className="text-xl">
        Do you wish to opt in/out our usage to cookies for user preferences?
      </p>
      <div className="flex justify-end mt-8">
        {localStorage.getItem("verify") &&
          localStorage.getItem("verify") === "Y" && (
            <Button onClick={() => manageCookie("N")}>Opt Out</Button>
          )}
        {localStorage.getItem("verify") &&
          localStorage.getItem("verify") === "N" && (
            <Button onClick={() => manageCookie("Y")}>Opt In</Button>
          )}
        {!localStorage.getItem("verify") && (
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
