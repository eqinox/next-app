import { PostType } from "@/types/posts";
import { getAllPosts } from "../../lib/posts";
import Create from "./Create";
import PostItem from "@/components/Posts/PostItem";

export default async function BlogPage() {
  const posts = (await getAllPosts()) as PostType[];

  return (
    <>
      <div className="mx-auto flex w-4/5 flex-wrap gap-5">
        {posts.map((item, index) => (
          <PostItem post={item} key={index} />
        ))}
      </div>
      <Create />
    </>
  );
}
