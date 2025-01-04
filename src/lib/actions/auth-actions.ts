"use server";
import {
  CreateUserValidationErrorsType,
  UserActionState,
  UserLoginActionState,
  UserTypeDB,
} from "@/types/user-types";
import { z, ZodError } from "zod";
import { SqliteError } from "better-sqlite3";

import {
  createAuthSession,
  createUser,
  destroySession,
  getUserByEmail,
} from "../auth-db";
import { hashUserPassword, verifyPassword } from "../hash";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const createUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email cannot be empty")
    .email("Please enter valid email"),
  password: z.string().min(6, "Please enter valid password"),
  firstName: z.string().min(2, "Please enter valid name"),
});

const loginUserSchema = z.object({
  email: z
    .string()
    .min(1, "Email cannot be empty")
    .email("Please enter valid email"),
  password: z.string().min(6, "Please enter valid password"),
});

function mapZodErrorsToCustomFormat(
  error: ZodError,
): CreateUserValidationErrorsType {
  const errorsMapped: CreateUserValidationErrorsType = {};
  error.errors.forEach((issue) => {
    const field = issue.path[0] as keyof CreateUserValidationErrorsType;
    errorsMapped[field] = issue.message;
  });
  return errorsMapped;
}

export async function signup(
  prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validationData = { email, password, firstName, lastName };

  try {
    createUserSchema.parse(validationData);
  } catch (error) {
    const zodErrors = mapZodErrorsToCustomFormat(error as ZodError);
    return {
      errors: zodErrors,
      user: {
        email,
        firstName,
        password,
        lastName,
      },
    };
  }

  const hashedPassword = hashUserPassword(password);

  const user: UserTypeDB = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
  };
  try {
    console.log("user before creating", user);
    const userResponse = await createUser(user);

    await createAuthSession(userResponse.id.toString());
  } catch (error) {
    console.log("catch case", error);
    if (
      error instanceof SqliteError &&
      error.code === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return {
        errors: {
          email: "Email already exist",
        },
      };
    }
  }

  return { user };
}

export async function login(
  prevState: UserActionState,
  formData: FormData,
): Promise<UserLoginActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validationData = { email, password };

  try {
    loginUserSchema.parse(validationData);
  } catch (error) {
    const zodErrors = mapZodErrorsToCustomFormat(error as ZodError);
    return {
      errors: zodErrors,
    };
  }

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        email: "Could not authenticate user, please check your credentials.",
      },
    };
  }

  const isValidPassword = verifyPassword(existingUser.password, password);
  if (!isValidPassword) {
    return {
      errors: {
        password: "Could not authenticate user, please check your credentials.",
      },
    };
  }

  await createAuthSession(existingUser.id.toString());
  return {};
}

export async function logout() {
  await destroySession();
  revalidatePath("/");
  redirect("/");
}
