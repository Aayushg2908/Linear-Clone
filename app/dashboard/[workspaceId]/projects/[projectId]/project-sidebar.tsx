"use client";

import { PROJECTLABEL, PROJECTTYPE, Project, User } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectLabel, Projects } from "@/constants";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  CheckIcon,
  PlusIcon,
  Trash2,
  UserCircleIcon,
  UserCog,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { addMember, deleteProject, updateProject } from "@/actions/project";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { Button } from "@/components/ui/button";

export const getIconIndex = (status: PROJECTTYPE) => {
  switch (status) {
    case PROJECTTYPE.BACKLOG:
      return 0;
    case PROJECTTYPE.PLANNED:
      return 1;
    case PROJECTTYPE.INPROGRESS:
      return 2;
    case PROJECTTYPE.COMPLETED:
      return 3;
    case PROJECTTYPE.CANCELLED:
      return 4;
    default:
      return 0;
  }
};

const ProjectSidebar = ({
  project,
  workspaceId,
  members,
  mobile = false,
}: {
  project: Project;
  workspaceId: string;
  members: User[];
  mobile?: boolean;
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const Icon = Projects[getIconIndex(project.status)].Icon;
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleStatusSelect = async (id: string, status: PROJECTTYPE) => {
    try {
      toast.loading("Updating project status...");
      const response = await updateProject({
        id,
        workspaceId: workspaceId,
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

  const handleLabelSelect = async (id: string, label: PROJECTLABEL | null) => {
    try {
      toast.loading("Updating project label...");
      const response = await updateProject({
        id,
        workspaceId: workspaceId,
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
        workspaceId: workspaceId,
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
        workspaceId: workspaceId,
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
        workspaceId: workspaceId,
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

  const handleProjectDelete = async () => {
    try {
      toast.loading("Deleting project...");
      const response = await deleteProject({
        id: project.id,
        workspaceId: workspaceId,
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Project deleted successfully.");
        router.push(`/dashboard/${workspaceId}/projects`);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  if (!isMounted) return null;

  return (
    <aside
      className={cn(
        "w-[250px] h-full flex flex-col gap-y-8",
        !mobile &&
          "max-md:hidden fixed top-0 right-0 z-50 border-l border-l-slate-600 py-2 px-4"
      )}
    >
      <h1 className="w-full text-center text-xl font-bold">Properties</h1>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-x-2 w-fit">
          <Icon
            className={cn(
              "size-4 text-white rounded-full",
              project.status === "COMPLETED" && "bg-green-600 ",
              project.status === "INPROGRESS" && "bg-yellow-600",
              project.status === "CANCELLED" && "bg-red-600"
            )}
          />
          <span>{project.status}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Projects.map((pro) => (
            <DropdownMenuItem
              key={pro.type}
              className="flex items-center justify-between cursor-pointer"
              onSelect={() => handleStatusSelect(project.id, pro.type)}
            >
              <span className="flex gap-x-2 items-center">
                <pro.Icon
                  className={cn(
                    "size-4 text-white rounded-full",
                    pro.type === "COMPLETED" && "bg-green-600 ",
                    pro.type === "INPROGRESS" && "bg-yellow-600",
                    pro.type === "CANCELLED" && "bg-red-600"
                  )}
                />
                {pro.name}
              </span>
              {pro.type === project.status && (
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
            {project.label ? (
              <span
                className={cn(
                  "size-4 rounded-full",
                  project.label === "BUG" && "bg-red-600",
                  project.label === "FEATURE" && "bg-purple-600",
                  project.label === "IMPROVEMENT" && "bg-blue-600"
                )}
              />
            ) : (
              <PlusIcon className="size-4" />
            )}
            {project.label || "Add Label"}
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {ProjectLabel.map((label) => (
            <DropdownMenuItem
              key={label.type}
              className="cursor-pointer"
              onSelect={() => {
                if (project.label !== label.type) {
                  handleLabelSelect(project.id, label.type);
                } else {
                  handleLabelSelect(project.id, null);
                }
              }}
            >
              <span className={label.className} />
              {label.name}
              {label.type === project.label && (
                <CheckIcon className="size-4 text-green-600 ml-2" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-x-2 w-fit">
          <UserCog className="size-5" />
          Lead
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {members.map((member) => (
            <DropdownMenuItem
              key={member.id}
              className="cursor-pointer flex items-center gap-x-1"
              onSelect={() => {
                if (project.lead === member.id) {
                  handleProjectLead({
                    userId: member.id,
                    projectId: project.id,
                    name: member.name!,
                    type: "REMOVE",
                  });
                } else {
                  handleProjectLead({
                    userId: member.id,
                    projectId: project.id,
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
              {project.lead === member.id && (
                <CheckIcon className="size-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-x-2 w-fit">
          <Users className="size-5" />
          Members
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {members.map((member) => (
            <DropdownMenuItem
              key={member.id}
              className="cursor-pointer flex items-center gap-x-1"
              onSelect={() => {
                if (project.members.includes(member.id)) {
                  handleAddMember({
                    userId: member.id,
                    projectId: project.id,
                    name: member.name!,
                    type: "REMOVE",
                  });
                } else {
                  handleAddMember({
                    userId: member.id,
                    projectId: project.id,
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
              {project.members.includes(member.id) && (
                <CheckIcon className="size-4 text-green-600" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-x-2 w-fit">
          <CalendarIcon className="size-4 mr-1" />{" "}
          {project.startDate
            ? project.startDate.toLocaleDateString()
            : "Start Date"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Calendar
            disabled={(date: Date) =>
              date <= new Date() || date < new Date("1900-01-01")
            }
            mode="single"
            className="rounded-md"
            onSelect={(date: Date | undefined) =>
              handleAddDate(date as Date, project.id, "START")
            }
            selected={project.startDate as Date}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-x-2 w-fit">
          <CalendarIcon className="size-4 mr-1" />{" "}
          {project.endDate ? project.endDate.toLocaleDateString() : "End Date"}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <Calendar
            disabled={(date: Date) =>
              date <= new Date() || date < new Date("1900-01-01")
            }
            mode="single"
            className="rounded-md"
            onSelect={(date: Date | undefined) =>
              handleAddDate(date as Date, project.id, "END")
            }
            selected={project.endDate as Date}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-fit bg-red-600 hover:bg-red-700 text-white">
            <Trash2 className="size-5 mr-1" />
            Delete Project
          </Button>
        </AlertDialogTrigger>
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
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};

export default ProjectSidebar;
