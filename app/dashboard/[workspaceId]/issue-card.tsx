"use client";

import { Button } from "@/components/ui/button";
import { Issues } from "@/constants";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

export const IssueCard = () => {
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
              {issue.name}
            </span>
            <Button size="icon" variant="ghost">
              <PlusIcon className="size-5" />
            </Button>
          </div>
          <div className="w-full flex flex-col p-2">
            <Button size="icon" variant="secondary" className="w-full mt-2">
              <PlusIcon className="size-5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
