import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CommerceStop - Categories",
  description:
    "Discover a wide range of products tailored to your needs. Browse through our categories to find the latest items, exclusive deals, and top-rated products. Whether you're looking for electronics, fashion, home goods, or more, CommerceStop has it all. Enjoy a seamless shopping experience with detailed product information and customer reviews to help you make the best choice.",
  alternates: {
    canonical: "/categories",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
