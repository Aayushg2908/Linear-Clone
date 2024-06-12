import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetMenu } from "../sheet-menu";
import ProjectCard from "./project-card";
import { getWorkspace } from "@/actions/workspace";
import { getAllProjects } from "@/actions/project";

const ProjectsPage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const { workspaceId } = params;

  const projects = await getAllProjects({ workspaceId });
  const workspace = await getWorkspace({ workspaceId });

  const backlogProjects = projects.filter(
    (issue) => issue.status === "BACKLOG"
  );
  const plannedProjects = projects.filter(
    (issue) => issue.status === "PLANNED"
  );
  const inProgressProjects = projects.filter(
    (issue) => issue.status === "INPROGRESS"
  );
  const completedProjects = projects.filter(
    (issue) => issue.status === "COMPLETED"
  );
  const cancelledProjects = projects.filter(
    (issue) => issue.status === "CANCELLED"
  );

  const finalProjects = {
    BACKLOG: backlogProjects,
    PLANNED: plannedProjects,
    INPROGRESS: inProgressProjects,
    COMPLETED: completedProjects,
    CANCELLED: cancelledProjects,
  };

  return (
    <div className="w-full h-full flex flex-col">
      <nav className="w-full h-[50px] px-4 flex items-center justify-between border-b border-b-slate-600">
        <span>All Projects</span>
        <div className="md:hidden">
          <SheetMenu workspaceId={workspaceId} />
        </div>
      </nav>
      <ScrollArea className="w-full h-full">
        <ProjectCard projects={finalProjects} members={workspace.members} />
      </ScrollArea>
    </div>
  );
};

export default ProjectsPage;
