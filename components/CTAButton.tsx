"use client";

import React from "react";
import { useModal } from "@/app/providers/ModalProvider";

type CTAButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export default function CTAButton({
  children,
  className = "",
}: CTAButtonProps) {
  const { openSwap } = useModal();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openSwap();
      }}
      className={`inline-flex items-center justify-center px-8 py-3 rounded-full font-semibold shadow-sm bg-primary text-white hover:bg-[#28a84d] ${className}`}
    >
      {children}
    </button>
  );
}
