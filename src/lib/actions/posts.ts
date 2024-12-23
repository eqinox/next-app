import Database from "better-sqlite3";
import { storePost } from "../posts";
import { CreatePostValidationErrorsType, PostType } from "@/types/posts";
import { uploadImage } from "../cloudinary";

type CreatePostResponse =
  | { errors: CreatePostValidationErrorsType } // When there are validation errors
  | Database.RunResult; // When the post is successfully created

export async function createPost(
  prevState: object,
  formData: FormData,
): Promise<CreatePostResponse> {
  const title = formData.get("title") as string;
  const image = (formData.get("image") as File) || "";
  const content = formData.get("content") as string;

  const errors: CreatePostValidationErrorsType = {};

  if (!title || title.trim().length === 0) {
    errors.title = "Title cannot be empty";
  }

  if (image instanceof File) {
    if (image.size === 0) {
      errors.image = "Image cannot be empty.";
    } else if (!["image/png", "image/jpeg"].includes(image.type)) {
      errors.image = "Invalid file type. Only PNG and JPEG are allowed.";
    }
  } else {
    errors.image = "Invalid image upload";
  }

  if (!content || content.trim().length === 0) {
    errors.content = "Content cannot be empty";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  console.log(title, image, content);

  let imageUrl: string;
  try {
    imageUrl = await uploadImage(image);
  } catch (err) {
    throw new Error(
      "Image upload failed, post was not created. Please try again later",
    );
  }

  const paramsForPost: PostType = {
    imageUrl: imageUrl,
    title,
    content,
    userId: 1,
  };

  const post = await storePost(paramsForPost);
  return post;
}
