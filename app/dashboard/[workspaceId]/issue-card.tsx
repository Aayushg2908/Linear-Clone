"use client";

import { Button } from "@/components/ui/button";
import { Issues } from "@/constants";
import { useCreateIssue } from "@/hooks/use-create-issue";
import { cn } from "@/lib/utils";
import { Issue } from "@prisma/client";
import { Grip, PlusIcon } from "lucide-react";

interface IssueCardProps {
  issues: Issue[];
}

export const IssueCard = ({ issues }: IssueCardProps) => {
  const { onOpen } = useCreateIssue();

  return (
    <div className="mt-4 w-full flex flex-col sm:flex-row gap-4 sm:flex-wrap p-2 justify-center">
      {Issues.map((issue) => (
        <div
          key={issue.type}
          className="flex flex-col rounded-md border w-full sm:w-[300px] min-h-[200px]"
        >
          <div className="flex items-center justify-between border-b p-2">
            <span className="flex gap-x-2 items-center">
              <issue.Icon
                className={cn(
                  "size-5 text-white rounded-full",
                  issue.type === "DONE" && "bg-green-600 ",
                  issue.type === "INPROGRESS" && "bg-yellow-600",
                  issue.type === "CANCELLED" && "bg-red-600"
                )}
              />
              <span className="font-bold">{issue.name}</span>
            </span>
            <Button
              onClick={() => onOpen(issue.type)}
              size="icon"
              variant="ghost"
            >
              <PlusIcon className="size-5" />
            </Button>
          </div>
          <div className="w-full flex flex-col gap-y-1 p-2">
            {issues.map((iss) => (
              <>
                {iss.status === issue.type && (
                  <div
                    key={iss.id}
                    className="flex justify-between items-center border border-neutral-700 rounded-lg p-2"
                  >
                    <span className="flex gap-x-1 items-center">
                      <issue.Icon
                        className={cn(
                          "size-5 text-white rounded-full",
                          issue.type === "DONE" && "bg-green-600 ",
                          issue.type === "INPROGRESS" && "bg-yellow-600",
                          issue.type === "CANCELLED" && "bg-red-600"
                        )}
                      />
                      {iss.title}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="border border-neutral-700"
                    >
                      <Grip className="size-5" />
                    </Button>
                  </div>
                )}
              </>
            ))}
            <Button
              onClick={() => onOpen(issue.type)}
              size="icon"
              variant="secondary"
              className="w-full mt-4"
            >
              <PlusIcon className="size-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
