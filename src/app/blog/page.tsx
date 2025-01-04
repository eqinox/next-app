import { PostType } from "@/types/post-types";
import { getAllPosts } from "../../lib/posts-db";
import Create from "./Create";
import PostItem from "@/components/Posts/PostItem";
import { getUserById, verifyAuth } from "@/lib/auth-db";
import { UserType, UserTypeDB } from "@/types/user-types";

export default async function BlogPage() {
  const posts = (await getAllPosts()) as PostType[];

  const authSession = await verifyAuth();
  let user: UserType;
  if (authSession.session) {
    user = (await getUserById(
      authSession.session?.userId as string,
    )) as UserType;
  }

  return (
    <>
      <div className="mx-auto mt-5 flex w-4/5 flex-wrap gap-5">
        {posts.map((item, index) => (
          <PostItem post={item} key={index} loggedUser={user} />
        ))}
      </div>
      <Create />
    </>
  );
}
