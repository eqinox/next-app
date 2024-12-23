import React from "react";

interface InputFieldProps<T> {
  fieldLabel: string;
  fieldName: keyof T; // The name of the field, e.g., "title"
  errors: T; // Dynamic type for errors object
  type?: string; // Optional type for the input, defaults to "text"
}

const InputField = <T extends Record<string, any>>({
  fieldLabel,
  fieldName,
  errors,
  type = "text", // Default type is "text"
}: InputFieldProps<T>) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldName as string}>{fieldLabel}</label>
      <input
        type={type} // Use the passed type or default to "text"
        id={fieldName as string}
        name={fieldName as string}
        className={`fieldInput ${errors[fieldName] ? "border-red-500" : ""}`}
      />
      {errors[fieldName] && (
        <span className="text-red-500">{errors[fieldName]}</span>
      )}
    </div>
  );
};

export default InputField;
