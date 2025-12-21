import React from "react";

type AdminCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  fillSpace?: boolean;
};

export default function AdminCard({
  title,
  children,
  className = "",
  fillSpace = false,
}: AdminCardProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-[2.5rem] p-6 shadow-sm flex flex-col gap-4 transition-all duration-300 w-full mb-3 lg:mb-5 ${
        fillSpace ? "flex-1" : ""
      } ${className}`}
    >
      {title && (
        <h3 className="font-title font-semibold text-lg text-gray-900 px-1">
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-4 font-body h-full">{children}</div>
    </div>
  );
}
