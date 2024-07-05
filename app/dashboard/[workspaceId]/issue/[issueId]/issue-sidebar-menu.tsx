import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Issue, Project, User } from "@prisma/client";
import { MenuIcon } from "lucide-react";
import IssueSidebar from "./issue-sidebar";

const IssueSidebarMenu = ({
  issue,
  workspaceId,
  members,
  projects,
}: {
  issue: Issue;
  workspaceId: string;
  members: User[];
  projects: Project[];
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[250px]">
        <IssueSidebar
          issue={issue}
          workspaceId={workspaceId}
          members={members}
          mobile={true}
          projects={projects}
        />
      </SheetContent>
    </Sheet>
  );
};

export default IssueSidebarMenu;
