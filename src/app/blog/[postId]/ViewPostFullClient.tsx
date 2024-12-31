"use client";
import Image from "next/image";
import { useActionState, useState } from "react";

import { CreatePostValidationErrorsType, PostType } from "@/types/posts";
import { PostActionState } from "@/types/posts";
import { UseActionStateType } from "@/types/common";
import InputField from "@/components/InputField";
import TextArea from "@/components/TextArea";

interface ViewPostFullClientProps {
  action: UseActionStateType<PostActionState>;
  post: PostType;
}

const ViewPostFullClient: React.FC<ViewPostFullClientProps> = ({
  action,
  post,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(action, { post: post });

  let errors: CreatePostValidationErrorsType = {};
  if (state.errors) {
    errors = state.errors;
  }

  let statePost: PostType = { ...post };
  if (state.post) {
    statePost = state.post;
  }

  return (
    <form className="mt-5 w-4/5" action={formAction}>
      <h1 className="flex flex-col text-4xl">
        <InputField
          errorFieldName="title"
          stateFieldName="title"
          errors={errors}
          fieldLabel="Title"
          state={statePost}
        />
      </h1>
      <div className="flex flex-col">
        <TextArea
          errorFieldName="content"
          stateFieldName="content"
          errors={errors}
          fieldLabel="Content"
          state={statePost}
        />
      </div>
      <div className="relative flex">
        <div className="relative my-2 h-64 w-64">
          <Image
            src={state.post?.imageUrl as string}
            alt="the image"
            quality={50}
            fill
            sizes="10vw"
            className="cursor-pointer"
            onClick={() => setIsModalOpen(true)} // Open modal on click
          />
        </div>
      </div>

      <div>
        <button className="btn" type="submit" disabled={isPending}>
          Save
        </button>
      </div>

      {/* Modal for full-screen image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={() => setIsModalOpen(false)} // Close modal on backdrop click
        >
          <div className="relative h-full w-full">
            <Image
              src={state.post?.imageUrl as string}
              alt="Full screen image"
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default ViewPostFullClient;
