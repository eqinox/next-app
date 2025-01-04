"use client";
import { useActionState, useEffect, useState } from "react";

import {
  CreatePostValidationErrorsType,
  PostType,
  PostTypeDB,
} from "@/types/post-types";
import InputField from "@/components/InputField";
import ImagePicker from "@/components/ImagePicker";
import { PostActionState } from "@/types/post-types";
import { UseActionStateType } from "@/types/common";
import TextArea from "../TextArea";

interface PostsFormProps {
  action: UseActionStateType<PostActionState>;
}

const PostsForm: React.FC<PostsFormProps> = ({ action }) => {
  const [state, formAction, isPending] = useActionState(action, {});
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (isPending) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : "."));
      }, 500); // Adjust the speed of the animation here
      return () => clearInterval(interval); // Clean up when isPending changes
    } else {
      setDots("."); // Reset dots when not pending
    }
  }, [isPending]);

  let errors: CreatePostValidationErrorsType = {};
  let post: PostTypeDB = state.post ?? {
    content: "",
    imageUrl: "",
    title: "",
  };

  if ("errors" in state) {
    errors = state.errors as CreatePostValidationErrorsType;
  }

  return (
    <form action={formAction} className="mt-10 w-2/4 text-xl">
      <div className="flex flex-col gap-4">
        <InputField
          errors={errors}
          state={post}
          fieldLabel="Title"
          errorFieldName="title"
          stateFieldName="title"
        />

        <TextArea
          errors={errors}
          state={post}
          fieldLabel="Content"
          stateFieldName="content"
          errorFieldName="content"
        />

        <ImagePicker fieldLabel="Image" errors={errors} fieldName="image" />

        <div className="mt-2">
          <button className="btn" type="reset">
            Reset
          </button>
          <button type="submit" className="btn ml-4" disabled={isPending}>
            {isPending ? (
              <span className="inline-block w-[140px] text-left">{`Creating post${dots}`}</span>
            ) : (
              "Create Post"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostsForm;
