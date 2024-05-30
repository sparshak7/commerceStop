import Link from "next/link"
import {BsGithub, BsLinkedin} from "react-icons/bs"

const Footer = () => {
  return (
    <div className="max-w-6xl mx-auto pt-4 md:pb-2 flex flex-col gap-4 items-center border-t border-border">
      <p className="text-sm sm:text-base md:text-lg">
        Made with ❤️ by Sparshak Nag.
      </p>
      <div className="flex items-center gap-6">
        <Link href="https://github.com/sparshak7" target="_blank">
          <BsGithub className="size-4 sm:size-5 md:size-6" />
        </Link>
        <Link
          href="https://www.linkedin.com/in/sparshak-nag-9211b314b/"
          target="_blank"
        >
          <BsLinkedin className="size-4 sm:size-5 md:size-6" />
        </Link>
      </div>
      <p className="text-accent-foreground text-sm sm:text-base md:text-lg italic opacity-50">
        @ CommerceStop | All Rights Reserved
      </p>
    </div>
  );
}
export default Footer