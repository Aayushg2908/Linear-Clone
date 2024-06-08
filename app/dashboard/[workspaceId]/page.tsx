import { SheetMenu } from "./sheet-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IssueCard } from "./issue-card";
import { getAllIssues } from "@/actions/issue";

const WorkspacePage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const { workspaceId } = params;

  const issues = await getAllIssues({ workspaceId });

  const backlogIssues = issues.filter((issue) => issue.status === "BACKLOG");
  const todoIssues = issues.filter((issue) => issue.status === "TODO");
  const inProgressIssues = issues.filter(
    (issue) => issue.status === "INPROGRESS"
  );
  const doneIssues = issues.filter((issue) => issue.status === "DONE");
  const cancelledIssues = issues.filter(
    (issue) => issue.status === "CANCELLED"
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
        <IssueCard issues={finalIssues} />
      </ScrollArea>
    </div>
  );
};

export default WorkspacePage;
