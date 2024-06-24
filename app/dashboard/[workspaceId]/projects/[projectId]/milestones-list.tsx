"use client";

import { timeAgo } from "@/lib/utils";
import { Milestone, User } from "@prisma/client"
import { EditIcon, Ellipsis, Trash2, UserCircle2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProjectMilestone } from "@/hooks/use-project-milestone";
import { toast } from "sonner";
import { deleteMilestone } from "@/actions/milestone";

interface MilestoneListProps {
  milestones: (Milestone & {
    owner: User;
  })[];
}

const MilestonesList = ({milestones}: MilestoneListProps) => {
  const { data } = useSession();
  const {onOpen} = useProjectMilestone();

  const handleMilestoneDelete = async (id: string) => {
    try {
      toast.loading("Deleting milestone...");
      const response = await deleteMilestone({ id });
      if(response.error) {
        toast.error(response.error);
      } else if(response.success) {
        toast.success("Milestone deleted successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong, please try again."); 
    } finally {
      toast.dismiss();
    }
  }

  return (
    <div className="mt-4 flex flex-col w-full gap-y-2">
      {milestones.map((milestone) => (
        <div
          key={milestone.id}
          className="w-full rounded-lg min-h-[80px] bg-neutral-800 relative flex flex-col p-3 items-start gap-y-1 group"
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              {milestone.owner.image ? (
                <Image
                  src={milestone.owner.image}
                  alt="user-image"
                  width={30}
                  height={30}
                  className="size-5 rounded-full"
                />
              ) : (
                <UserCircle2Icon className="size-5 bg-indigo-500 text-white rounded-full" />
              )}
              <span className="font-bold text-sm">{milestone.owner.name}</span>
              <span className="text-sm">{timeAgo(milestone.createdAt)}</span>
            </div>
            {data?.user?.id === milestone.ownerId && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis className="size-5 hidden group-hover:block cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => onOpen("EDIT", milestone.projectId, milestone.id, milestone.name, milestone.description)}
                    className="cursor-pointer"
                  >
                    <EditIcon className="size-5 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleMilestoneDelete(milestone.id)}
                    className="cursor-pointer"
                  >
                    <Trash2 className="size-5 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <h1 className="mt-1 ml-1 text-xl text-indigo-400">{milestone.name}</h1>
          <p className="ml-1 text-sm">{milestone.description}</p>
        </div>
      ))}
    </div>
  )
}

export default MilestonesList;
