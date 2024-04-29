"use client";

import { cn } from "@/lib/utils";
import {
  LoginLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { Link } from "next-view-transitions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import { Loader2, Lock, Search, ShoppingCart } from "lucide-react";
import logo_white from "../public/logo_white.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { NavLinks } from "./Navbar";

type BottomBarProps = {
  adminPerm?: boolean;
  cartCount?: number;
};

const BottomBar = ({ adminPerm, cartCount }: BottomBarProps) => {
  const { user, isLoading, isAuthenticated } = useKindeBrowserClient();
  return (
    <div className="fixed bottom-0 right-0 w-full py-2 px-4 border-t border-gray-600 md:hidden z-[1000] bg-black">
      <nav className="flex justify-evenly items-center">
        {adminPerm && (
          <NavLinks href="/admin/dashboard">
            <Lock className="size-5" />
          </NavLinks>
        )}
        <NavLinks href="/search">
          <Search className="size-5" />
        </NavLinks>
        {cartCount !== -1 ? (
          <NavLinks
            href={`/cart/${user?.id}`}
          >
            <div className="relative py-2">
              <ShoppingCart className="size-5" />
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
            <ShoppingCart className="size-5" />
          </NavLinks>
        )}
      </nav>
    </div>
  );
};

export default BottomBar;
