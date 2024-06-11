import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetMenu } from "../sheet-menu";
import ProjectCard from "./project-card";

const ProjectsPage = ({ params }: { params: { workspaceId: string } }) => {
  const { workspaceId } = params;

  return (
    <div className="w-full h-full flex flex-col">
      <nav className="w-full h-[50px] px-4 flex items-center justify-between border-b border-b-slate-600">
        <span>All Projects</span>
        <div className="md:hidden">
          <SheetMenu workspaceId={workspaceId} />
        </div>
      </nav>
      <ScrollArea className="w-full h-full">
        <ProjectCard />
      </ScrollArea>
    </div>
  );
};

export default ProjectsPage;
