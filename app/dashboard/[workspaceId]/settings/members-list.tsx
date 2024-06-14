"use client";

import { removeMemberFromWorkspace } from "@/actions/workspace";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { UserCircleIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const MembersList = ({
  id,
  members,
  editable,
}: {
  id: string;
  members: User[];
  editable: boolean;
}) => {
  const handleRemoveMember = async (memberId: string, name: string) => {
    try {
      toast.loading(`Removing ${name} from this workspace...`);
      const response = await removeMemberFromWorkspace({
        workspaceId: id,
        memberId,
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success(`${name} removed successfully!`);
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="flex flex-col gap-y-2 mt-2 w-full">
      {members.map((member) => (
        <div
          key={member.id}
          className="max-w-[300px] h-[50px] flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-x-2">
            {member.image ? (
              <Image
                src={member.image}
                alt="user-logo"
                width={32}
                height={32}
                className="rounded-full size-6"
              />
            ) : (
              <UserCircleIcon className="size-6 rounded-full text-slate-300" />
            )}
            <span>{member.name}</span>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                disabled={!editable}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Remove
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to remove the member?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove the
                  member from the workspace.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleRemoveMember(member.id, member.name!)}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ))}
    </div>
  );
};

export default MembersList;
