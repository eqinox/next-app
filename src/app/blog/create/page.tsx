import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import PostsForm from "@/components/Posts/PostsForm";
import { createPost } from "@/lib/actions/posts";
import { PostActionState } from "@/types/posts";

const CreatePostPage: React.FC = () => {
  async function handleCreatePost(
    prevState: PostActionState,
    formData: FormData,
  ): Promise<PostActionState> {
    "use server";

    const response = await createPost(prevState, formData);
    if ("errors" in response) {
      return response;
    }

    revalidatePath("/blog");
    redirect("/blog");
  }

  return <PostsForm action={handleCreatePost} />;
};

export default CreatePostPage;
