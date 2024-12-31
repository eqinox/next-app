"use client";
import { useRouter } from "next/navigation";

export default function Create() {
  const router = useRouter();
  return (
    <button
      className="btn"
      onClick={() => {
        router.push("/blog/create");
      }}
    >
      Create new post
    </button>
  );
}
