"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { PROJECTTYPE } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

  await db.project.create({
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

  revalidatePath(`/dashboard/${workspaceId}`);
};
