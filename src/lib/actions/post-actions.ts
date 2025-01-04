import { storePost, updatePost } from "../posts-db";
import {
  CreatePostValidationErrorsType,
  PostActionState,
  PostType,
  PostTypeDB,
} from "@/types/post-types";
import { uploadImage } from "../cloudinary";

import { z, ZodError } from "zod";
import { getUserById, verifyAuth } from "../auth-db";

// Validation schema for createPost
export const createPostSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  content: z.string().min(1, "Content cannot be empty"),
  image: z
    .custom<File>((file) => file instanceof File && file.size > 0, {
      message: "Image cannot be empty",
    })
    .refine(
      (file) => ["image/png", "image/jpeg"].includes(file.type),
      "Invalid file type. Only PNG and JPEG are allowed.",
    ),
});

// Validation schema for editPost
export const editPostSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  content: z.string().min(1, "Content cannot be empty"),
});

function mapZodErrorsToCustomFormat(
  error: ZodError,
): CreatePostValidationErrorsType {
  const errorsMapped: CreatePostValidationErrorsType = {};
  error.errors.forEach((issue) => {
    const field = issue.path[0] as keyof CreatePostValidationErrorsType;
    errorsMapped[field] = issue.message;
  });
  return errorsMapped;
}

export async function createPost(
  prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const title = formData.get("title") as string;
  const image = (formData.get("image") as File) || "";
  const content = formData.get("content") as string;

  const validationData = { title, content, image };

  // Validate with Zod
  try {
    createPostSchema.parse(validationData);
  } catch (error) {
    const zodErrors = mapZodErrorsToCustomFormat(error as ZodError);
    return {
      errors: zodErrors,
      post: {
        title,
        content,
        imageUrl: prevState.post?.imageUrl || "",
      },
    };
  }

  let imageUrl: string;
  try {
    imageUrl = await uploadImage(image);
  } catch (err) {
    throw new Error(
      "Image upload failed, post was not created. Please try again later",
    );
  }

  const authSesstion = await verifyAuth();
  let userId = 1;
  if (authSesstion.session) {
    userId = (await getUserById(authSesstion.session?.userId as string)).id;
  }

  const post: PostTypeDB = {
    userId,
    imageUrl,
    title,
    content,
  };

  await storePost(post);

  return { post };
}

export async function editPost(
  prevState: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  const validationData = { title, content };

  // Validate with Zod
  try {
    editPostSchema.parse(validationData);
  } catch (error) {
    const zodErrors = mapZodErrorsToCustomFormat(error as ZodError);
    return {
      errors: zodErrors,
      post: {
        ...(prevState.post as PostType),
        title,
        content,
      },
    };
  }

  const post = {
    ...(prevState.post as PostType),
    title,
    content,
  };

  await updatePost(post);

  return { post };
}
