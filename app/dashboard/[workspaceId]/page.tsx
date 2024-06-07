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

  return (
    <div className="w-full h-full flex flex-col">
      <nav className="w-full h-[50px] px-4 flex items-center justify-between border-b border-b-slate-600">
        <span>All Issues</span>
        <div className="md:hidden">
          <SheetMenu workspaceId={workspaceId} />
        </div>
      </nav>
      <ScrollArea className="w-full h-full">
        <IssueCard issues={issues} />
      </ScrollArea>
    </div>
  );
};

export default WorkspacePage;
