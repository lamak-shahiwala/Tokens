"use client";

import ActivityStatusButton from "./ActivityStatusButton";
import { Activity } from "@/types/activity";

function Avatar({ user }: { user: string }) {
  // fallback avatar using first letter
  return (
    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
      {user.charAt(0).toUpperCase()}
    </div>
  );
}

function ActivityRow({ item }: { item: Activity }) {
  return (
    <div className="flex items-center justify-between py-3">
      {/* LEFT: Avatar + username */}
      <div className="flex items-center gap-3 min-w-0">
        <Avatar user={item.user} />

        <div className="min-w-0">
          <div className="text-sm font-medium text-text truncate">
            {item.user}
          </div>
        </div>
      </div>

      {/* STATUS BUTTON */}
      <div className="flex-1 flex justify-start pl-4">
        <ActivityStatusButton status={item.status} />
      </div>

      {/* AMOUNT */}
      <div className="w-16 text-right text-sm font-semibold text-text">
        {item.amountShort}
      </div>

      {/* PRICE */}
      <div className="w-20 text-right text-sm text-text-subtle">
        {item.price}
      </div>

      {/* TIME AGO */}
      <div className="w-10 text-right text-xs text-text-muted">
        {item.timeAgo}
      </div>
    </div>
  );
}

export default function ActivitiesList({ items }: { items: Activity[] }) {
  return (
    <div className="mt-2">
      {items.map((activity) => (
        <ActivityRow key={activity.id} item={activity} />
      ))}
    </div>
  );
}
