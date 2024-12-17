"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function NavLogo() {
  const router = useRouter();
  return (
    <Image
      src={"/logo.svg"}
      alt="logo"
      fill
      priority
      className="cursor-pointer"
      onClick={() => router.push("/")}
    />
  );
}
