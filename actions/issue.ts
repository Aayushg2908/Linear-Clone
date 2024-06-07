"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ISSUETYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
