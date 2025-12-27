"use client";

import { ReactNode } from "react";
import { mockApps } from "@/data/card";
import Carousel from "../Carousel";
import type { CardData } from "@/types/card";

interface SectionProps {
  title?: ReactNode;
  apps?: CardData[];
}

export default function Section({
  title = "Top apps in last 24h",
  apps = mockApps,
}: SectionProps) {
  return (
    <section className="w-full flex justify-center py-8 lg:py-12 bg-bg">
      <div className="w-full max-w-7xl px-4 lg:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            {typeof title === "string" ? (
              <h3 className="text-2xl md:text-3xl font-bold font-title text-gray-900">
                {title}
              </h3>
            ) : (
              title
            )}
          </div>
        </div>

        {/* Carousel */}
        <Carousel apps={apps} />
      </div>
    </section>
  );
}
