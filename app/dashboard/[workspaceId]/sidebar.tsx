import { auth } from "@/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { WorkspaceDropdown } from "./workspace-dropdown";
import { Tabs } from "./tabs";

export const Sidebar = async ({ workspaceId }: { workspaceId: string }) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      joinedWorkspaces: true,
    },
  });
  if (!user) {
    return redirect("/sign-in");
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });
  if (!workspace) {
    return notFound();
  }

  return (
    <aside className="w-[220px] h-screen fixed top-0 left-0 z-50 border-r border-r-slate-700 p-4">
      <WorkspaceDropdown
        workspaceId={workspaceId}
        workspaceName={workspace.name}
        joinedWorkspaces={user.joinedWorkspaces}
        inviteCode={workspace.inviteCode}
        width="w-[190px]"
      />
      <Tabs workspaceId={workspaceId} />
    </aside>
  );
};
