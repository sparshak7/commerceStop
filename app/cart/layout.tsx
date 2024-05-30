import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CommerceStop - Cart",
  description:
    "Review the items you have added to your cart before proceeding to checkout. Make sure you have everything you need, adjust quantities, and remove any items you no longer want. Ready to complete your purchase? Click on the checkout button to finalize your order. Happy shopping with CommerceStop!",
  alternates: {
    canonical: "/cart",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
