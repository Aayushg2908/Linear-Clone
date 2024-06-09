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
  });

  return comments;
};
