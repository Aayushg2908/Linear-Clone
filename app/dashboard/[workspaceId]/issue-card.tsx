"use client";

import {
  assignIssue,
  deleteIssue,
  realtimeUpdateIssue,
  updateIssue,
} from "@/actions/issue";
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
import { IssueLabel, Issues, Projects } from "@/constants";
import { useCreateIssue } from "@/hooks/use-create-issue";
import { useRenameIssue } from "@/hooks/use-rename-issue";
import { cn } from "@/lib/utils";
import { ISSUELABEL, ISSUETYPE, Issue, Project, User } from "@prisma/client";
import {
  CheckIcon,
  CirclePlay,
  Grip,
  Pencil,
  PlusIcon,
  Tag,
  Trash2,
  UserCircle,
  UserCircleIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Link from "next/link";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

interface IssueProps {
  BACKLOG: Issue[];
  TODO: Issue[];
  INPROGRESS: Issue[];
  DONE: Issue[];
  CANCELLED: Issue[];
}

interface IssueCardProps {
  issues: IssueProps;
  members: User[];
  projects: Project[];
}

export const IssueCard = ({ issues, members, projects }: IssueCardProps) => {
  const [allIssues, setAllIssues] = useState<IssueProps>(issues);
  const { onOpen } = useCreateIssue();
  const { onOpen: onRenameOpen } = useRenameIssue();
  const params = useParams();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState("");

  useEffect(() => {
    pusherClient.subscribe(params.workspaceId as string);

    const createIssueHandler = (issue: Issue) => {
      setAllIssues((prev) => {
        return {
          ...prev,
          [issue.status]: [...prev[issue.status], issue],
        };
      });
    };

    const updateIssueHandler = ({
      updatedIssue,
      status,
      prevStatus,
      newStatus,
    }: {
      updatedIssue: Issue;
      status: boolean;
      prevStatus: ISSUETYPE;
      newStatus: ISSUETYPE;
    }) => {
      if (!status) {
        setAllIssues((prev) => {
          return {
            ...prev,
            [updatedIssue.status]: prev[updatedIssue.status].map((iss) =>
              iss.id === updatedIssue.id ? updatedIssue : iss,
            ),
          };
        });
      } else if (status) {
        setAllIssues((prev) => {
          return {
            ...prev,
            [prevStatus]: prev[prevStatus].filter(
              (iss) => iss.id !== updatedIssue.id,
            ),
            [newStatus]: [
              ...prev[newStatus].slice(0, updatedIssue.order),
              updatedIssue,
              ...prev[newStatus].slice(updatedIssue.order),
            ],
          };
        });
      }
    };

    const deleteIssueHandler = ({
      id,
      status,
    }: {
      id: string;
      status: ISSUETYPE;
    }) => {
      setAllIssues((prev) => {
        return {
          ...prev,
          [status]: prev[status].filter((iss) => iss.id !== id),
        };
      });
    };

    const dragAndDropIssueHandler = (issues: IssueProps) => {
      setAllIssues(issues);
    };

    pusherClient.bind("issue-created", createIssueHandler);
    pusherClient.bind("issue-updated", updateIssueHandler);
    pusherClient.bind("issue-deleted", deleteIssueHandler);
    pusherClient.bind("issue-dragged-and-dropped", dragAndDropIssueHandler);

    return () => {
      pusherClient.unbind("issue-created", createIssueHandler);
      pusherClient.unbind("issue-updated", updateIssueHandler);
      pusherClient.unbind("issue-deleted", deleteIssueHandler);
      pusherClient.unbind("issue-dragged-and-dropped", dragAndDropIssueHandler);
      pusherClient.unsubscribe(params.workspaceId as string);
    };
  }, [params.workspaceId]);

  const handleStatusSelect = async (id: string, status: ISSUETYPE) => {
    try {
      toast.loading("Updating issue status...");
      const response = await updateIssue({
        id,
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
        `${type === "ASSIGN" ? "Assigning" : "Unassigning"} issue...`,
      );
      const response = await assignIssue({
        userId,
        issueId,
        workspaceId: params.workspaceId as string,
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

  const handleProjectAssign = async (id: string, projectId: string | null) => {
    try {
      toast.loading("Adding project to this issue...");
      const response = await updateIssue({
        id,
        workspaceId: params.workspaceId as string,
        values: {
          projectId,
        },
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Project added to this issue successfully.");
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
        const issuesList = [...allIssues[source.droppableId as ISSUETYPE]];
        const [removed] = issuesList.splice(source.index, 1);
        issuesList.splice(destination.index, 0, removed);

        const updatedIssues = {
          ...allIssues,
          [source.droppableId]: issuesList,
        };

        updatedIssues[source.droppableId as ISSUETYPE].forEach(
          (issue, index) => {
            issue.order = index;
          },
        );

        allIssues[source.droppableId as ISSUETYPE] =
          updatedIssues[source.droppableId as ISSUETYPE];

        for (const issue of updatedIssues[source.droppableId as ISSUETYPE]) {
          const response = await updateIssue({
            id: issue.id,
            workspaceId: params.workspaceId as string,
            values: {
              order: issue.order,
            },
          });
          if (response?.error) {
            return toast.error(response.error);
          }
        }

        await realtimeUpdateIssue({
          issues: allIssues,
          workspaceId: params.workspaceId as string,
        });

        toast.success("Issue reordered successfully.");
      } catch (error) {
        toast.error("Something went wrong! Please try again.");
      } finally {
        toast.dismiss();
        window.location.reload();
      }
    } else {
      try {
        toast.loading("Moving issue...");
        const sourceIssuesList = [
          ...allIssues[source.droppableId as ISSUETYPE],
        ];
        const destinationIssuesList = [
          ...allIssues[destination.droppableId as ISSUETYPE],
        ];

        const [removed] = sourceIssuesList.splice(source.index, 1);
        destinationIssuesList.splice(destination.index, 0, removed);

        const updatedIssues = {
          ...allIssues,
          [source.droppableId]: sourceIssuesList,
          [destination.droppableId]: destinationIssuesList,
        };

        updatedIssues[source.droppableId as ISSUETYPE].forEach(
          (issue, index) => {
            issue.order = index;
          },
        );
        updatedIssues[destination.droppableId as ISSUETYPE].forEach(
          (issue, index) => {
            issue.order = index;
          },
        );

        allIssues[source.droppableId as ISSUETYPE] =
          updatedIssues[source.droppableId as ISSUETYPE];
        allIssues[destination.droppableId as ISSUETYPE] =
          updatedIssues[destination.droppableId as ISSUETYPE];

        for (const issue of updatedIssues[source.droppableId as ISSUETYPE]) {
          const response = await updateIssue({
            id: issue.id,
            workspaceId: params.workspaceId as string,
            values: {
              order: issue.order,
            },
          });
          if (response?.error) {
            return toast.error(response.error);
          }
        }

        for (const issue of updatedIssues[
          destination.droppableId as ISSUETYPE
        ]) {
          const response = await updateIssue({
            id: issue.id,
            workspaceId: params.workspaceId as string,
            values: {
              order: issue.order,
              status: destination.droppableId as ISSUETYPE,
            },
          });
          if (response?.error) {
            return toast.error(response.error);
          }
        }

        await realtimeUpdateIssue({
          issues: allIssues,
          workspaceId: params.workspaceId as string,
        });

        toast.success("Issue reordered successfully.");
      } catch (error) {
        toast.error("Something went wrong! Please try again.");
      } finally {
        toast.dismiss();
        window.location.reload();
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
                      issue.type === "CANCELLED" && "bg-red-600",
                    )}
                  />
                  <span className="font-bold">{issue.name}</span>
                  <span className="text-muted-foreground">
                    {allIssues[issue.type].length}
                  </span>
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
                    {allIssues[issue.type].map((iss, index) => (
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
                                              "bg-red-600",
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
                                                issue.type,
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
                                                    "bg-red-600",
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
                                    <Link
                                      href={`/dashboard/${params.workspaceId}/issue/${iss.id}`}
                                      className="text-sm line-clamp-1 hover:underline hover:text-blue-500"
                                    >
                                      {iss.title}
                                    </Link>
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
                                                "bg-blue-600",
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
                                                  label.type,
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
                                              "bg-red-600",
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
                              <ContextMenuSub>
                                <ContextMenuSubTrigger className="cursor-pointer">
                                  <UserCircle className="size-4 mr-1" />
                                  Assign To
                                </ContextMenuSubTrigger>
                                <ContextMenuSubContent>
                                  {members.map((member) => (
                                    <ContextMenuItem
                                      key={member.id}
                                      className="cursor-pointer flex items-center gap-x-1"
                                      onSelect={() => {
                                        if (
                                          iss.assignedTo.includes(member.id)
                                        ) {
                                          handleIssueAssign({
                                            userId: member.id,
                                            issueId: iss.id,
                                            name: member.name!,
                                            type: "REMOVE",
                                          });
                                        } else {
                                          handleIssueAssign({
                                            userId: member.id,
                                            issueId: iss.id,
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
                                      <span className="text-sm">
                                        {member.name}
                                      </span>
                                      {iss.assignedTo.includes(member.id) && (
                                        <CheckIcon className="size-4 text-green-600" />
                                      )}
                                    </ContextMenuItem>
                                  ))}
                                </ContextMenuSubContent>
                              </ContextMenuSub>
                              <ContextMenuSub>
                                <ContextMenuSubTrigger className="cursor-pointer">
                                  <UserCircle className="size-4 mr-1" />
                                  Project
                                </ContextMenuSubTrigger>
                                <ContextMenuSubContent>
                                  {projects.map((project) => (
                                    <ContextMenuItem
                                      key={project.id}
                                      className="cursor-pointer flex items-center gap-x-1"
                                      onSelect={() => {
                                        if (iss.projectId === project.id) {
                                          handleProjectAssign(iss.id, null);
                                        } else {
                                          handleProjectAssign(
                                            iss.id,
                                            project.id,
                                          );
                                        }
                                      }}
                                    >
                                      {Projects.map((pro) => (
                                        <>
                                          {project.status === pro.type && (
                                            <pro.Icon
                                              className={cn(
                                                "size-5 text-white rounded-sm",
                                                pro.type === "COMPLETED" &&
                                                  "bg-green-600 ",
                                                pro.type === "INPROGRESS" &&
                                                  "bg-yellow-600",
                                                pro.type === "CANCELLED" &&
                                                  "bg-red-600",
                                              )}
                                            />
                                          )}
                                        </>
                                      ))}
                                      <span className="text-sm">
                                        {project.title}
                                      </span>
                                      {iss.projectId === project.id && (
                                        <CheckIcon className="size-4 text-green-600" />
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
                                    iss.title,
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
