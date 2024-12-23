"use client";

import { CiEdit } from "react-icons/ci";
import Image from "next/image";
import { FaRegTrashCan } from "react-icons/fa6";

import { PostType } from "@/types/posts";

interface PostItemProps {
  post: PostType;
}

const PostItem = ({ post }: PostItemProps) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete post with ID ${post.id}`);
      }

      console.log(`Post with ID ${post.id} deleted successfully`);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="relative flex h-52 w-52 flex-nowrap">
      <div className="relative h-32 w-32">
        <Image
          src={post.imageUrl}
          alt="image"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="flex flex-col">
        <h2 className="text-3xl">{post.title}</h2>
        <p className="text-lg">{post.content}</p>
      </div>

      <div className="absolute bottom-2 right-2 flex">
        <span className="cursor-pointer text-yellow-600 hover:text-yellow-400">
          <CiEdit size={25} />
        </span>
        <span
          className="cursor-pointer text-red-600 hover:text-red-500"
          onClick={() => handleDelete()}
        >
          <FaRegTrashCan size={25} />
        </span>
      </div>
    </div>
  );
};

export default PostItem;
