import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { WorkspaceDropdown } from "./workspace-dropdown";
import { Tabs } from "./tabs";

export const SheetMenu = async ({ workspaceId }: { workspaceId: string }) => {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="mt-8" />
        <WorkspaceDropdown
          workspaceId={workspaceId}
          workspaceName={workspace.name}
          joinedWorkspaces={user.joinedWorkspaces}
          width="w-[200px] sm:w-[330px]"
        />
        <Tabs workspaceId={workspaceId} />
      </SheetContent>
    </Sheet>
  );
};
