"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ISSUELABEL, ISSUETYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";

export const createIssue = async ({
  title,
  content,
  workspaceId,
  status,
}: {
  title: string;
  content: string;
  workspaceId: string;
  status: ISSUETYPE;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const lastIssue = await db.issue.findFirst({
    where: {
      workspaceId,
      status,
    },
    orderBy: {
      order: "desc",
    },
  });
  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  await db.issue.create({
    data: {
      title,
      content,
      status,
      workspaceId,
      ownerId: session.user.id!,
      order: newOrder,
    },
  });

  revalidatePath(`/dashboard/${workspaceId}`);
};

export const getAllIssues = async ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  return db.issue.findMany({
    where: {
      workspaceId,
    },
    orderBy: {
      order: "asc",
    },
  });
};

export const updateIssue = async ({
  id,
  workspaceId,
  values,
}: {
  id: string;
  workspaceId: string;
  values: {
    title?: string;
    content?: string;
    status?: ISSUETYPE;
    order?: number;
    label?: ISSUELABEL | null;
  };
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const issue = await db.issue.findUnique({
    where: {
      id,
      workspaceId,
    },
  });
  if (!issue) {
    return { error: "Issue not found" };
  }

  if (
    issue.ownerId === session.user.id ||
    issue.assignedTo.includes(session.user.id!)
  ) {
    await db.issue.update({
      where: {
        id,
        workspaceId,
      },
      data: {
        ...values,
      },
    });

    revalidatePath(`/dashboard/${workspaceId}`);
    revalidatePath(`/dashboard/${workspaceId}/issue/${id}`);

    return { success: "Issue status updated successfully!" };
  }

  return { error: "You do not have the permission to do this action!" };
};

export const deleteIssue = async ({
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

  const issue = await db.issue.findUnique({
    where: {
      id,
      workspaceId,
    },
  });
  if (!issue) {
    return { error: "Issue not found" };
  }

  if (
    issue.ownerId === session.user.id ||
    issue.assignedTo.includes(session.user.id!)
  ) {
    await db.issue.delete({
      where: {
        id,
      },
    });

    revalidatePath(`/dashboard/${workspaceId}`);

    return { success: "Issue deleted successfully!" };
  }

  return { error: "You do not have the permission to do this action!" };
};

export const getIssueById = async ({
  workspaceId,
  issueId,
}: {
  workspaceId: string;
  issueId: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const issue = await db.issue.findUnique({
    where: {
      id: issueId,
      workspaceId,
    },
  });
  if (!issue) {
    return notFound();
  }

  return issue;
};

export const assignIssue = async ({
  issueId,
  userId,
  workspaceId,
  type,
}: {
  issueId: string;
  userId: string;
  workspaceId: string;
  type: "ASSIGN" | "REMOVE";
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const issue = await db.issue.findUnique({
    where: {
      id: issueId,
      workspaceId,
    },
  });
  if (!issue) {
    return { error: "Issue not found" };
  }

  if (issue.ownerId === session.user.id) {
    if (type === "ASSIGN") {
      await db.issue.update({
        where: {
          id: issueId,
        },
        data: {
          assignedTo: {
            push: userId,
          },
        },
      });
      revalidatePath(`/dashboard/${workspaceId}`);
      revalidatePath(`/dashboard/${workspaceId}/issue/${issueId}`);

      return { success: "Issue assigned successfully!" };
    } else if (type === "REMOVE") {
      await db.issue.update({
        where: {
          id: issueId,
        },
        data: {
          assignedTo: {
            set: issue.assignedTo.filter((id) => id !== userId),
          },
        },
      });

      revalidatePath(`/dashboard/${workspaceId}`);
      revalidatePath(`/dashboard/${workspaceId}/issue/${issueId}`);

      return { success: "Issue unassigned successfully!" };
    }
  }

  return { error: "You do not have the permission to do this action!" };
};
