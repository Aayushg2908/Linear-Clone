import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Project, User } from "@prisma/client";
import { MenuIcon } from "lucide-react";
import ProjectSidebar from "./project-sidebar";

const ProjectSidebarMenu = ({
  project,
  workspaceId,
  members,
}: {
  project: Project;
  workspaceId: string;
  members: User[];
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[250px]">
        <ProjectSidebar
          project={project}
          workspaceId={workspaceId}
          members={members}
          mobile={true}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ProjectSidebarMenu;
