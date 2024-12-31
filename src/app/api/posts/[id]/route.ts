import { NextRequest, NextResponse } from "next/server";
import { deletePost } from "@/lib/posts";
import { revalidatePath } from "next/cache";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    await deletePost(Number(id)); // Perform the database deletion
    revalidatePath("/blog");
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 },
    );
  }
}
