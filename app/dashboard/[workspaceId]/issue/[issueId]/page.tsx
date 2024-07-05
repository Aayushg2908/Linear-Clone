import { getIssueById } from "@/actions/issue";
import { SheetMenu } from "../../sheet-menu";
import IssueSidebar from "./issue-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import IssueSidebarMenu from "./issue-sidebar-menu";
import RenameIssueButton from "./rename-issue-button";
import MainContent from "./main-content";
import AddCommentForm from "./add-comment-form";
import { getAllComments } from "@/actions/comment";
import CommentsList from "./comments-list";
import { getWorkspace } from "@/actions/workspace";
import { getAllProjects } from "@/actions/project";

const IssuePage = async ({
  params,
}: {
  params: { workspaceId: string; issueId: string };
}) => {
  const { workspaceId, issueId } = params;

  const issue = await getIssueById({ workspaceId, issueId });
  const comments = await getAllComments({ issueId });
  const workspace = await getWorkspace({ workspaceId });
  const projects = await getAllProjects({ workspaceId });

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
            <IssueSidebarMenu
              issue={issue}
              workspaceId={workspaceId}
              members={workspace.members}
              projects={projects}
            />
          </div>
        </nav>
        <ScrollArea className="w-full h-full p-4">
          <MainContent issue={issue} workspaceId={workspaceId} />
          <div className="w-full h-[1px] bg-slate-600 mt-10" />
          <h1 className="mt-4 text-bold text-3xl">Comments</h1>
          <CommentsList comments={comments} />
          <AddCommentForm issueId={issue.id} />
        </ScrollArea>
      </div>
      <IssueSidebar
        issue={issue}
        workspaceId={workspaceId}
        members={workspace.members}
        projects={projects}
      />
    </div>
  );
};

export default IssuePage;
