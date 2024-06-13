"use client";

import { updateProject } from "@/actions/project";
import { Button } from "@/components/ui/button";
import { Project } from "@prisma/client";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const MainContent = ({
  project,
  workspaceId,
}: {
  project: Project;
  workspaceId: string;
}) => {
  const { data } = useSession();
  const [content, setContent] = useState(project.content);
  const [isLoading, setIsLoading] = useState(false);

  const handleContentSave = async () => {
    try {
      setIsLoading(true);
      toast.loading("Saving content...");
      const response = await updateProject({
        id: project.id,
        workspaceId: workspaceId,
        values: {
          content,
        },
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Content saved successfully.");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
      setIsLoading(false);
    }
  };

  return (
    <main className="mt-2 w-full h-full flex flex-col gap-y-4">
      <Button
        onClick={handleContentSave}
        disabled={content === project.content || isLoading}
        variant="linear"
        className="w-full"
      >
        Save Content
      </Button>
      <div className="mt-4">
        <Editor
          initialContent={project.content}
          editable={
            project.ownerId === data?.user?.id ||
            project.members.includes(data?.user?.id!) ||
            project.lead === data?.user?.id
          }
          onChange={(value) => setContent(value)}
        />
      </div>
    </main>
  );
};

export default MainContent;
