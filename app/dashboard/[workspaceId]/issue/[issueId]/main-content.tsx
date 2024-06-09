"use client";

import { Button } from "@/components/ui/button";
import { Issue } from "@prisma/client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { updateIssue } from "@/actions/issue";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const MainContent = ({
  issue,
  workspaceId,
}: {
  issue: Issue;
  workspaceId: string;
}) => {
  const [content, setContent] = useState(issue.content);
  const { data } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleContentSave = async () => {
    try {
      setIsLoading(true);
      toast.loading("Saving content...");
      const response = await updateIssue({
        id: issue.id,
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
    <main className="w-full h-full flex flex-col gap-y-4">
      <Button
        onClick={handleContentSave}
        disabled={content === issue.content || isLoading}
        variant="linear"
        className="w-full"
      >
        Save Content
      </Button>
      <div className="mt-4">
        <Editor
          initialContent={issue.content}
          editable={
            issue.ownerId === data?.user?.id ||
            issue.assignedTo.includes(data?.user?.id!)
          }
          onChange={(value) => setContent(value)}
        />
      </div>
    </main>
  );
};

export default MainContent;
