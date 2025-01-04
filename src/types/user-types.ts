export type UserType = {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  id: number;
};

export type UserTypeDB = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  id?: number;
};

export type CreateUserValidationErrorsType = {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
};

export type UserActionState = {
  user?: UserTypeDB;
  errors?: CreateUserValidationErrorsType;
};

export type UserLoginActionState = {
  errors?: CreateUserValidationErrorsType;
};
