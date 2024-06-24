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

export const getMilestones = async (projectId: string) => {
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
    return notFound();
  }

  const milestones = await db.milestone.findMany({
    where: {
      projectId,
    },
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return milestones;
};

export const updateMilestone = async ({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const milestone = await db.milestone.findUnique({
    where: {
      id,
    },
    include: {
      project: {
        select: {
          workspaceId: true,
        }
      }
    }
  });
  if (!milestone) {
    return { error: "Milestone not found" };
  }

  await db.milestone.update({
    where: {
      id,
      ownerId: session.user.id!,
    },
    data: {
      name,
      description,
    },
  });

  revalidatePath(`/dashboard/${milestone.project.workspaceId}/projects/${milestone.projectId}`);

  return { success: "Milestone updated successfully!" };
};

export const deleteMilestone = async ({ id }: { id: string }) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const milestone = await db.milestone.findUnique({
    where: {
      id,
    },
    include: {
      project: {
        select: {
          workspaceId: true,
        }
      }
    }
  });
  if(!milestone) {
    return { error: "Milestone not found" };
  }

  await db.milestone.delete({
    where: {
      id,
      ownerId: session.user.id!,
    }
  });

  revalidatePath(`/dashboard/${milestone.project.workspaceId}/projects/${milestone.projectId}`);

  return { success: "Milestone deleted successfully!" };
};
