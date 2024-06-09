"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addComment = async ({
  value,
  issueId,
}: {
  value: string;
  issueId: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const issue = await db.issue.findUnique({
    where: {
      id: issueId,
    },
  });
  if (!issue) {
    return { error: "Issue not found" };
  }

  await db.comment.create({
    data: {
      value,
      issueId,
      ownerId: session.user.id!,
    },
  });

  revalidatePath(`/dashboard/${issue.workspaceId}/issue/${issueId}`);

  return { success: "Comment added successfully!" };
};

export const getAllComments = async ({ issueId }: { issueId: string }) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const comments = await db.comment.findMany({
    where: {
      issueId,
    },
    include: {
      owner: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments;
};

export const deleteComment = async ({ id }: { id: string }) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const comment = await db.comment.findUnique({
    where: {
      id,
    },
    select: {
      issue: {
        select: {
          workspaceId: true,
        },
      },
      issueId: true,
    },
  });
  if (!comment) {
    return { error: "Comment not found" };
  }

  await db.comment.delete({
    where: {
      id,
      ownerId: session.user.id!,
    },
  });

  revalidatePath(
    `/dashboard/${comment.issue.workspaceId}/issue/${comment.issueId}`
  );

  return { success: "Comment deleted successfully!" };
};

export const updateComment = async ({
  value,
  issueId,
  commentId,
}: {
  value: string;
  issueId: string;
  commentId: string;
}) => {
  const session = await auth();
  if (!session?.user && !session?.user?.id) {
    return redirect("/sign-in");
  }

  const issue = await db.issue.findUnique({
    where: {
      id: issueId,
    },
  });
  if (!issue) {
    return { error: "Issue not found" };
  }

  const comment = await db.comment.findUnique({
    where: {
      id: commentId,
    },
  });
  if (!comment) {
    return { error: "Comment not found" };
  }

  await db.comment.update({
    where: {
      id: commentId,
      ownerId: session.user.id!,
    },
    data: {
      value,
    },
  });

  revalidatePath(`/dashboard/${issue.workspaceId}/issue/${issueId}`);

  return { success: "Comment updated successfully!" };
};
