"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { GoInfo } from "react-icons/go";

/* -------------------------- Tooltip --------------------------- */

type InfoTooltipProps = { text: string };

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const [open, setOpen] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [hAlign, setHAlign] = useState<"center" | "left" | "right">("center");

  // Detect touch devices
  useEffect(() => {
    setIsTouch(typeof window !== "undefined" && "ontouchstart" in window);
  }, []);

  // Close tooltip on outside tap (mobile)
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open]);

  const updatePosition = () => {
    if (!wrapperRef.current || !tooltipRef.current) return;

    const wrapperRect = wrapperRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    if (wrapperRect.top < tooltipRect.height + 16) {
      setPosition("bottom");
    } else if (viewportHeight - wrapperRect.bottom < tooltipRect.height + 16) {
      setPosition("top");
    } else {
      setPosition("top");
    }

    const leftIfCentered =
      wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2;
    const rightIfCentered = leftIfCentered + tooltipRect.width;

    if (leftIfCentered < 8) {
      // would overflow left -> align to left
      setHAlign("left");
    } else if (rightIfCentered > viewportWidth - 8) {
      // would overflow right -> align to right
      setHAlign("right");
    } else {
      setHAlign("center");
    }
  };

  const handleOpen = () => {
    updatePosition();
    setOpen(true);
  };

  const triggerProps = isTouch
    ? {
        onClick: () => setOpen((v) => !v),
      }
    : {
        onMouseEnter: handleOpen,
        onMouseLeave: () => setOpen(false),
        onFocus: handleOpen,
        onBlur: () => setOpen(false),
      };

  return (
    <div ref={wrapperRef} className="relative inline-flex" {...triggerProps}>
      <span
        role="button"
        aria-label="More info"
        className="flex items-center justify-center cursor-pointer"
      >
        <GoInfo size={14} className="text-text-muted" />
      </span>

      <div
        ref={tooltipRef}
        className={`pointer-events-none absolute z-50 max-w-xs w-60 sm:w-64 rounded-lg border border-gray-200 bg-white px-3 py-2
                    text-xs text-gray-700 shadow-lg transition-opacity duration-150
        ${open ? "opacity-100" : "opacity-0"}
        ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"}
        ${
          hAlign === "center"
            ? "left-1/2 -translate-x-1/2"
            : hAlign === "left"
            ? "left-0"
            : "right-0"
        }`}
        style={{
          maxWidth: "16rem",
        }}
      >
        {text}
        <div
          className={`absolute h-2 w-2 rotate-45 bg-white border-gray-200
          ${
            position === "top"
              ? "top-full -mt-[3px] border-l border-b"
              : "bottom-full -mb-[3px] border-r border-t"
          }
          ${
            hAlign === "center"
              ? "left-1/2 -translate-x-1/2"
              : hAlign === "left"
              ? "left-3"
              : "right-3"
          }`}
        />
      </div>
    </div>
  );
};

/* -------------------------- Field Label --------------------------- */

type FieldLabelProps = {
  label: string;
  required?: boolean;
};

export const FieldLabel: React.FC<FieldLabelProps> = ({ label, required }) => (
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {label}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

/* -------------------------- Section Header --------------------------- */

type SectionHeaderProps = {
  title: string;
  tooltip?: string;
  isOpen: boolean;
  onToggle: () => void;
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  tooltip,
  isOpen,
  onToggle,
}) => (
  <button
    type="button"
    onClick={onToggle}
    className="flex w-full items-center justify-between py-4 border-b border-border cursor-pointer"
  >
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-text-muted">{title}</span>
      {tooltip && <InfoTooltip text={tooltip} />}
    </div>
    {isOpen ? (
      <ChevronUp size={18} className="text-gray-400" />
    ) : (
      <ChevronDown size={18} className="text-gray-400" />
    )}
  </button>
);

/* -------------------------- Option Card --------------------------- */

type OptionCardProps = {
  label: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  className?: string;
};

export const OptionCard: React.FC<OptionCardProps> = ({
  label,
  selected,
  onClick,
  className = "",
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`py-4 px-2 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2
      ${
        selected
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
      } ${className}`}
  >
    {label}
  </button>
);
