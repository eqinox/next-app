import PostsForm from "@/components/Posts/PostsForm";
import { createPost } from "@/lib/actions/posts";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CreatePostValidationErrorsType } from "@/types/posts";

const CreatePostPage: React.FC = () => {
  async function handleCreatePost(
    prevState: object,
    formData: FormData,
  ): Promise<{ errors: CreatePostValidationErrorsType } | void> {
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
