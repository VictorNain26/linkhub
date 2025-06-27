"use client";
import { useLiveHits } from "./LiveHitsContext";

export default function LiveTotalClicks() {
  const hits = useLiveHits();
  const total = Object.values(hits).reduce((sum, v) => sum + v, 0);
  return (
    <p className="text-lg font-semibold">
      Total: {total} clic{total > 1 ? "s" : ""}
    </p>
  );
}
