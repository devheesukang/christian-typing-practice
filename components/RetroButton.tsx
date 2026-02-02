"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export default function RetroButton({ className = "", variant = "primary", ...props }: Props) {
  return (
    <button
      {...props}
      className={`retro-button rounded-lg px-4 py-2 text-sm font-semibold tracking-wide text-amber-900 ${
        variant === "secondary" ? "bg-[#e7eaf5] text-[#334155]" : ""
      } ${className}`}
    />
  );
}
