import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CommerceStop - Profile",
  description:
    "Discover the ultimate hub for all your shopping needs. Manage your orders, track your shipments, and explore personalized recommendations right here on your profile page. Whether you're browsing the latest deals or checking out your wishlist, CommerceStop makes it easy to stay connected and informed. Enjoy a seamless shopping experience tailored just for you.",
  alternates: {
    canonical: "/profile",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
