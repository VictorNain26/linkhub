"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { makePusherClient } from "@/lib/pusher";

export type HitsMap = Record<number, number>;

const LiveHitsContext = createContext<HitsMap | null>(null);
export const useLiveHits = () => {
  const ctx = useContext(LiveHitsContext);
  if (!ctx) throw new Error("useLiveHits must be inside <LiveHitsProvider>");
  return ctx;
};

export function LiveHitsProvider({
  tenantSlug,
  initial,
  children,
}: {
  tenantSlug: string;
  initial: HitsMap;
  children: React.ReactNode;
}) {
  const [hits, setHits] = useState<HitsMap>(initial);

  useEffect(() => {
    setHits(initial);
  }, [initial]);

  useEffect(() => {
    const pusher  = makePusherClient();
    const channel = pusher.subscribe(`tenant-${tenantSlug}`);

    channel.bind("click", ({ linkId }: { linkId: number }) => {
      setHits((h) => ({ ...h, [linkId]: (h[linkId] ?? 0) + 1 }));
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`tenant-${tenantSlug}`);
    };
  }, [tenantSlug]);

  return (
    <LiveHitsContext.Provider value={hits}>{children}</LiveHitsContext.Provider>
  );
}
