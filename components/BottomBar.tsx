"use client";

import {
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { Lock, ReceiptIndianRupee, Search, ShoppingCart } from "lucide-react";
import { NavLinks } from "./Navbar";

type BottomBarProps = {
  adminPerm?: boolean;
  cartCount?: number;
};

const BottomBar = ({ adminPerm, cartCount }: BottomBarProps) => {
  const { user } = useKindeBrowserClient();
  return (
    <div className="fixed bottom-0 right-0 w-full py-2 px-4 border-t border-accent md:hidden z-[49] bg-black">
      <nav className="flex justify-evenly items-center">
        {adminPerm && (
          <NavLinks href="/admin/dashboard">
            <Lock className="size-6" />
          </NavLinks>
        )}
        <NavLinks href="/search">
          <Search className="size-6" />
        </NavLinks>
        {user && cartCount !== -1 ? (
          <NavLinks href={`/cart/${user?.id}`}>
            <div className="relative py-2">
              <ShoppingCart className="size-6" />
              {cartCount! > 0 && (
                <div className="absolute -top-1 -right-4">
                  <p className="flex h-1 w-1 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">
                    {cartCount}
                  </p>
                </div>
              )}
            </div>
          </NavLinks>
        ) : (
          <NavLinks href="/api/auth/login">
            <ShoppingCart className="size-6" />
          </NavLinks>
        )}
        {user ? (
          <NavLinks href={`/purchases/${user?.id}`}>
            <ReceiptIndianRupee className="size-6" />
          </NavLinks>
        ) : (
          <NavLinks href="/api/auth/login">
            <ReceiptIndianRupee className="size-6" />
          </NavLinks>
        )}
      </nav>
    </div>
  );
};

export default BottomBar;
