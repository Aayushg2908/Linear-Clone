"use client";

import { Button } from "@/components/ui/button";
import { useProjectMilestone } from "@/hooks/use-project-milestone";
import { PlusIcon } from "lucide-react";

const CreateMilestoneButton = ({
  projectId,
}: {
  projectId: string;
}) => {
  const { onOpen } = useProjectMilestone();

  return (
    <Button onClick={() => onOpen("CREATE", projectId)} variant="outline" className="mt-4">
      <PlusIcon className="size-5" /> Add Milestone
    </Button>
  )
}

export default CreateMilestoneButton
