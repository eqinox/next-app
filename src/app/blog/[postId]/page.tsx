import { PostType } from "@/types/posts";

interface ViewPostFullProps {
  params: {
    postId: string; // Matches the dynamic route folder name
  };
}

const ViewPostFull: React.FC<ViewPostFullProps> = ({ params }) => {
  return <div>id: {params.postId}</div>;
};

export default ViewPostFull;
