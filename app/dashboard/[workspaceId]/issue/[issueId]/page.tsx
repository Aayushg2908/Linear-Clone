import { getIssueById } from "@/actions/issue";
import { SheetMenu } from "../../sheet-menu";
import IssueSidebar from "./issue-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import IssueSidebarMenu from "./issue-sidebar-menu";
import RenameIssueButton from "./rename-issue-button";
import MainContent from "./main-content";

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
            <RenameIssueButton
              value={issue.title}
              workspaceId={workspaceId}
              issueId={issue.id}
            />
          </div>
          <div className="md:hidden">
            <IssueSidebarMenu issue={issue} workspaceId={workspaceId} />
          </div>
        </nav>
        <ScrollArea className="w-full h-full">
          <MainContent issue={issue} workspaceId={workspaceId} />
        </ScrollArea>
      </div>
      <IssueSidebar issue={issue} workspaceId={workspaceId} />
    </div>
  );
};

export default IssuePage;
