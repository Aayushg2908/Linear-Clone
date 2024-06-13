"use client";

import { addMember, deleteProject, updateProject } from "@/actions/project";
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
import { Calendar } from "@/components/ui/calendar";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProjectLabel, Projects } from "@/constants";
import { useCreateProject } from "@/hooks/use-create-project";
import { useRenameProject } from "@/hooks/use-rename-project";
import { cn, getProjectCompletePercentage } from "@/lib/utils";
import { PROJECTLABEL, PROJECTTYPE, Project, User } from "@prisma/client";
import {
  CalendarIcon,
  CheckIcon,
  Edit,
  Grip,
  PlusIcon,
  RefreshCcwDot,
  SquarePlay,
  Tag,
  Trash2,
  UserCircleIcon,
  UserRoundCog,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProjectCardProps {
  projects: {
    BACKLOG: Project[];
    PLANNED: Project[];
    INPROGRESS: Project[];
    COMPLETED: Project[];
    CANCELLED: Project[];
  };
  members: User[];
}

const ProjectCard = ({ projects, members }: ProjectCardProps) => {
  const { onOpen } = useCreateProject();
  const params = useParams();
  const { onOpen: onRenameOpen } = useRenameProject();
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const handleStatusSelect = async (id: string, status: PROJECTTYPE) => {
    try {
      toast.loading("Updating project status...");
      const response = await updateProject({
        id,
        workspaceId: params.workspaceId as string,
        values: {
          status,
        },
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Project status updated successfully.");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  const handleProjectDelete = async () => {
    try {
      toast.loading("Deleting project...");
      const response = await deleteProject({
        id: selectedProjectId,
        workspaceId: params.workspaceId as string,
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Project deleted successfully.");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  const handleLabelSelect = async (id: string, label: PROJECTLABEL | null) => {
    try {
      toast.loading("Updating project label...");
      const response = await updateProject({
        id,
        workspaceId: params.workspaceId as string,
        values: {
          label,
        },
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Project label updated successfully.");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  const handleProjectLead = async ({
    userId,
    projectId,
    name,
    type,
  }: {
    userId: string;
    projectId: string;
    name: string;
    type: "ASSIGN" | "REMOVE";
  }) => {
    try {
      toast.loading(
        type === "ASSIGN"
          ? `Assigning ${name} as the project lead...`
          : `Removing ${name} from the project lead...`
      );
      const response = await updateProject({
        id: projectId,
        workspaceId: params.workspaceId as string,
        values: {
          lead: type === "ASSIGN" ? userId : null,
        },
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success(
          `${name} ${
            type === "ASSIGN" ? "assigned" : "removed"
          } as the project lead successfully.`
        );
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  const handleAddMember = async ({
    userId,
    projectId,
    name,
    type,
  }: {
    userId: string;
    projectId: string;
    name: string;
    type: "ASSIGN" | "REMOVE";
  }) => {
    try {
      toast.loading(
        type === "ASSIGN"
          ? `Adding ${name} to the project...`
          : `Removing ${name} from the project...`
      );
      const response = await addMember({
        userId,
        projectId,
        workspaceId: params.workspaceId as string,
        type,
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success(
          type === "ASSIGN"
            ? `${name} added to the project successfully`
            : `${name} removed from the project successfully`
        );
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  const handleAddDate = async (
    date: Date,
    projectId: string,
    type: "START" | "END"
  ) => {
    try {
      toast.loading(
        type === "START"
          ? "Updating project start date..."
          : "Updating project end date..."
      );
      const response = await updateProject({
        id: projectId,
        workspaceId: params.workspaceId as string,
        values: {
          [type === "START" ? "startDate" : "endDate"]: date,
        },
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success(
          `Project ${
            type === "START" ? "start" : "end"
          } date updated successfully.`
        );
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <>
      <div className="mt-4 w-full flex flex-col sm:flex-row gap-4 sm:flex-wrap p-2 justify-center">
        {Projects.map((project) => (
          <div
            key={project.type}
            className="flex flex-col rounded-md border w-full sm:w-[300px] min-h-[200px]"
          >
            <div className="flex items-center justify-between border-b p-2">
              <span className="flex gap-x-2 items-center">
                <project.Icon
                  className={cn(
                    "size-5 text-white rounded-sm",
                    project.type === "COMPLETED" && "bg-green-600 ",
                    project.type === "INPROGRESS" && "bg-yellow-600",
                    project.type === "CANCELLED" && "bg-red-600"
                  )}
                />
                <span className="font-bold">{project.name}</span>
                <span className="text-muted-foreground">
                  {projects[project.type].length}
                </span>
              </span>
              <Button
                onClick={() => onOpen(project.type)}
                size="icon"
                variant="ghost"
              >
                <PlusIcon className="size-5" />
              </Button>
            </div>
            <ol className="w-full flex flex-col gap-y-1 p-2">
              {projects[project.type].map((pro) => (
                <ContextMenu key={pro.id}>
                  <ContextMenuTrigger>
                    <div className="flex justify-between items-center border border-neutral-700 rounded-lg p-3">
                      <div className="flex flex-col gap-y-1">
                        <span className="flex gap-x-1 items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <project.Icon
                                className={cn(
                                  "size-4 text-white rounded-sm",
                                  project.type === "COMPLETED" &&
                                    "bg-green-600 ",
                                  project.type === "INPROGRESS" &&
                                    "bg-yellow-600",
                                  project.type === "CANCELLED" && "bg-red-600"
                                )}
                              />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {Projects.map((project) => (
                                <DropdownMenuItem
                                  key={project.type}
                                  className="flex items-center justify-between cursor-pointer"
                                  onSelect={() =>
                                    handleStatusSelect(pro.id, project.type)
                                  }
                                >
                                  <span className="flex gap-x-2 items-center">
                                    <project.Icon
                                      className={cn(
                                        "size-4 text-white rounded-full",
                                        project.type === "COMPLETED" &&
                                          "bg-green-600 ",
                                        project.type === "INPROGRESS" &&
                                          "bg-yellow-600",
                                        project.type === "CANCELLED" &&
                                          "bg-red-600"
                                      )}
                                    />
                                    {project.name}
                                  </span>
                                  {project.type === pro.status && (
                                    <CheckIcon className="ml-1 size-4 text-green-600" />
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <Link
                            href={`/dashboard/${params.workspaceId}/projects/${pro.id}`}
                            className="text-sm line-clamp-1 hover:underline hover:text-blue-500"
                          >
                            {pro.title}
                          </Link>
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {pro.summary}
                        </span>
                        <span className="flex items-center gap-x-1">
                          {pro.label && (
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Badge
                                  variant="secondary"
                                  className="flex items-center gap-x-1 w-fit mt-1"
                                >
                                  <div
                                    className={cn(
                                      "size-3 rounded-full",
                                      pro.label === "BUG" && "bg-red-600",
                                      pro.label === "FEATURE" &&
                                        "bg-purple-600",
                                      pro.label === "IMPROVEMENT" &&
                                        "bg-blue-600"
                                    )}
                                  />
                                  {pro.label}
                                </Badge>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {ProjectLabel.map((label) => (
                                  <DropdownMenuItem
                                    key={label.type}
                                    className="cursor-pointer"
                                    onSelect={() => {
                                      if (pro.label !== label.type) {
                                        handleLabelSelect(pro.id, label.type);
                                      } else {
                                        handleLabelSelect(pro.id, null);
                                      }
                                    }}
                                  >
                                    <span className={label.className} />
                                    {label.name}
                                    {label.type === pro.label && (
                                      <CheckIcon className="size-4 text-green-600 ml-2" />
                                    )}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                          {pro.startDate && pro.endDate && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <RefreshCcwDot className="size-4 ml-1 text-muted-foreground hover:text-white" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-black text-white">
                                  {getProjectCompletePercentage(
                                    pro.startDate,
                                    pro.endDate
                                  )}
                                  % completed
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </span>
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
                  <ContextMenuContent>
                    <ContextMenuSub>
                      <ContextMenuSubTrigger className="cursor-pointer">
                        <SquarePlay className="size-4 mr-1" /> Status
                      </ContextMenuSubTrigger>
                      <ContextMenuSubContent>
                        {Projects.map((project) => (
                          <ContextMenuItem
                            key={project.type}
                            onSelect={() =>
                              handleStatusSelect(pro.id, project.type)
                            }
                            className="cursor-pointer"
                          >
                            <span className="flex gap-x-2 items-center">
                              <project.Icon
                                className={cn(
                                  "size-4 text-white rounded-full",
                                  project.type === "COMPLETED" &&
                                    "bg-green-600 ",
                                  project.type === "INPROGRESS" &&
                                    "bg-yellow-600",
                                  project.type === "CANCELLED" && "bg-red-600"
                                )}
                              />
                              {project.name}
                            </span>
                            {project.type === pro.status && (
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
                        {ProjectLabel.map((label) => (
                          <ContextMenuItem
                            key={label.type}
                            className="cursor-pointer"
                            onClick={() => {
                              if (pro.label !== label.type) {
                                handleLabelSelect(pro.id, label.type);
                              } else {
                                handleLabelSelect(pro.id, null);
                              }
                            }}
                          >
                            <span className={label.className} />
                            {label.name}
                            {label.type === pro.label && (
                              <CheckIcon className="size-4 text-green-600 ml-2" />
                            )}
                          </ContextMenuItem>
                        ))}
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSub>
                      <ContextMenuSubTrigger className="cursor-pointer">
                        <UserRoundCog className="size-4 mr-1" /> Lead
                      </ContextMenuSubTrigger>
                      <ContextMenuSubContent>
                        {members.map((member) => (
                          <ContextMenuItem
                            key={member.id}
                            className="cursor-pointer flex items-center gap-x-1"
                            onSelect={() => {
                              if (pro.lead && pro.lead === member.id) {
                                handleProjectLead({
                                  userId: member.id,
                                  projectId: pro.id,
                                  name: member.name!,
                                  type: "REMOVE",
                                });
                              } else {
                                handleProjectLead({
                                  userId: member.id,
                                  projectId: pro.id,
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
                            {pro.lead === member.id && (
                              <CheckIcon className="size-4 text-green-600" />
                            )}
                          </ContextMenuItem>
                        ))}
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSub>
                      <ContextMenuSubTrigger className="cursor-pointer">
                        <Users className="size-4 mr-1" /> Members
                      </ContextMenuSubTrigger>
                      <ContextMenuSubContent>
                        {members.map((member) => (
                          <ContextMenuItem
                            key={member.id}
                            className="cursor-pointer flex items-center gap-x-1"
                            onSelect={() => {
                              if (pro.members.includes(member.id)) {
                                handleAddMember({
                                  userId: member.id,
                                  projectId: pro.id,
                                  name: member.name!,
                                  type: "REMOVE",
                                });
                              } else {
                                handleAddMember({
                                  userId: member.id,
                                  projectId: pro.id,
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
                            {pro.members.includes(member.id) && (
                              <CheckIcon className="size-4 text-green-600" />
                            )}
                          </ContextMenuItem>
                        ))}
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSub>
                      <ContextMenuSubTrigger className="cursor-pointer">
                        <CalendarIcon className="size-4 mr-1" /> Start Date
                      </ContextMenuSubTrigger>
                      <ContextMenuSubContent>
                        <Calendar
                          disabled={(date: Date) =>
                            date <= new Date() || date < new Date("1900-01-01")
                          }
                          mode="single"
                          className="rounded-md"
                          onSelect={(date: Date | undefined) =>
                            handleAddDate(date as Date, pro.id, "START")
                          }
                          selected={pro.startDate as Date}
                        />
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSub>
                      <ContextMenuSubTrigger className="cursor-pointer">
                        <CalendarIcon className="size-4 mr-1" /> End Date
                      </ContextMenuSubTrigger>
                      <ContextMenuSubContent>
                        <Calendar
                          disabled={(date: Date) =>
                            date <= new Date() || date < new Date("1900-01-01")
                          }
                          mode="single"
                          className="rounded-md"
                          onSelect={(date: Date | undefined) =>
                            handleAddDate(date as Date, pro.id, "END")
                          }
                          selected={pro.endDate as Date}
                        />
                      </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuItem
                      onSelect={() =>
                        onRenameOpen(
                          pro.id,
                          params.workspaceId as string,
                          pro.title,
                          pro.summary
                        )
                      }
                      className="cursor-pointer"
                    >
                      <Edit className="size-4 mr-1" /> Edit Project
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem
                      onSelect={() => {
                        setSelectedProjectId(pro.id);
                        setAlertDialogOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Trash2 className="size-4 mr-1" /> Delete
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              ))}
              <Button
                onClick={() => onOpen(project.type)}
                size="icon"
                variant="secondary"
                className="w-full mt-4"
              >
                <PlusIcon className="size-5" />
              </Button>
            </ol>
          </div>
        ))}
      </div>
      <AlertDialog
        open={alertDialogOpen}
        onOpenChange={() => {
          setAlertDialogOpen(false);
          setSelectedProjectId("");
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this Project?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleProjectDelete}
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

export default ProjectCard;
