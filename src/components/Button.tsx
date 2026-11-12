"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { fullWidth = false, className = "", children, ...props },
    ref,
  ) => {
    const baseStyles =
      "inline-flex min-h-11 items-center justify-center px-6 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F4D3A] rounded cursor-pointer bg-[#1F4D3A] text-white hover:bg-[#173B2C]";

    const widthStyles = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${widthStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
