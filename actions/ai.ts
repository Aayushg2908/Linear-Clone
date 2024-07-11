"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { notFound, redirect } from "next/navigation";

export const generateAIResponse = async ({
  prompt,
  workspaceId,
}: {
  prompt: string;
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
    include: {
      issues: {
        include: {
          owner: {
            select: {
              name: true,
            },
          },
        },
      },
      projects: {
        include: {
          owner: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  if (!workspace) {
    return notFound();
  }

  const { text } = await generateText({
    model: google("models/gemini-pro"),
    system:
      "You are helpful assistant which gives output on the basis of the input and context provided by the user. Give the output in plain text without any markdown.",
    prompt: `All the issues in the workspace are: ${workspace.issues.map(
      (issue) =>
        `${issue.title} with status ${issue.status}, label ${issue.label} and created by ${issue.owner.name}`
    )} and all the projects in the workspace are: ${workspace.projects.map(
      (project) =>
        `${project.title} with status ${project.status}, label ${project.label}, summary ${project.summary} and created by ${project.owner.name} `
    )}. Answer the prompt on the basis of the issues and the projects provided. Prompt: ${prompt}`,
  });

  return text;
};
