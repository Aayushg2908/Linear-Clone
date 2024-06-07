"use client";

import { updateIssue } from "@/actions/issue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Issues } from "@/constants";
import { useCreateIssue } from "@/hooks/use-create-issue";
import { cn } from "@/lib/utils";
import { ISSUETYPE, Issue } from "@prisma/client";
import { CheckIcon, Grip, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface IssueCardProps {
  issues: Issue[];
}

export const IssueCard = ({ issues }: IssueCardProps) => {
  const { onOpen } = useCreateIssue();
  const { data } = useSession();
  const params = useParams();
  const [statusLoading, setStatusLoading] = useState(false);

  const handleStatusSelect = async (id: string, status: ISSUETYPE) => {
    try {
      setStatusLoading(true);
      toast.loading("Updating issue status...");
      const response = await updateIssue({
        id,
        userId: data?.user?.id!,
        workspaceId: params.workspaceId as string,
        values: {
          status,
        },
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success(response.success);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setStatusLoading(false);
      toast.dismiss();
    }
  };

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
                    <span className="flex gap-x-1 items-center line-clamp-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <issue.Icon
                            className={cn(
                              "size-4 text-white rounded-full",
                              issue.type === "DONE" && "bg-green-600 ",
                              issue.type === "INPROGRESS" && "bg-yellow-600",
                              issue.type === "CANCELLED" && "bg-red-600"
                            )}
                          />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {Issues.map((issue) => (
                            <DropdownMenuItem
                              key={issue.type}
                              className="flex items-center justify-between cursor-pointer"
                              onSelect={() =>
                                handleStatusSelect(iss.id, issue.type)
                              }
                            >
                              <span className="flex gap-x-2 items-center">
                                <issue.Icon
                                  className={cn(
                                    "size-4 text-white rounded-full",
                                    issue.type === "DONE" && "bg-green-600 ",
                                    issue.type === "INPROGRESS" &&
                                      "bg-yellow-600",
                                    issue.type === "CANCELLED" && "bg-red-600"
                                  )}
                                />
                                {issue.name}
                              </span>
                              {issue.type === iss.status && (
                                <CheckIcon className="ml-1 size-4 text-green-600" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <span className="text-sm">{iss.title}</span>
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="border border-neutral-700"
                    >
                      <Grip className="size-4" />
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
