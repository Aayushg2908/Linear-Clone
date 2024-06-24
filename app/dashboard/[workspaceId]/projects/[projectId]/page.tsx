import { getWorkspace } from "@/actions/workspace";
import RenameProjectButton from "./rename-project-button";
import { getProjectById } from "@/actions/project";
import { ScrollArea } from "@/components/ui/scroll-area";
import MainContent from "./main-content";
import ProjectSidebar from "./project-sidebar";
import { SheetMenu } from "../../sheet-menu";
import ProjectSidebarMenu from "./project-sidebar-menu";
import CreateMilestoneButton from "./create-milestone-button";
import { getMilestones } from "@/actions/milestone";
import MilestonesList from "./milestones-list";

const ProjectPage = async ({
  params,
}: {
  params: { workspaceId: string; projectId: string };
}) => {
  const { workspaceId, projectId } = params;

  const project = await getProjectById({ workspaceId, projectId });
  const workspace = await getWorkspace({ workspaceId });
  const milestones = await getMilestones(projectId);

  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full flex flex-col md:mr-[250px]">
        <nav className="w-full h-[50px] px-4 flex items-center justify-between border-b border-b-slate-600">
          <div className="flex items-center gap-x-2">
            <div className="md:hidden">
              <SheetMenu workspaceId={workspaceId} />
            </div>
            <RenameProjectButton
              projectId={projectId}
              title={project.title}
              summary={project.summary}
              workspaceId={workspaceId}
            />
          </div>
          <div className="md:hidden">
            <ProjectSidebarMenu
              project={project}
              workspaceId={workspaceId}
              members={workspace.members}
            />
          </div>
        </nav>
        <ScrollArea className="w-full h-full p-4">
          <MainContent project={project} workspaceId={workspaceId} />
          <div className="w-full h-[1px] bg-slate-600 mt-10" />
          <CreateMilestoneButton projectId={project.id} />
          <MilestonesList milestones={milestones} />
        </ScrollArea>
      </div>
      <ProjectSidebar
        project={project}
        workspaceId={workspaceId}
        members={workspace.members}
      />
    </div>
  );
};

export default ProjectPage;
