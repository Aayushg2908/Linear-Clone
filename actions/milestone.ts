"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export const createMilestone = async ({
  projectId,
  name,
  description,
}: {
  projectId: string;
  name: string;
  description: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if(!project) {
    return { error: "Project not found" };
  }

  await db.milestone.create({
    data: {
      name,
      description,
      projectId,
      ownerId: session.user.id!,
    }
  })

  revalidatePath(`/dashboard/${project.workspaceId}/projects/${projectId}`);

  return { success: "Milestone added successfully!" };
};
