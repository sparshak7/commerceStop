import Opt from "@/components/Opt"
import { Button } from "@/components/ui/button"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { Link } from "next-view-transitions"
import Image from "next/image"
import { redirect } from "next/navigation"

const page = async () => {
  const {getUser, isAuthenticated} = getKindeServerSession()
  const auth = await isAuthenticated()
  if(!auth) {
    redirect("/")
  }

  const user = await getUser()
  return (
    <div className="h-full flex flex-col justify-center gap-6 items-center pb-28 md:pb-2 mt-20">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="flex flex-col gap-4 items-center">
        <Image
          src={user?.picture!}
          alt={user?.given_name!}
          height={100}
          width={100}
          className="object-contain rounded-full"
        />
        <p className="text-xl">
          {user?.given_name?.concat(" ", user?.family_name!)}
        </p>
        <p className="text-xl text-accent-foreground">{user?.email}</p>
        <Link
          href="/"
          className="p-3 border-border bg-secondary rounded-2xl text-accent-foreground"
        >
          Continue Browsing
        </Link>
        <Opt />
      </div>
    </div>
  );
}
export default page