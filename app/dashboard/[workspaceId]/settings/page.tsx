import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetMenu } from "../sheet-menu";
import { getWorkspace, getWorkspaceById } from "@/actions/workspace";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SettingsForm from "./settings-form";
import MembersList from "./members-list";
import DeleteButton from "./delete-button";

const WorkspaceSettingsPage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const session = await auth();
  if (!session) {
    return redirect("/sign-in");
  }

  const { workspaceId } = params;

  const workspace = await getWorkspaceById({ workspaceId });
  const workspaceMembers = await getWorkspace({ workspaceId });

  return (
    <div className="w-full h-full flex flex-col">
      <nav className="w-full h-[50px] px-4 flex items-center justify-between border-b border-b-slate-600">
        <span>Workspace Settings</span>
        <div className="md:hidden">
          <SheetMenu workspaceId={workspaceId} />
        </div>
      </nav>
      <ScrollArea className="w-full h-full p-4">
        <h1 className="text-4xl">Workspace</h1>
        <p className="text-muted-foreground mt-1">
          Manage your workspace settings.
        </p>
        <div className="h-[1px] w-full bg-slate-600 mt-1" />
        <h1 className="text-2xl mt-4">General</h1>
        <SettingsForm
          workspace={workspace}
          editable={workspace.ownerId === session?.user?.id}
        />
        <div className="h-[1px] w-full bg-slate-600 mt-2" />
        <h1 className="text-2xl mt-4">Members</h1>
        <MembersList
          id={workspace.id}
          members={workspaceMembers.members}
          editable={workspace.ownerId === session?.user?.id}
        />
        <div className="h-[1px] w-full bg-slate-600 mt-2" />
        <h1 className="text-2xl mt-4">Delete Workspace</h1>
        <DeleteButton
          id={workspace.id}
          editable={workspace.ownerId === session?.user?.id}
        />
      </ScrollArea>
    </div>
  );
};

export default WorkspaceSettingsPage;
