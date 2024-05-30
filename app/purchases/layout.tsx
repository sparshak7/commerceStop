import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CommerceStop - Purchase History",
  description:
    "Review all your past purchases in one convenient place. Track the status of current orders, revisit previous buys, and easily reorder your favorite products. At CommerceStop, we keep a detailed record of your shopping history to help you stay organized and make future shopping even easier. Thank you for being a valued customer!",
  alternates: {
    canonical: "/purchases",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
