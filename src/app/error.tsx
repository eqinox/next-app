"use client";

interface ErrorProps {
  error: unknown;
}

const Error: React.FC<ErrorProps> = ({ error }) => {
  let errorMessage: string;

  if (error && typeof error === "object" && "message" in error) {
    errorMessage = (error as Error).message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    errorMessage = "An unknown error occurred";
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col items-center justify-center">
      <h1 className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-center text-5xl font-bold text-transparent">
        AN ERROR OCCURED!
      </h1>
      <p className="text-2xl">{errorMessage}</p>
    </div>
  );
};

export default Error;
