import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ViewTransitions } from "next-view-transitions";
import Navbar from "@/components/Navbar";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "./lib/db";
import { Toaster } from "react-hot-toast";
import BottomBar from "@/components/BottomBar";
import Footer from "@/components/Footer";
import { getCanonicalUrl } from "@/utils";

const dm_sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL(getCanonicalUrl()),
  title: "CommerceStop - Your One-Stop Shop",
  description:
    "Welcome to CommerceStop, your ultimate destination for all things ecommerce! Whether you're looking for the latest gadgets, trendy fashion, or everyday essentials, we've got you covered. Our user-friendly platform offers a seamless shopping experience with a wide range of high-quality products at unbeatable prices. Shop with confidence, knowing that our dedicated customer service team is here to support you every step of the way. Discover the joy of hassle-free online shopping at CommerceStop today!",
  openGraph: {
    images: ["/logo_white.png"],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { getPermission, getUser } = getKindeServerSession();

  const [user, requiredPermission] = await Promise.all([
    getUser(),
    getPermission("admin:perm"),
  ]);

  let cartCount = -1;

  if(user && user.id) {
    cartCount = await prisma.cart.count({ where: { kindeAuth: user?.id } })
  }

  return (
    <html lang="en">
      <ViewTransitions>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased pb-28 md:pb-0",
            dm_sans.variable
          )}
        >
          <Toaster />
          <Navbar
            adminPerm={requiredPermission?.isGranted}
            cartCount={cartCount}
          />
          <BottomBar
            adminPerm={requiredPermission?.isGranted}
            cartCount={cartCount}
          />
          <div className="max-w-5xl mx-auto">{children}</div>
        </body>
      </ViewTransitions>
    </html>
  );
}
