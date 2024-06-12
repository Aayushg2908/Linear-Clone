"use client";

import { Button } from "@/components/ui/button";
import { Projects } from "@/constants";
import { useCreateProject } from "@/hooks/use-create-project";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";

const ProjectCard = () => {
  const { onOpen } = useCreateProject();

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
