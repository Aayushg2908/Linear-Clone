import "server-only";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

const InvitePage = async ({ params }: { params: { inviteCode: string } }) => {
  const session = await auth();
  if (!session?.user && session?.user?.id) {
    return redirect("/sign-in");
  }

  const { inviteCode } = params;

  const workspace = await db.workspace.findUnique({
    where: {
      inviteCode,
    },
    select: {
      id: true,
      members: true,
    },
  });
  if (!workspace) {
    return notFound();
  }

  if (workspace.members.some((member) => member.id === session?.user?.id)) {
    return redirect(`/dashboard/${workspace.id}`);
  }

  await db.workspace.update({
    where: {
      id: workspace.id,
    },
    data: {
      members: {
        connect: {
          id: session?.user?.id!,
        },
      },
    },
  });

  revalidatePath(`/dashboard/${workspace.id}`);

  return redirect(`/dashboard/${workspace.id}`);
};

export default InvitePage;
