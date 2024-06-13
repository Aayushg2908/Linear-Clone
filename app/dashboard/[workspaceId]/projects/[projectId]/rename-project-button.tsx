"use client";

import { useRenameProject } from "@/hooks/use-rename-project";
import { EditIcon } from "lucide-react";

const RenameProjectButton = ({
  title,
  summary,
  workspaceId,
  projectId,
}: {
  title: string;
  summary: string;
  workspaceId: string;
  projectId: string;
}) => {
  const { onOpen } = useRenameProject();

  return (
    <div className="flex items-center gap-x-2 group">
      <span className="font-bold text-lg md:pl-4 max-w-[200px] line-clamp-1">
        {title}
      </span>
      <EditIcon
        onClick={() => onOpen(projectId, workspaceId, title, summary)}
        className="size-5 hidden group-hover:block cursor-pointer"
      />
    </div>
  );
};

export default RenameProjectButton;
