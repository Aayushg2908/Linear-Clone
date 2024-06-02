"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { WorkspaceSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
