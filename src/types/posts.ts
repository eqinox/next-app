export type CreatePostValidationErrorsType = {
  title?: string;
  image?: string;
  content?: string;
};

export type PostType = {
  imageUrl: string;
  title: string;
  content: string;
  userId: number;
  id: number;
  createDate: string;
  updateDate: string;
};

export type PostActionState = {
  post?: PostType;
  errors?: CreatePostValidationErrorsType;
};
