"use client";

import { useRenameIssue } from "@/hooks/use-rename-issue";
import { EditIcon } from "lucide-react";

const RenameIssueButton = ({
  value,
  workspaceId,
  issueId,
}: {
  value: string;
  workspaceId: string;
  issueId: string;
}) => {
  const { onOpen } = useRenameIssue();

  return (
    <div className="flex items-center gap-x-2 group">
      <span className="font-bold text-lg md:pl-4 max-w-[200px] line-clamp-1">
        {value}
      </span>
      <EditIcon
        onClick={() => onOpen(issueId, workspaceId, value)}
        className="size-5 hidden group-hover:block cursor-pointer"
      />
    </div>
  );
};

export default RenameIssueButton;
