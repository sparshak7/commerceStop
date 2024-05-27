"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { X } from "lucide-react";

const Cookie = () => {
  const { user } = useKindeBrowserClient();

  const [verify, setVerify] = useState<null | string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("verify");
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setVerify(localStorage.getItem("verify"));
    }
  }, []);

  const verifyCookie = (msg: string) => {
    if (typeof window !== "undefined") {
      if (msg === "Y") {
        localStorage.setItem("verify", "Y");
        setVerify("Y");
      } else {
        localStorage.setItem("verify", "N");
        setVerify("N");
      }
      window.location.reload();
    }
  };

  return (
    <>
      {user && !verify && (
        <div className="fixed bottom-4 left-4 w-[275px] sm:w-[400px] md:w-[450px] lg:w-[500px] z-50 py-3 px-6 bg-background rounded-md border border-border">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm sm:text-base md:text-lg">This website uses cookies to save some user preferences.</p>
              <div
                className="cursor-pointer hover:bg-accent hover:rounded-full md:p-1"
                onClick={() => verifyCookie("N")}
              >
                <X className="size-6"/>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Button
                onClick={() => verifyCookie("Y")}
                variant="ghost"
                className="bg-yellow-500 bg-opacity-75 text-secondary"
              >
                Accept
              </Button>
              <Button
                onClick={() => verifyCookie("N")}
                variant="ghost"
                className="bg-red-500 bg-opacity-75 text-secondary"
              >
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Cookie;
