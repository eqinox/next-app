"use client";
import { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { MdSunny } from "react-icons/md";

export default function ThemeSwitcher() {
  // State to manage the theme
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Retrieve theme from localStorage and apply it
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
    setMounted(true); // Ensure the component is mounted
  }, []);

  useEffect(() => {
    // Apply theme changes to the document
    if (mounted) {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div
      className="relative flex h-8 w-16 cursor-pointer items-center justify-between rounded-full bg-neutral-500 p-1 dark:bg-neutral-800"
      onClick={toggleTheme}
    >
      {/* Circle */}
      <div
        className={`absolute flex h-6 w-6 transform items-center justify-center rounded-full bg-neutral-800 transition-transform duration-300 ease-in-out dark:bg-neutral-500 ${
          theme === "dark" ? "translate-x-8" : "translate-x-0"
        }`}
      >
        {theme === "light" && <FaMoon color="#737373" />}
        {theme === "dark" && <MdSunny color="#262626" />}
      </div>
    </div>
  );
}
