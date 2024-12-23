"use client";
import { redirect } from "next/navigation";

export default function Create() {
  return (
    <button
      className="btn"
      onClick={() => {
        redirect("/blog/create");
      }}
    >
      Create new post
    </button>
  );
}
