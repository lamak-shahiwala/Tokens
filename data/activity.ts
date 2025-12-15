import { Activity } from "@/types/activity";

export const mockActivities: Activity[] = [
  {
    id: "tx-1",
    user: "strivn",
    status: "buy",
    amountShort: "7.1m",
    price: "$0.49",
    timeAgo: "11h",
  },
  {
    id: "tx-2",
    user: "strivn",
    status: "sell",
    amountShort: "7.1m",
    price: "$0.50",
    timeAgo: "11h",
  },
  {
    id: "tx-3",
    user: "ratpick",
    status: "buy",
    amountShort: "14m",
    price: "$0.41",
    timeAgo: "11h",
  },
];