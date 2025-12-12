"use client";

import clsx from "clsx";

type Props = {
  status: "completed" | "pending";
  className?: string;
};

export default function ActivityStatusButton({ status, className }: Props) {
  const isCompleted = status === "completed";

  return (
    <span
      className={clsx(
        "inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium",
        isCompleted
          ? "text-[#34C759] bg-[#34C759]/10 ring-1 ring-[#34C759]"
          : "text-[#FF9500] bg-[#FF9500]/10 ring-1 ring-[#FF9500]",
        className
      )}
    >
      {isCompleted ? "Completed" : "Pending"}
    </span>
  );
}
