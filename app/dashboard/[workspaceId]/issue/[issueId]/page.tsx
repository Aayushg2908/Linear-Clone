import { getIssueById } from "@/actions/issue";
import { SheetMenu } from "../../sheet-menu";
import IssueSidebar from "./issue-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import IssueSidebarMenu from "./issue-sidebar-menu";

const IssuePage = async ({
  params,
}: {
  params: { workspaceId: string; issueId: string };
}) => {
  const { workspaceId, issueId } = params;

  const issue = await getIssueById({ workspaceId, issueId });

  return (
    <div className="w-full h-full flex">
      <div className="w-full h-full flex flex-col md:mr-[250px]">
        <nav className="w-full h-[50px] px-4 flex items-center justify-between border-b border-b-slate-600">
          <div className="flex items-center gap-x-2">
            <div className="md:hidden">
              <SheetMenu workspaceId={workspaceId} />
            </div>
            <span className="font-bold text-lg md:pl-4">{issue.title}</span>
          </div>
          <div className="md:hidden">
            <IssueSidebarMenu issue={issue} workspaceId={workspaceId} />
          </div>
        </nav>
        <ScrollArea className="w-full h-full">Children</ScrollArea>
      </div>
      <IssueSidebar issue={issue} workspaceId={workspaceId} />
    </div>
  );
};

export default IssuePage;
