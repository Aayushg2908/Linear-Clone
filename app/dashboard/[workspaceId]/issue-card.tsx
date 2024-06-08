"use client";

import { deleteIssue, updateIssue } from "@/actions/issue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface IssueCardProps {
  issues: {
    BACKLOG: Issue[];
    TODO: Issue[];
    INPROGRESS: Issue[];
    DONE: Issue[];
    CANCELLED: Issue[];
  };
}

export const IssueCard = ({ issues }: IssueCardProps) => {
  const { onOpen } = useCreateIssue();
  const { onOpen: onRenameOpen } = useRenameIssue();
  const { data } = useSession();
  const params = useParams();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState("");

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

  const handleIssueDelete = async () => {
    try {
      toast.loading("Deleting issue...");
      const response = await deleteIssue({
        id: selectedIssueId,
        userId: data?.user?.id!,
        workspaceId: params.workspaceId as string,
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Issue deleted successfully.");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  const handleDragEnd = async (result: any) => {
    const { destination, source, type } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type !== "Issues") return;

    if (source.droppableId === destination.droppableId) {
      try {
        toast.loading("Reordering issue...");
        const issuesList = [...issues[source.droppableId as ISSUETYPE]];
        const [removed] = issuesList.splice(source.index, 1);
        issuesList.splice(destination.index, 0, removed);

        const updatedIssues = {
          ...issues,
          [source.droppableId]: issuesList,
        };

        updatedIssues[source.droppableId as ISSUETYPE].forEach(
          (issue, index) => {
            issue.order = index;
          }
        );

        issues[source.droppableId as ISSUETYPE] =
          updatedIssues[source.droppableId as ISSUETYPE];

        for (const issue of updatedIssues[source.droppableId as ISSUETYPE]) {
          await updateIssue({
            id: issue.id,
            userId: data?.user?.id!,
            workspaceId: params.workspaceId as string,
            values: {
              order: issue.order,
            },
          });
        }

        toast.success("Issue reordered successfully.");
        window.location.reload();
      } catch (error) {
        toast.error("Something went wrong! Please try again.");
      } finally {
        toast.dismiss();
      }
    } else {
      try {
        toast.loading("Moving issue...");
        const sourceIssuesList = [...issues[source.droppableId as ISSUETYPE]];
        const destinationIssuesList = [
          ...issues[destination.droppableId as ISSUETYPE],
        ];

        const [removed] = sourceIssuesList.splice(source.index, 1);
        destinationIssuesList.splice(destination.index, 0, removed);

        const updatedIssues = {
          ...issues,
          [source.droppableId]: sourceIssuesList,
          [destination.droppableId]: destinationIssuesList,
        };

        updatedIssues[source.droppableId as ISSUETYPE].forEach(
          (issue, index) => {
            issue.order = index;
          }
        );
        updatedIssues[destination.droppableId as ISSUETYPE].forEach(
          (issue, index) => {
            issue.order = index;
          }
        );

        issues[source.droppableId as ISSUETYPE] =
          updatedIssues[source.droppableId as ISSUETYPE];
        issues[destination.droppableId as ISSUETYPE] =
          updatedIssues[destination.droppableId as ISSUETYPE];

        for (const issue of updatedIssues[source.droppableId as ISSUETYPE]) {
          await updateIssue({
            id: issue.id,
            userId: data?.user?.id!,
            workspaceId: params.workspaceId as string,
            values: {
              order: issue.order,
            },
          });
        }

        for (const issue of updatedIssues[
          destination.droppableId as ISSUETYPE
        ]) {
          await updateIssue({
            id: issue.id,
            userId: data?.user?.id!,
            workspaceId: params.workspaceId as string,
            values: {
              order: issue.order,
              status: destination.droppableId as ISSUETYPE,
            },
          });
        }

        toast.success("Issue reordered successfully.");
        window.location.reload();
      } catch (error) {
        toast.error("Something went wrong! Please try again.");
      } finally {
        toast.dismiss();
      }
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
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
              <Droppable droppableId={issue.type} type="Issues">
                {(provided) => (
                  <ol
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="w-full flex flex-col gap-y-1 p-2"
                  >
                    {issues[issue.type].map((iss, index) => (
                      <Draggable key={index} draggableId={iss.id} index={index}>
                        {(provided) => (
                          <ContextMenu>
                            <ContextMenuTrigger>
                              <div
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                className="flex justify-between items-center border border-neutral-700 rounded-lg p-3"
                              >
                                <div className="flex flex-col gap-y-2">
                                  <span className="flex gap-x-1 items-center">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger>
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
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        {Issues.map((issue) => (
                                          <DropdownMenuItem
                                            key={issue.type}
                                            className="flex items-center justify-between cursor-pointer"
                                            onSelect={() =>
                                              handleStatusSelect(
                                                iss.id,
                                                issue.type
                                              )
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
                                              iss.label === "BUG" &&
                                                "bg-red-600",
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
                                                handleLabelSelect(
                                                  iss.id,
                                                  label.type
                                                );
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
                                  {...provided.dragHandleProps}
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
                              <ContextMenuItem
                                onSelect={() => {
                                  setSelectedIssueId(iss.id);
                                  setAlertDialogOpen(true);
                                }}
                                className="cursor-pointer"
                              >
                                <Trash2 className="size-4 mr-1" /> Delete
                              </ContextMenuItem>
                            </ContextMenuContent>
                          </ContextMenu>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    <Button
                      onClick={() => onOpen(issue.type)}
                      size="icon"
                      variant="secondary"
                      className="w-full mt-4"
                    >
                      <PlusIcon className="size-5" />
                    </Button>
                  </ol>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <AlertDialog
        open={alertDialogOpen}
        onOpenChange={() => {
          setAlertDialogOpen(false);
          setSelectedIssueId("");
        }}
      >
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
