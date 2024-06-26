"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { PROJECTLABEL, PROJECTTYPE, Project } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export const createProject = async ({
  title,
  summary,
  content,
  workspaceId,
  status,
}: {
  title: string;
  summary: string;
  content: string;
  workspaceId: string;
  status: PROJECTTYPE;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const lastProject = await db.project.findFirst({
    where: {
      workspaceId,
      status,
    },
    orderBy: {
      order: "desc",
    },
  });
  const newOrder = lastProject ? lastProject.order + 1 : 0;

  const createdProject = await db.project.create({
    data: {
      title,
      content,
      summary,
      status,
      workspaceId,
      ownerId: session.user.id!,
      order: newOrder,
    },
  });

  pusherServer.trigger(workspaceId, "project-created", createdProject);

  revalidatePath(`/dashboard/${workspaceId}/projects`);
};

export const getAllProjects = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  return db.project.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      order: "asc",
    },
  });
};

export const updateProject = async ({
  id,
  workspaceId,
  values,
}: {
  id: string;
  workspaceId: string;
  values: {
    title?: string;
    summary?: string;
    content?: string;
    status?: PROJECTTYPE;
    order?: number;
    label?: PROJECTLABEL | null;
    startDate?: Date;
    endDate?: Date;
    lead?: string | null;
  };
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const project = await db.project.findUnique({
    where: {
      id,
      workspaceId,
    },
  });
  if (!project) {
    return { error: "Project not found" };
  }

  if (
    project.ownerId === session.user.id ||
    project.lead === session.user.id ||
    project.members.includes(session.user.id!)
  ) {
    const updatedProject = await db.project.update({
      where: {
        id,
        workspaceId,
      },
      data: {
        ...values,
      },
    });

    if(!values.order) {
      pusherServer.trigger(workspaceId, "project-updated", {
        updatedProject,
        status: values.status ? true: false,
        prevStatus: project.status,
        newStatus: values.status,
      });
    }

    revalidatePath(`/dashboard/${workspaceId}/projects`);
    revalidatePath(`/dashboard/${workspaceId}/projects/${id}`);

    return { success: "Project status updated successfully!" };
  }

  return { error: "You do not have the permission to do this action!" };
};

export const realtimeUpdateProject = async ({
  projects,
  workspaceId,
}: {
    projects: {
      BACKLOG: Project[];
      PLANNED: Project[];
      INPROGRESS: Project[];
      COMPLETED: Project[];
      CANCELLED: Project[];
    }
    workspaceId: string;
  }) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  pusherServer.trigger(workspaceId, "project-dragged-and-dropped", projects);
};

export const deleteProject = async ({
  id,
  workspaceId,
}: {
  id: string;
  workspaceId: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const project = await db.project.findUnique({
    where: {
      id,
      workspaceId,
    },
  });
  if (!project) {
    return { error: "Project not found" };
  }

  if (project.ownerId === session.user.id || project.lead === session.user.id) {
    await db.project.delete({
      where: {
        id,
      },
    });

    pusherServer.trigger(workspaceId, "project-deleted", {
      id,
      status: project.status,
    });

    revalidatePath(`/dashboard/${workspaceId}/projects`);

    return { success: "Project deleted successfully!" };
  }

  return { error: "You do not have the permission to do this action!" };
};

export const addMember = async ({
  userId,
  projectId,
  workspaceId,
  type,
}: {
  projectId: string;
  userId: string;
  workspaceId: string;
  type: "ASSIGN" | "REMOVE";
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
      workspaceId,
    },
  });
  if (!project) {
    return { error: "Project not found" };
  }

  if (project.ownerId === session.user.id || project.lead === session.user.id) {
    if (type === "ASSIGN") {
      await db.project.update({
        where: {
          id: projectId,
        },
        data: {
          members: {
            push: userId,
          },
        },
      });
    } else {
      await db.project.update({
        where: {
          id: projectId,
        },
        data: {
          members: {
            set: project.members.filter((member) => member !== userId),
          },
        },
      });
    }

    revalidatePath(`/dashboard/${workspaceId}/projects`);
    revalidatePath(`/dashboard/${workspaceId}/projects/${projectId}`);

    return { success: "Member updated successfully!" };
  }

  return { error: "You do not have the permission to do this action!" };
};

export const getProjectById = async ({
  workspaceId,
  projectId,
}: {
  workspaceId: string;
  projectId: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
      workspaceId,
    },
  });
  if (!project) {
    return notFound();
  }

  return project;
};

