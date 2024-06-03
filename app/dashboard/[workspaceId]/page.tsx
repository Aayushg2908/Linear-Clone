import { SheetMenu } from "./sheet-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IssueCard } from "./issue-card";

const WorkspacePage = ({ params }: { params: { workspaceId: string } }) => {
  const { workspaceId } = params;

  return (
    <div className="w-full h-full flex flex-col">
      <nav className="w-full h-[50px] px-4 flex items-center justify-between border-b border-b-slate-600">
        <span>All Issues</span>
        <div className="md:hidden">
          <SheetMenu workspaceId={workspaceId} />
        </div>
      </nav>
      <ScrollArea className="w-full h-full">
        <IssueCard />
      </ScrollArea>
    </div>
  );
};

export default WorkspacePage;
