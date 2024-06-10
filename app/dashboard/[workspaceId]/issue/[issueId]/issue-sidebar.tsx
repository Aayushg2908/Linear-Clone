"use client";

import { assignIssue, deleteIssue, updateIssue } from "@/actions/issue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IssueLabel, Issues } from "@/constants";
import { cn } from "@/lib/utils";
import { ISSUELABEL, ISSUETYPE, Issue, User } from "@prisma/client";
import {
  CheckIcon,
  CircleUserRound,
  PlusIcon,
  Trash2,
  UserCircleIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  members,
}: {
  issue: Issue;
  workspaceId: string;
  members: User[];
}) => {
  const Icon = Issues[getIconIndex(issue.status)].Icon;
  const router = useRouter();

  const handleStatusSelect = async (id: string, status: ISSUETYPE) => {
    try {
      toast.loading("Updating issue status...");
      const response = await updateIssue({
        id,
        workspaceId: workspaceId,
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
        workspaceId: workspaceId,
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

  const handleIssueDelete = async () => {
    try {
      toast.loading("Deleting issue...");
      const response = await deleteIssue({
        id: issue.id,
        workspaceId: workspaceId,
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Issue deleted successfully.");
        router.push(`/dashboard/${workspaceId}`);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  const handleIssueAssign = async ({
    userId,
    issueId,
    name,
    type,
  }: {
    userId: string;
    issueId: string;
    name: string;
    type: "ASSIGN" | "REMOVE";
  }) => {
    try {
      toast.loading(
        `${type === "ASSIGN" ? "Assigning" : "Unassigning"} issue...`
      );
      const response = await assignIssue({
        userId,
        issueId,
        workspaceId,
        type,
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        if (type === "ASSIGN") {
          toast.success(`Issue assigned to ${name} successfully.`);
        } else if (type === "REMOVE") {
          toast.success(`Issue unassigned from ${name} successfully.`);
        }
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
                <iss.Icon
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
          Assign To
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {members.map((member) => (
            <DropdownMenuItem
              key={member.id}
              className="cursor-pointer flex items-center gap-x-1"
              onSelect={() => {
                if (issue.assignedTo.includes(member.id)) {
                  handleIssueAssign({
                    userId: member.id,
                    issueId: issue.id,
                    name: member.name!,
                    type: "REMOVE",
                  });
                } else {
                  handleIssueAssign({
                    userId: member.id,
                    issueId: issue.id,
                    name: member.name!,
                    type: "ASSIGN",
                  });
                }
              }}
            >
              {member.image ? (
                <Image
                  src={member.image}
                  alt="user-image"
                  width={30}
                  height={30}
                  className="size-4 rounded-full"
                />
              ) : (
                <UserCircleIcon className="size-4 rounded-full text-slate-300" />
              )}
              <span className="text-sm">{member.name}</span>
              {issue.assignedTo.includes(member.id) && (
                <CheckIcon className="size-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-fit bg-red-600 hover:bg-red-700 text-white">
            <Trash2 className="size-5 mr-1" />
            Delete Issue
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this Issue?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              issue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleIssueDelete}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};

export default IssueSidebar;
