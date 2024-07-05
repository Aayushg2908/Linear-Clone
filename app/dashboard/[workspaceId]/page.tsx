import { SheetMenu } from "./sheet-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IssueCard } from "./issue-card";
import { getAllIssues } from "@/actions/issue";
import { getWorkspace } from "@/actions/workspace";
import { getAllProjects } from "@/actions/project";

const WorkspacePage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const { workspaceId } = params;

  const issues = await getAllIssues({ workspaceId });
  const workspace = await getWorkspace({ workspaceId });
  const projects = await getAllProjects({ workspaceId });

  const backlogIssues = issues.filter((issue) => issue.status === "BACKLOG");
  const todoIssues = issues.filter((issue) => issue.status === "TODO");
  const inProgressIssues = issues.filter(
    (issue) => issue.status === "INPROGRESS",
  );
  const doneIssues = issues.filter((issue) => issue.status === "DONE");
  const cancelledIssues = issues.filter(
    (issue) => issue.status === "CANCELLED",
  );

  const finalIssues = {
    BACKLOG: backlogIssues,
    TODO: todoIssues,
    INPROGRESS: inProgressIssues,
    DONE: doneIssues,
    CANCELLED: cancelledIssues,
  };

  return (
    <div className="w-full h-full flex flex-col">
      <nav className="w-full h-[50px] px-4 flex items-center justify-between border-b border-b-slate-600">
        <span>All Issues</span>
        <div className="md:hidden">
          <SheetMenu workspaceId={workspaceId} />
        </div>
      </nav>
      <ScrollArea className="w-full h-full">
        <IssueCard
          issues={finalIssues}
          members={workspace.members}
          projects={projects}
        />
      </ScrollArea>
    </div>
  );
};

export default WorkspacePage;
