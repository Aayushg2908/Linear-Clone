"use client";

import { timeAgo } from "@/lib/utils";
import { Comment, User } from "@prisma/client";
import { Ellipsis, UserCircleIcon } from "lucide-react";
import Image from "next/image";

interface CommentsListProps {
  comments: (Comment & {
    owner: User;
  })[];
}

const CommentsList = ({ comments }: CommentsListProps) => {
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
            <Ellipsis className="size-5 hidden group-hover:block cursor-pointer" />
          </div>
          <p className="mt-2 ml-1 text-lg">{comment.value}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
