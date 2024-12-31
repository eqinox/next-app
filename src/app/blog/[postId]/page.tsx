import { getPostById } from "@/lib/posts";
import ViewPostFullClient from "./ViewPostFullClient";
import { editPost } from "@/lib/actions/posts";
import { PostActionState } from "@/types/posts";
import { redirect } from "next/navigation";

export default async function ViewPostFull({
  params,
}: {
  params: Promise<{ postId: number }>;
}) {
  async function handleCreatePost(
    prevState: PostActionState,
    formData: FormData,
  ): Promise<PostActionState> {
    "use server";

    const response = await editPost(prevState, formData);

    if ("errors" in response) {
      return response;
    } else {
      redirect("/blog");
    }
  }

  const { postId } = await params;
  const post = await getPostById(postId);

  return <ViewPostFullClient post={post} action={handleCreatePost} />;
}
