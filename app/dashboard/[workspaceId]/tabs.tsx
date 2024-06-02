"use client";

import { cn } from "@/lib/utils";
import { CopyPlus, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  workspaceId: string;
};

export const Tabs = ({ workspaceId }: Props) => {
  const pathname = usePathname();

  const issuesActive = pathname === `/dashboard/${workspaceId}`;
  const projectsActive = pathname === `/dashboard/${workspaceId}/projects`;

  return (
    <div className="mt-32 w-full h-full flex flex-col items-start px-2">
      <div className="flex flex-col w-full gap-y-2">
        <Link
          href={`/dashboard/${workspaceId}`}
          className={cn(
            "flex gap-x-2 items-center text-lg p-1 pl-3 rounded-md",
            issuesActive && "bg-slate-800"
          )}
        >
          <CopyPlus className="size-4" />
          Issues
        </Link>
        <Link
          href={`/dashboard/${workspaceId}/projects`}
          className={cn(
            "flex gap-x-2 items-center text-lg p-1 pl-3 rounded-md",
            projectsActive && "bg-slate-800"
          )}
        >
          <LayoutGrid className="size-4" />
          Projects
        </Link>
      </div>
    </div>
  );
};
