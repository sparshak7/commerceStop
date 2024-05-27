'use client'

import Image from "next/image"
import { Button } from "./ui/button";

const Banner = () => {

  const handleClick = () => {
    window.scrollTo({
      top: 400,
      behavior: "smooth"
    })
  }

  return (
    <div className="h-[200px] md:h-[300px] relative mb-4">
      <Image
        src="/banner.jpg"
        alt="banner"
        fill
        className="object-cover px-2 rounded-2xl opacity-55"
      />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-65">
        <div className="flex flex-col gap-4 items-center">
          <p className="text-xs sm:text-sm md:text-xl font-bold">Summer sale is on! Get 40% off on all products.</p>
          <Button variant="ghost" onClick={handleClick} className="bg-accent-foreground  text-secondary w-1/2">Start shopping</Button>
        </div>
      </div>
    </div>
  );
}
export default Banner