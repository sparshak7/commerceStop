import Link from "next/link"
import {BsGithub, BsLinkedin} from "react-icons/bs"

const Footer = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-1 md:p-4 flex flex-col gap-4 items-center border-t border-border">
      <p className="text-md sm:text-lg md:text-xl">Made with ❤️ by Sparshak Nag.</p>
      <div className="flex items-center gap-6">
        <Link href="#" target="_blank">
          <BsGithub className="size-6" />
        </Link>
        <Link href="#" target="_blank">
          <BsLinkedin className="size-6" />
        </Link>
      </div>
      <p className="text-accent-foreground text-md sm:text-lg md:text-xl italic opacity-50">@ CommerceStop | All Rights Reserved</p>
    </div>
  );
}
export default Footer