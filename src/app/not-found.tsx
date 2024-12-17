import Image from "next/image";

export default function NotFound() {
  return (
    <div
      className="flex w-screen flex-col items-center justify-center"
      style={{ height: "calc(100vh - 80px)" }}
    >
      <div className="text-2xl">Page not found</div>
      <div className="relative h-1/2 w-1/2 text-white">
        <Image
          src={"/404-illustration.svg"}
          alt="404 not found"
          fill
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
