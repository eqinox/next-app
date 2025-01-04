"use client";

import { useActionState, useEffect } from "react";

import { UseActionStateType } from "@/types/common";
import {
  CreateUserValidationErrorsType,
  UserActionState,
  UserLoginActionState,
  UserType,
} from "@/types/user-types";
import InputField from "../InputField";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface PostsFormProps {
  signupAction: UseActionStateType<UserActionState>;
  loginAction: UseActionStateType<UserLoginActionState>;
}

const AuthForm: React.FC<PostsFormProps> = ({ signupAction, loginAction }) => {
  const path = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const mode = searchParams?.get("mode") || "login";
  let action = loginAction;
  if (mode === "signup") {
    action = signupAction;
  }

  const [state, formAction, isPending] = useActionState(action, {});

  useEffect(() => {
    // If `mode` is missing, navigate to the correct URL
    if (!searchParams?.get("mode")) {
      const newUrl = `${path}?mode=signup`;
      router.replace(newUrl); // Replace history entry to avoid duplicate navigation
    }
  }, [searchParams, router, path]);

  let errors: CreateUserValidationErrorsType = {};

  if ("errors" in state) {
    errors = state.errors as CreateUserValidationErrorsType;
  }

  let user: UserType = {
    firstName: "",
    email: "",
    id: 1,
    password: "",
  };

  if ("user" in state) {
    user = state.user as UserType;
  }

  return (
    <form className="mt-10 w-2/4 max-w-72 text-xl" action={formAction}>
      <div className="mb-5 text-center">
        {mode === "signup" && <p>Sign Up</p>}
        {mode === "login" && <p>Login</p>}
      </div>

      <InputField
        errors={errors}
        state={user}
        fieldLabel="Email"
        errorFieldName="email"
        stateFieldName="email"
      />

      <InputField
        errors={errors}
        state={user}
        fieldLabel="Password"
        errorFieldName="password"
        stateFieldName="password"
        type="password"
      />

      {mode === "signup" && (
        <>
          <InputField
            errors={errors}
            state={user}
            fieldLabel="First Name"
            errorFieldName="firstName"
            stateFieldName="firstName"
          />

          <InputField
            errors={errors}
            state={user}
            fieldLabel="Last Name"
            errorFieldName="lastName"
            stateFieldName="lastName"
          />
        </>
      )}

      <div className="mt-2 text-center">
        <button disabled={isPending} className="btn">
          {mode === "login" ? "Login" : "Create Account"}
        </button>
        <p>
          {mode === "login" && (
            <Link href={`${path}/?mode=signup`}>Create an account</Link>
          )}
          {mode === "signup" && (
            <Link href={`${path}/?mode=login`}>
              Login with existing account
            </Link>
          )}
        </p>
      </div>
    </form>
  );
};

export default AuthForm;
