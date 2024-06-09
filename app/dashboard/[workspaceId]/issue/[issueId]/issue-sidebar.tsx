"use client";

import { updateIssue } from "@/actions/issue";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IssueLabel, Issues } from "@/constants";
import { cn } from "@/lib/utils";
import { ISSUELABEL, ISSUETYPE, Issue } from "@prisma/client";
import { CheckIcon, CircleUserRound, PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export const getIconIndex = (status: ISSUETYPE) => {
  switch (status) {
    case ISSUETYPE.BACKLOG:
      return 0;
    case ISSUETYPE.TODO:
      return 1;
    case ISSUETYPE.INPROGRESS:
      return 2;
    case ISSUETYPE.DONE:
      return 3;
    case ISSUETYPE.CANCELLED:
      return 4;
    default:
      return 0;
  }
};

const IssueSidebar = ({
  issue,
  workspaceId,
}: {
  issue: Issue;
  workspaceId: string;
}) => {
  const Icon = Issues[getIconIndex(issue.status)].Icon;
  const { data } = useSession();

  const handleStatusSelect = async (id: string, status: ISSUETYPE) => {
    try {
      toast.loading("Updating issue status...");
      const response = await updateIssue({
        id,
        userId: data?.user?.id!,
        workspaceId: workspaceId as string,
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
        workspaceId: workspaceId as string,
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
    <aside className="max-md:hidden fixed top-0 right-0 z-50 w-[250px] h-full border-l border-l-slate-600 flex flex-col py-2 px-4 gap-y-8">
      <h1 className="w-full text-center text-xl font-bold">Properties</h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-x-2 w-fit">
          <Icon
            className={cn(
              "size-4 text-white rounded-full",
              issue.status === "DONE" && "bg-green-600 ",
              issue.status === "INPROGRESS" && "bg-yellow-600",
              issue.status === "CANCELLED" && "bg-red-600"
            )}
          />
          <span>{issue.status}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Issues.map((iss) => (
            <DropdownMenuItem
              key={iss.type}
              className="flex items-center justify-between cursor-pointer"
              onSelect={() => handleStatusSelect(issue.id, iss.type)}
            >
              <span className="flex gap-x-2 items-center">
                <Icon
                  className={cn(
                    "size-4 text-white rounded-full",
                    iss.type === "DONE" && "bg-green-600 ",
                    iss.type === "INPROGRESS" && "bg-yellow-600",
                    iss.type === "CANCELLED" && "bg-red-600"
                  )}
                />
                {iss.name}
              </span>
              {iss.type === issue.status && (
                <CheckIcon className="ml-1 size-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-fit">
          <Badge
            variant="secondary"
            className="flex items-center gap-x-1 w-fit"
          >
            {issue.label ? (
              <span
                className={cn(
                  "size-4 rounded-full",
                  issue.label === "BUG" && "bg-red-600",
                  issue.label === "FEATURE" && "bg-purple-600",
                  issue.label === "IMPROVEMENT" && "bg-blue-600"
                )}
              />
            ) : (
              <PlusIcon className="size-4" />
            )}
            {issue.label || "Add Label"}
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {IssueLabel.map((label) => (
            <DropdownMenuItem
              key={label.type}
              className="cursor-pointer"
              onSelect={() => {
                if (issue.label !== label.type) {
                  handleLabelSelect(issue.id, label.type);
                } else {
                  handleLabelSelect(issue.id, null);
                }
              }}
            >
              <span className={label.className} />
              {label.name}
              {label.type === issue.label && (
                <CheckIcon className="size-4 text-green-600 ml-2" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-x-2 w-fit">
          <CircleUserRound className="size-5" />
          Assign
        </DropdownMenuTrigger>
        <DropdownMenuContent>Yet to be done</DropdownMenuContent>
      </DropdownMenu>
    </aside>
  );
};

export default IssueSidebar;
