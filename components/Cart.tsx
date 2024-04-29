// import { ReactNode } from "react"
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Label } from "./ui/label";
// import { Input } from "./ui/input";
// import prisma from "@/app/lib/db";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// type CartProps = {
//   children: ReactNode;
// }

// const Cart = async({children}: CartProps) => {
//   const {getUser} = getKindeServerSession()
//   const user = await getUser()
//   const partialCart = await prisma.cart.findMany({where: {kindeAuth: user?.id}})
//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         {children}
//       </PopoverTrigger>
//       <PopoverContent className="w-300">
//         <div className="grid gap-4">
//           <div className="space-y-2">
//             <h4 className="font-medium leading-none">Dimensions</h4>
//             <p className="text-sm text-muted-foreground">
//               Set the dimensions for the layer.
//             </p>
//           </div>
//           <div className="grid gap-2">
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="width">Width</Label>
//               <Input
//                 id="width"
//                 defaultValue="100%"
//                 className="col-span-2 h-8"
//               />
//             </div>
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="maxWidth">Max. width</Label>
//               <Input
//                 id="maxWidth"
//                 defaultValue="300px"
//                 className="col-span-2 h-8"
//               />
//             </div>
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="height">Height</Label>
//               <Input
//                 id="height"
//                 defaultValue="25px"
//                 className="col-span-2 h-8"
//               />
//             </div>
//             <div className="grid grid-cols-3 items-center gap-4">
//               <Label htmlFor="maxHeight">Max. height</Label>
//               <Input
//                 id="maxHeight"
//                 defaultValue="none"
//                 className="col-span-2 h-8"
//               />
//             </div>
//           </div>
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// }
// export default Cart