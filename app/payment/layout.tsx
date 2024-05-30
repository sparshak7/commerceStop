import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CommerceStop - After Payment",
  description:
    "Whether you've successfully placed an order or encountered an issue, we’ve got you covered. If your purchase was successful, you can track your order and get notified once it’s shipped. In case of an error, we'll help you troubleshoot and get your order back on track. Thank you for choosing CommerceStop!",
  alternates: {
    canonical: "/payment",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
