"use client";

import { updateProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Projects } from "@/constants";
import { useCreateProject } from "@/hooks/use-create-project";
import { useRenameProject } from "@/hooks/use-rename-project";
import { cn } from "@/lib/utils";
import { PROJECTTYPE, Project, User } from "@prisma/client";
import { CheckIcon, Edit, Grip, PlusIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
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

  return (
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
                                project.type === "COMPLETED" && "bg-green-600 ",
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
                    <Edit className="size-4 mr-1" /> Edit
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem className="cursor-pointer">
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
  );
};

export default ProjectCard;
