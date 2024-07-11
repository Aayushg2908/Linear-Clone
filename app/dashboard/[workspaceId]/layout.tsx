import { db } from "@/lib/db";
import { Sidebar } from "./sidebar";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import AIChatBubble from "./ai-chat-bubble";

const WorkspaceLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) => {
  const session = await auth();
  if (!session?.user && session?.user?.id) {
    return redirect("/sign-in");
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: params.workspaceId,
    },
    select: {
      members: true,
    },
  });
  if (!workspace) {
    return notFound();
  }

  if (!workspace.members.find((member) => member.id === session?.user?.id)) {
    return redirect("/dashboard/join");
  }

  return (
    <div className="w-full h-full flex">
      <div className="max-md:hidden">
        <Sidebar workspaceId={params.workspaceId} />
      </div>
      <main className="w-full h-full md:ml-[220px] relative">
        {children}
        <div className="absolute bottom-4 right-4">
          <AIChatBubble workspaceId={params.workspaceId} />
        </div>
      </main>
    </div>
  );
};

export default WorkspaceLayout;
