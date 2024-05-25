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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Loader2, Lock, Search, ShoppingCart } from "lucide-react";
import logo_white from "../public/logo_white.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type NavbarProps = {
  adminPerm?: boolean;
  cartCount?: number;
};

const Navbar = ({ adminPerm, cartCount }: NavbarProps) => {
  const { user, isLoading, isAuthenticated } = useKindeBrowserClient();

  return (
    <nav className="max-w-6xl mx-auto p-2 flex justify-between items-center gap-6 mb-12 border-b border-gray-600">
      <div>
        <Link href="/">
          {/* <h1 className="text-xl italic">
            {`Zephyr ${adminPerm ? "(Admin)" : ""}`}
          </h1> */}
          <Image alt="logo" src={logo_white} width={90} height={90} />
        </Link>
      </div>
      <div className="hidden items-center gap-8 md:flex">
        {adminPerm && (
          <NavLinks href="/admin/dashboard">
            <Lock className="size-5 sm:size-7" />
          </NavLinks>
        )}
        <NavLinks href="/search">
          <Search className="size-5 sm:size-7" />
        </NavLinks>
        {cartCount !== -1 ? (
          <NavLinks
            href={`/cart/${user?.id}`}
            // className="p-4 hover:text-secondary-foreground focus-visible:text-secondary-foreground select-none"
          >
            <div className="relative py-2">
              <ShoppingCart className="size-5 sm:size-7" />
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
            <ShoppingCart className="size-5 sm:size-7" />
          </NavLinks>
        )}
      </div>
      <div className="items-center gap-6 flex">
        {!isLoading ? (
          !isAuthenticated && (
            <LoginLink className="rounded-2xl p-2 border border-secondary bg-accent text-secondary-foreground">
              Login
            </LoginLink>
          )
        ) : (
          <Loader2 className="size-6 animate-spin" />
        )}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {user.picture && (
                <Image
                  width={40}
                  height={40}
                  alt="User Image"
                  src={user.picture}
                  className="rounded-full cursor-pointer"
                />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <LogoutLink className="text-red-500">Log Out</LogoutLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              {user?.picture && (
                <Image
                  width={30}
                  height={30}
                  alt="User Image"
                  src={user.picture}
                  className="rounded-full"
                />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>{user?.email && `Logged in as ${user.email}`}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </div>
    </nav>
  );
};

export function NavLinks(
  props: Omit<ComponentProps<typeof Link>, "className">
) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground hover:rounded-3xl select-none",
        pathname === props.href && "bg-accent text-primary rounded-3xl"
      )}
    ></Link>
  );
}

export default Navbar;
