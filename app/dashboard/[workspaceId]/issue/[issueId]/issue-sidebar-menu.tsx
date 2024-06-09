"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ISSUELABEL, ISSUETYPE, Issue } from "@prisma/client";
import {
  CheckIcon,
  CircleUserRound,
  MenuIcon,
  PlusIcon,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "sonner";
import { updateIssue, deleteIssue } from "@/actions/issue";
import { useSession } from "next-auth/react";
import { IssueLabel, Issues } from "@/constants";
import { getIconIndex } from "./issue-sidebar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const IssueSidebarMenu = ({
  issue,
  workspaceId,
}: {
  issue: Issue;
  workspaceId: string;
}) => {
  const Icon = Issues[getIconIndex(issue.status)].Icon;
  const { data } = useSession();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const handleIssueDelete = async () => {
    try {
      toast.loading("Deleting issue...");
      const response = await deleteIssue({
        id: issue.id,
        userId: data?.user?.id!,
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

  if (!isMounted) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-y-12 w-[250px]">
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
            Assign
          </DropdownMenuTrigger>
          <DropdownMenuContent>Yet to be done</DropdownMenuContent>
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
      </SheetContent>
    </Sheet>
  );
};

export default IssueSidebarMenu;
