"use client";

import { deleteComment } from "@/actions/comment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { timeAgo } from "@/lib/utils";
import { Comment, User } from "@prisma/client";
import { EditIcon, Ellipsis, Trash2, UserCircleIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import AddCommentForm from "./add-comment-form";

interface CommentsListProps {
  comments: (Comment & {
    owner: User;
  })[];
}

const CommentsList = ({ comments }: CommentsListProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDeleteComment = async (id: string) => {
    try {
      toast.loading("Deleting comment...");
      const response = await deleteComment({ id });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Comment deleted successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    } finally {
      toast.dismiss();
    }
  };

  return (
    <div className="mt-4 flex flex-col w-full gap-y-2">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="w-full rounded-lg min-h-[80px] bg-neutral-800 relative flex flex-col p-3 items-start gap-y-1 group"
        >
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              {comment.owner.image ? (
                <Image
                  src={comment.owner.image}
                  alt="user-image"
                  width={30}
                  height={30}
                  className="size-5 rounded-full"
                />
              ) : (
                <UserCircleIcon className="size-5 bg-indigo-500 text-white rounded-full" />
              )}
              <span className="font-bold text-sm">{comment.owner.name}</span>
              <span className="text-sm">{timeAgo(comment.createdAt)}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Ellipsis className="size-5 hidden group-hover:block cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onSelect={() => setIsEditing(true)}
                  className="cursor-pointer"
                >
                  <EditIcon className="size-5 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => handleDeleteComment(comment.id)}
                  className="cursor-pointer"
                >
                  <Trash2 className="size-5 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {isEditing ? (
            <AddCommentForm
              issueId={comment.issueId}
              value={comment.value}
              commentId={comment.id}
              onSubmitted={() => setIsEditing(false)}
            />
          ) : (
            <p className="mt-2 ml-1 text-lg">{comment.value}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
