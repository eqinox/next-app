"use client";
import Link from "next/link";
import { LinkType } from "../types";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  linkItem: LinkType;
  children?: React.ReactNode;
}

export default function NavLink({ linkItem, children }: NavLinkProps) {
  const path = usePathname();
  return (
    <Link
      href={linkItem.url}
      className={`p-3 text-neutral-300 transition-colors duration-500 ease-in-out hover:bg-orange-950 ${path.startsWith(linkItem.url) ? "border-b-2 border-orange-300" : ""}`}
    >
      {children}
    </Link>
  );
}
