"use client";

import { updateIssue } from "@/actions/issue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IssueLabel, Issues } from "@/constants";
import { useCreateIssue } from "@/hooks/use-create-issue";
import { useRenameIssue } from "@/hooks/use-rename-issue";
import { cn } from "@/lib/utils";
import { ISSUELABEL, ISSUETYPE, Issue } from "@prisma/client";
import {
  CheckIcon,
  CirclePlay,
  Grip,
  Pencil,
  PlusIcon,
  Tag,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface IssueCardProps {
  issues: Issue[];
}

export const IssueCard = ({ issues }: IssueCardProps) => {
  const { onOpen } = useCreateIssue();
  const { onOpen: onRenameOpen } = useRenameIssue();
  const { data } = useSession();
  const params = useParams();

  const handleStatusSelect = async (id: string, status: ISSUETYPE) => {
    try {
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
        toast.success("Issue status updated successfully.");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  const handleLabelSelect = async (id: string, label: ISSUELABEL | null) => {
    try {
      toast.loading("Updating issue label...");
      const response = await updateIssue({
        id,
        userId: data?.user?.id!,
        workspaceId: params.workspaceId as string,
        values: {
          label,
        },
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Issue label updated successfully.");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
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
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <div
                        key={iss.id}
                        className="flex justify-between items-center border border-neutral-700 rounded-lg p-3"
                      >
                        <div className="flex flex-col gap-y-2">
                          <span className="flex gap-x-1 items-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <issue.Icon
                                  className={cn(
                                    "size-4 text-white rounded-full",
                                    issue.type === "DONE" && "bg-green-600 ",
                                    issue.type === "INPROGRESS" &&
                                      "bg-yellow-600",
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
                                          issue.type === "DONE" &&
                                            "bg-green-600 ",
                                          issue.type === "INPROGRESS" &&
                                            "bg-yellow-600",
                                          issue.type === "CANCELLED" &&
                                            "bg-red-600"
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
                            <span className="text-sm line-clamp-1">
                              {iss.title}
                            </span>
                          </span>
                          {iss.label && (
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Badge
                                  variant="secondary"
                                  className="flex items-center gap-x-1 w-fit"
                                >
                                  <div
                                    className={cn(
                                      "size-3 rounded-full",
                                      iss.label === "BUG" && "bg-red-600",
                                      iss.label === "FEATURE" &&
                                        "bg-purple-600",
                                      iss.label === "IMPROVEMENT" &&
                                        "bg-blue-600"
                                    )}
                                  />
                                  {iss.label}
                                </Badge>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {IssueLabel.map((label) => (
                                  <DropdownMenuItem
                                    key={label.type}
                                    className="cursor-pointer"
                                    onSelect={() => {
                                      if (iss.label !== label.type) {
                                        handleLabelSelect(iss.id, label.type);
                                      } else {
                                        handleLabelSelect(iss.id, null);
                                      }
                                    }}
                                  >
                                    <span className={label.className} />
                                    {label.name}
                                    {label.type === iss.label && (
                                      <CheckIcon className="size-4 text-green-600 ml-2" />
                                    )}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="border border-neutral-700"
                        >
                          <Grip className="size-4" />
                        </Button>
                      </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-40">
                      <ContextMenuSub>
                        <ContextMenuSubTrigger className="cursor-pointer">
                          <CirclePlay className="size-4 mr-1" /> Status
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                          {Issues.map((issue) => (
                            <ContextMenuItem
                              key={issue.type}
                              onSelect={() =>
                                handleStatusSelect(iss.id, issue.type)
                              }
                              className="cursor-pointer"
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
                            </ContextMenuItem>
                          ))}
                        </ContextMenuSubContent>
                      </ContextMenuSub>
                      <ContextMenuSub>
                        <ContextMenuSubTrigger className="cursor-pointer">
                          <Tag className="size-4 mr-1" /> Label
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                          {IssueLabel.map((label) => (
                            <ContextMenuItem
                              key={label.type}
                              className="cursor-pointer"
                              onClick={() => {
                                if (iss.label !== label.type) {
                                  handleLabelSelect(iss.id, label.type);
                                } else {
                                  handleLabelSelect(iss.id, null);
                                }
                              }}
                            >
                              <span className={label.className} />
                              {label.name}
                              {label.type === iss.label && (
                                <CheckIcon className="size-4 text-green-600 ml-2" />
                              )}
                            </ContextMenuItem>
                          ))}
                        </ContextMenuSubContent>
                      </ContextMenuSub>
                      <ContextMenuItem
                        onSelect={() =>
                          onRenameOpen(
                            iss.id,
                            params.workspaceId as string,
                            iss.title
                          )
                        }
                        className="cursor-pointer"
                      >
                        <Pencil className="size-4 mr-1" /> Rename
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem className="cursor-pointer text-white">
                        <Trash2 className="size-4 mr-1" /> Delete
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenu>
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
