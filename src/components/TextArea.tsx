import React from "react";

interface InputFieldProps<T, U> {
  fieldLabel: string;
  state: U;
  errorFieldName: keyof T;
  stateFieldName: keyof U; // The name of the field, e.g., "title"
  errors: T; // Dynamic type for errors object
  type?: string; // Optional type for the input, defaults to "text"
}

const TextArea = <
  T extends Record<string, any>,
  U extends Record<string, any>,
>({
  fieldLabel,
  errorFieldName,
  stateFieldName,
  errors,
  state,
}: InputFieldProps<T, U>) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={stateFieldName as string}>{fieldLabel}</label>
      <textarea
        id={stateFieldName as string}
        name={stateFieldName as string}
        defaultValue={state[stateFieldName]}
        className={`fieldInput h-40 ${errors[errorFieldName] ? "border-red-500" : ""}`}
      />
      {errors[errorFieldName] && (
        <span className="text-red-500">{errors[errorFieldName]}</span>
      )}
    </div>
  );
};

export default TextArea;
