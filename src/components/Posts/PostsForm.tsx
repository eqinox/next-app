"use client";

import { useActionState, useEffect, useState } from "react";
import { CreatePostValidationErrorsType } from "@/types/posts";
import InputField from "@/components/InputField";
import ImagePicker from "@/components/ImagePicker";
type ActionType<T, U> = (...args: any[]) => U | Promise<U>;

interface PostsFormProps<T, U> {
  action: ActionType<T, U>;
}

const PostsForm: React.FC<PostsFormProps<object, object>> = ({ action }) => {
  const [state, formAction, isPending] = useActionState<
    { errors: CreatePostValidationErrorsType } | {}
  >(action, {});
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
  if ("errors" in state) {
    errors = state.errors;
  }

  return (
    <form action={formAction} className="mt-10 w-96 text-xl">
      <div className="flex flex-col gap-4">
        <InputField errors={errors} fieldLabel="Title" fieldName="title" />

        <InputField errors={errors} fieldLabel="Content" fieldName="content" />

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
