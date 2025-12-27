"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import Card from "./Card";
import type { CardData } from "@/types/card";

interface CarouselProps {
  apps: CardData[];
}

export default function Carousel({ apps }: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Check scroll position to enable/disable buttons
  const checkScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    setCanScrollPrev(container.scrollLeft > 0);
    setCanScrollNext(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScroll();
    container.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollByCard = (direction: "prev" | "next") => {
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector<HTMLElement>("[data-card]");
    if (!card) return;

    const scrollAmount = card.offsetWidth + 16; // gap-4 = 16px
    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  // Mouse/Touch drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollRef.current;
    if (!container) return;

    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeft(container.scrollLeft);
    container.style.cursor = "grabbing";
    container.style.userSelect = "none";
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = "grab";
      scrollRef.current.style.userSelect = "auto";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const container = scrollRef.current;
    if (!container) return;

    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    container.scrollLeft = scrollLeft - walk;
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      if (scrollRef.current) {
        scrollRef.current.style.cursor = "grab";
      }
    }
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="absolute -top-16 right-0 flex gap-2 z-10">
        <button
          onClick={() => scrollByCard("prev")}
          disabled={!canScrollPrev}
          className="p-2 rounded-full border border-border transition hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Previous card"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M15 19l-7-7 7-7"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </button>

        <button
          onClick={() => scrollByCard("next")}
          disabled={!canScrollNext}
          className="p-2 rounded-full border border-border transition hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Next card"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </button>
      </div>

      {/* Cards Container */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide cursor-grab active:cursor-grabbing select-none"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {apps.map((app) => (
          <div
            key={app.id || app.appName}
            data-card
            className="snap-start snap-always flex-shrink-0 w-[85%] sm:w-[70%] md:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
            style={{ scrollSnapStop: "always" }}
          >
            <Card data={app} />
          </div>
        ))}
      </div>
    </div>
  );
}
