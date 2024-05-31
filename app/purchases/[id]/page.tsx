import { Link } from "next-view-transitions";
import Image from "next/image";
import Pagination from "../../../components/Pagination";
import prisma from "@/app/lib/db";

type PurchaseProps = {
  params: {
    id: string;
  };
  searchParams: {
    page?: string;
    order?: string;
    limit?: string;
  };
};

const Purchases = async ({ params, searchParams }: PurchaseProps) => {
  const currentPage = Number(searchParams?.page) || 1;
  const limit = Number(searchParams?.limit) || 5;
  const offset = (currentPage - 1) * limit;

  const currentOrder = searchParams.order === "asc" ? "asc" : "desc";

  // const { data, totalPages, totalCount } = await GetPurchases({
  //   offset,
  //   search: params.id,
  //   limit,
  // });

  const [data, totalCount] = await prisma.$transaction([
    prisma.purchased.findMany({
      where: { kindeAuth: params.id },
      select: { Product: true, createdAt: true, quantity: true, pricePaid: true },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.purchased.count({ where: { kindeAuth: params.id } }),
  ])

  const totalPages = Math.ceil(totalCount / limit);

  if (totalCount === 0) {
    return (
      <div className="p-2 mt-60 mb:mt-72 flex justify-center items-center text-xl md:text-2xl text-center">
        You have not purchased anything yet.
      </div>
    );
  }

  return (
    <div className="pb-6 px-4 md:pb-2">
      <div className="flex items-center justify-between gap-2 mb-6">
        <h1 className="mb-6 text-2xl">Your Purchase History</h1>
        {/* <Choose currOrder={currentOrder}/> */}
      </div>
      <div className="flex flex-col gap-4">
        {data.length === 0 ? (
          <p className="text-center">No more records found.</p>
        ) : (
          data.map((item) => (
            <div
              className="flex justify-between items-center md:hover:bg-accent border-b border-accent py-3 px-2 rounded-2xl mb-4"
              key={item.Product?.id}
            >
              <div className="flex gap-4 items-center">
                <Link href={`/products/${item.Product?.id}`}>
                  <div className="relative h-[80px] w-[80px]">
                    <Image
                      fill={true}
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Zephyr-products/${item.Product?.image}`}
                      alt={item.Product?.name!}
                      className="object-contain"
                    />
                  </div>
                </Link>

                <div className="flex flex-col gap-2">
                  <h2 className="line-clamp-1 md:line-clamp-none">
                    {item.Product?.name}
                  </h2>
                  <h2 className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </h2>
                  <h2 className="text-sm text-gray-500">
                    Price paid: 
                    <span className="text-red-400 ml-1">
                       ₹{new Intl.NumberFormat("en-IN").format(item.pricePaid)}
                    </span>
                  </h2>
                  <h2 className="line-clamp-2 md:line-clamp-none">
                    Purchased on:{" "}
                    {`${new Intl.DateTimeFormat("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                      timeZone: "Asia/Kolkata",
                    }).format(item.createdAt)}`}
                  </h2>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Pagination total={totalPages} />
    </div>
  );
};
export default Purchases;
