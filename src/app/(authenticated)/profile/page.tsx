import { getUserById, verifyAuth } from "@/lib/auth-db";
import { redirect } from "next/navigation";

const Profile: React.FC = async () => {
  const authSession = await verifyAuth();

  if (!authSession.session) {
    return redirect("/signup");
  }

  const user = await getUserById(authSession.session?.userId as string);

  return (
    <div className="mt-5 text-center">
      <div>{user.firstName}</div>
      <div>{user.lastName}</div>
    </div>
  );
};

export default Profile;
