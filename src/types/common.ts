export type UseActionStateType<T> = (
  prevState: T,
  formData: FormData,
) => T | Promise<T>;
