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
  if (!existingWorkspace) {
    return redirect("/dashboard/join");
  }

  return redirect(`/dashboard/${existingWorkspace.id}`);
};

export default DashboardPage;
