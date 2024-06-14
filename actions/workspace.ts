"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { WorkspaceSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";

export const createWorkspace = async (
  data: z.infer<typeof WorkspaceSchema>
) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const existingUser = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  if (!existingUser) {
    return { error: "User not found" };
  }

  const workspace = await db.workspace.create({
    data: {
      name: data.name,
      ownerId: session.user.id!,
      members: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });

  revalidatePath("/dashboard/[workspaceId]", "layout");

  return { id: workspace.id };
};

export const getWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
    select: {
      members: true,
    },
  });
  if (!workspace) {
    return notFound();
  }

  return workspace;
};

export const getWorkspaceById = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
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

  return workspace;
};

export const updateWorkspace = async ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id,
    },
  });
  if (!workspace) {
    return { error: "Workspace not found" };
  }

  await db.workspace.update({
    where: {
      id,
      ownerId: session.user.id!,
    },
    data: {
      name,
    },
  });

  revalidatePath("/dashboard/[workspaceId]", "layout");
  revalidatePath(`/dashboard/${id}/settings`);

  return { success: "Workspace name updated successfully" };
};

export const removeMemberFromWorkspace = async ({
  workspaceId,
  memberId,
}: {
  workspaceId: string;
  memberId: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });
  if (!workspace) {
    return { error: "Workspace not found" };
  }

  await db.workspace.update({
    where: {
      id: workspaceId,
      ownerId: session.user.id!,
    },
    data: {
      members: {
        disconnect: {
          id: memberId,
        },
      },
    },
  });

  revalidatePath("/dashboard/[workspaceId]", "layout");
  revalidatePath(`/dashboard/${workspaceId}/settings`);

  return { success: "Member removed successfully" };
};

export const deleteWorkspace = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });
  if (!workspace) {
    return { error: "Workspace not found" };
  }

  await db.workspace.delete({
    where: {
      id: workspaceId,
      ownerId: session.user.id!,
    },
  });

  revalidatePath("/dashboard", "layout");

  return { success: "Workspace deleted successfully" };
};
