"use client";

import Image from "next/image";
import { FaRegTrashCan } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { WiTime3 } from "react-icons/wi";
import { useState } from "react";

import { PostType } from "@/types/post-types";
import Spinner from "../Spinner/Spinner";
import { UserType } from "@/types/user-types";

interface PostItemProps {
  post: PostType;
  loggedUser: UserType;
}

const PostItem = ({ post, loggedUser }: PostItemProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("are you sure you want to delete the post?") === false) {
      return;
    }
    setIsDeleting(true); // Show loading state
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post with ID ${post.id}`);
      }
      router.refresh();
      console.log(`Post with ID ${post.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting post:", error);
      setIsDeleting(false);
    } finally {
      setIsDeleting(false); // Show loading state
    }
  };

  const gotoEdit = () => {
    router.push(`/blog/${post.id}`);
  };

  let title = post.title.substring(0, 40);
  let content = post.content.substring(0, 55);

  return (
    <div className="relative flex h-40 w-96 flex-nowrap items-start rounded p-2 transition-all duration-300 hover:bg-neutral-700">
      <div className="relative mr-1 h-32 min-h-32 min-w-32 flex-shrink-0">
        <Image
          src={post.imageUrl}
          alt="image"
          fill
          className="cursor-pointer object-fill"
          sizes="10vw"
          onClick={() => gotoEdit()}
        />
      </div>
      <div className="flex flex-col">
        <h2
          className="cursor-pointer text-2xl hover:underline"
          onClick={() => gotoEdit()}
        >
          {title}
        </h2>
        <p className="flex items-center text-sm italic">
          <WiTime3 className="mr-2" />
          {post.createDate}
        </p>
        <p className="text-base">{content}</p>
      </div>

      <div className="absolute bottom-0 left-2">
        created by {post.createdBy.firstName} {post.createdBy.lastName}
      </div>

      {post.createdBy.id === loggedUser.id && (
        <div className="absolute bottom-2 right-2 flex">
          <span
            className="cursor-pointer text-red-600 hover:text-red-500"
            onClick={() => handleDelete()}
          >
            <FaRegTrashCan size={25} />
          </span>
        </div>
      )}

      {isDeleting && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default PostItem;
