import { Tooltip } from "@mantine/core";
import type React from "react";

interface PhotoCreditProps {
  label: React.ReactNode;
  className?: string;
}

export const PhotoCredit = ({ label, className = "" }: PhotoCreditProps) => (
  <Tooltip
    label={label}
    position="bottom-start"
    withArrow
    multiline
    w={220}
    color="dark"
    fz="xs"
  >
    <div
      className={`absolute top-4 right-4 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white ${className}`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    </div>
  </Tooltip>
);
