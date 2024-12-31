"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";

interface ImagePickerProps<T> {
  fieldLabel: string;
  fieldName: keyof T; // The name of the field, e.g., "title"
  errors: T;
}

const ImagePicker = <T extends Record<string, any>>({
  fieldLabel,
  fieldName,
  errors,
}: ImagePickerProps<T>) => {
  const [pickedImage, setPickedImage] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handlePickClick = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPickedImage(null);
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.result) {
        setPickedImage(fileReader.result as string);
      }
    };

    fileReader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={fieldName as string}>{fieldLabel}</label>

      <input
        type="file"
        id={fieldName as string}
        name={fieldName as string}
        accept="image/png, image/jpeg"
        ref={imageInputRef}
        onChange={handleImageChange}
        className={`fieldInput hidden ${errors[fieldName] ? "border-red-500" : ""}`}
      />
      <div className="relative flex">
        <div className="relative flex h-32 w-36 items-center justify-center border-2 border-dashed border-orange-500 text-center">
          {pickedImage && (
            <Image
              src={pickedImage}
              alt="The image selected by the user"
              fill
              style={{ objectFit: "contain" }}
            />
          )}
          {!pickedImage && <div>No picked image</div>}
        </div>
        <button
          onClick={handlePickClick}
          type="button"
          className="btn absolute bottom-0 left-40 h-12"
        >
          Pick an image
        </button>
      </div>

      {errors[fieldName] && (
        <span className="text-red-500">{errors[fieldName]}</span>
      )}
    </div>
  );
};

export default ImagePicker;
