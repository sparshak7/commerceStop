// "use server"

// import prisma from "@/app/lib/db";

// export async function GetPurchases({
//   search,
//   offset = 0,
//   limit = 2,
// }: {
//   search?: string | undefined;
//   offset?: number;
//   limit?: number;
// }) {
//   const data = await prisma.purchased.findMany({
//     where: { kindeAuth: search },
//     select: { Product: true, createdAt: true},
//     orderBy: { createdAt: "desc" },
//     skip: offset,
//     take: limit,
//   });

//   const totalCount = await prisma.purchased.count({
//     where: { kindeAuth: search },
//   });

//   const totalPages = Math.ceil(totalCount / limit);

//   return { data, totalCount, totalPages };
// }
