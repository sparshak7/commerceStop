import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import "../globals.css"
import { redirect } from "next/navigation";


export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {isAuthenticated, getPermission} = getKindeServerSession()
  const isLoggedIn = await isAuthenticated()
  const requiredPermission = await getPermission("admin:perm");

  if(!isLoggedIn || !requiredPermission?.isGranted){
    return redirect("/")
  }

  return (
    <div className="max-w-5xl mx-auto">
      {children}
    </div>
  );
}
