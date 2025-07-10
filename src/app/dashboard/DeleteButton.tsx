"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLink } from "@/actions/links";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteButton({
  id,
  tenantSlug,
}: {
  id: number;
  tenantSlug: string;
}) {
  const [pending, start] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    start(async () => {
      const fd = new FormData();
      fd.append("id", String(id));
      await deleteLink(fd, tenantSlug);
      router.refresh();
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={pending}
          className="h-7 px-2 text-xs"
        >
          {pending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            "Confirmer"
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirm(false)}
          disabled={pending}
          className="h-7 px-2 text-xs"
        >
          Annuler
        </Button>
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowConfirm(true)}
          className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
        >
          <Trash2 className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Supprimer</TooltipContent>
    </Tooltip>
  );
}
