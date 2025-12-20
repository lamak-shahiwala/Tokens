// Section: Top Apps in Last 24 Hours

"use client";

import { mockApps } from "@/data/card";
import Card from "../Card";
import type { CardData, Stat } from "@/types/card";
import { useRouter } from "next/navigation";

export default function Section({
  title = "Top apps in last 24h",
  apps = mockApps,
}: {
  title?: string;
  apps?: CardData[];
}) {
  const topFiveApps = apps.slice(0, 5);
  const router = useRouter();
  return (
    <section className="w-full flex justify-center py-5 md:py-6 lg:py-8">
      <div className="w-full max-w-6xl px-4">
        {/* Header row: title + small action */}
        <div className="flex items-baseline justify-between mb-4 sm:mb-5 lg:mb-6 gap-4">
          <h3 className="text-2xl md:text-3xl font-bold font-title text-gray-900">
            {title}
          </h3>
        </div>

        <ol>
          {topFiveApps.map((app) => (
            <li key={app.position ?? app.appName} className="list-none">
              {/* Card already renders its own rounded container and position badge */}
              <Card data={app} />
            </li>
          ))}
        </ol>
        <button
          onClick={() => {
            router.push("/leaderboard");
          }}
          className="w-full h-16 mt-5 border-2 rounded-full text-text-muted hover:shadow-md"
        >
          See all of {title.toLowerCase()}
        </button>
      </div>
    </section>
  );
}
