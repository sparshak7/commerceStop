"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export const revalidate = 0;

const Cookie = () => {
  const {user} = useKindeBrowserClient()

  const verifyCookie = (msg: string) => {
    if (msg === "Y") {
      localStorage.setItem("verify", "Y");
      setVerify("Y");
    }
    else {
      localStorage.setItem("verify", "N");
      setVerify("N");
    }
    window.location.reload();
  };

  const [verify, setVerify] = useState<null | string>(() =>
    localStorage.getItem("verify")
  );

  useEffect(() => {
    setVerify(localStorage.getItem("verify"));
  }, [verify]);

  return (
    <>
      {user && !verify && (
        <div className="fixed bottom-4 left-4 w-[275px] sm:w-[400px] md:w-[450px] lg:w-[500px] z-50 py-3 px-6 bg-background rounded-md border border-border">
          {/* Cookie
          <div>
            <Button onClick={verifyCookie}>Add</Button>
          </div> */}
          <div className="flex flex-col gap-4">
            <p>This website uses cookies to save some user preferences.</p>
            <div className="flex gap-4 items-center">
              <Button onClick={() => verifyCookie("Y")} className="bg-yellow-300">
                Accept
              </Button>
              <Button onClick={() => verifyCookie("N")} className="bg-red-400">
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
