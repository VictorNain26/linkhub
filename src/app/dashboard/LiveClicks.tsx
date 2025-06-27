"use client";

import { useEffect, useState } from "react";
import { makePusherClient } from "@/lib/pusher";

type Props = {
  tenantSlug: string;
  initial: Record<number, number>;
};

export default function LiveClicks({ tenantSlug, initial }: Props) {
  const [hits, setHits] = useState(initial);

  useEffect(() => {
    const pusher = makePusherClient();
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
    <div className="text-xs text-gray-500 space-y-1">
      {Object.entries(hits).map(([id, c]) => (
        <div key={id}>
          {id}: {c} clic{c > 1 ? "s" : ""}
        </div>
      ))}
    </div>
  );
}
