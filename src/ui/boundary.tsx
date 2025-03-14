import clsx from "clsx";
import React from "react";
import { useTheme } from "next-themes";

const Label = ({
  children,
  animateRerendering,
  color,
}: {
  children: React.ReactNode;
  animateRerendering?: boolean;
  color?: "default" | "pink" | "blue" | "violet" | "cyan" | "orange";
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={clsx(
        "rounded-full px-1.5 shadow-[0_0_1px_3px_black]",
        {
          // Dynamic theme-based colors
          "bg-gray-800 text-gray-300 dark:bg-gray-300 dark:text-gray-800":
            color === "default",
          "bg-vercel-pink text-white": color === "pink",
          "bg-vercel-blue text-white": color === "blue",
          "bg-vercel-cyan text-white": color === "cyan",
          "bg-vercel-violet text-violet-100": color === "violet",
          "bg-vercel-orange text-white": color === "orange",
          "animate-[highlight_1s_ease-in-out_1]": animateRerendering,
        }
      )}
    >
      {children}
    </div>
  );
};

export const Boundary = ({
  children,
  labels = ["children"],
  size = "default",
  color = "default",
  animateRerendering = true,
}: {
  children: React.ReactNode;
  labels?: string[];
  size?: "small" | "default";
  color?: "default" | "pink" | "blue" | "violet" | "cyan" | "orange";
  animateRerendering?: boolean;
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={clsx(
        "relative rounded-lg border border-dashed transition-all",
        {
          "p-3 lg:p-5": size === "small",
          "p-4 lg:p-9": size === "default",
          // Dynamic theme-aware borders
          "border-gray-700 dark:border-gray-300": color === "default",
          "border-vercel-pink": color === "pink",
          "border-vercel-blue": color === "blue",
          "border-vercel-cyan": color === "cyan",
          "border-vercel-violet": color === "violet",
          "border-vercel-orange": color === "orange",
          "animate-[rerender_1s_ease-in-out_1] text-vercel-pink":
            animateRerendering,
          // Ensure backgrounds adapt to theme
          "bg-white text-black dark:bg-gray-900 dark:text-white":
            color === "default",
        }
      )}
    >
      <div
        className={clsx(
          "absolute -top-2.5 flex gap-x-1 text-[9px] uppercase leading-4 tracking-widest",
          {
            "left-3 lg:left-5": size === "small",
            "left-4 lg:left-9": size === "default",
          }
        )}
      >
        {labels.map((label) => {
          return (
            <Label
              key={label}
              color={color}
              animateRerendering={animateRerendering}
            >
              {label}
            </Label>
          );
        })}
      </div>

      {children}
    </div>
  );
};
