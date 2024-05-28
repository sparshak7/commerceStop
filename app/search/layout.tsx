import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CommerceStop - Search",
  description:
    "Welcome to the CommerceStop Search Page! Easily find exactly what you're looking for with our powerful and intuitive search tool. Simply enter keywords or phrases, and browse through a wide selection of high-quality products across various categories. Enjoy fast, accurate results and filter options to refine your search for a more personalized shopping experience. Start exploring now and discover great deals at CommerceStop!",
  alternates: {
    canonical: "/search",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
