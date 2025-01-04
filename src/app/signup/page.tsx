import React from "react";
import AuthForm from "@/components/Auth/AuthForm";
import { login, signup } from "@/lib/actions/auth-actions";
import { UserActionState, UserLoginActionState } from "@/types/user-types";
import { redirect } from "next/navigation";

const SignUp: React.FC = () => {
  async function handleCreateUser(
    prevState: UserActionState,
    formData: FormData,
  ): Promise<UserLoginActionState> {
    "use server";

    const response = await signup(prevState, formData);
    if ("errors" in response) {
      return response;
    }

    redirect("/blog");
  }

  async function handleLoginUser(
    prevState: UserActionState,
    formData: FormData,
  ): Promise<UserActionState> {
    "use server";

    const response = await login(prevState, formData);
    if ("errors" in response) {
      return response;
    }

    redirect("/blog");
  }

  return (
    <div className="flex flex-col items-center">
      <AuthForm signupAction={handleCreateUser} loginAction={handleLoginUser} />
    </div>
  );
};

export default SignUp;
