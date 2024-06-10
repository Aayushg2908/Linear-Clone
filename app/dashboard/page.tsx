import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const existingWorkspace = await db.workspace.findFirst({
    where: {
      ownerId: session.user.id,
    },
  });
  const joinedWorkspace = await db.workspace.findFirst({
    where: {
      members: {
        some: {
          id: session.user.id,
        },
      },
    },
  });

  if (existingWorkspace) {
    return redirect(`/dashboard/${existingWorkspace.id}`);
  } else if (joinedWorkspace) {
    return redirect(`/dashboard/${joinedWorkspace.id}`);
  }

  return redirect("/dashboard/join");
};

export default DashboardPage;
