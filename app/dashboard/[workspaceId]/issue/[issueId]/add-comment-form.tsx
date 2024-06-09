"use client";

import { addComment } from "@/actions/comment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonalIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AddCommentForm = ({ issueId }: { issueId: string }) => {
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleComment = async () => {
    try {
      setIsLoading(true);
      const response = await addComment({ value: comment, issueId });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Comment added successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
      setComment("");
    }
  };

  return (
    <div className="mt-4 flex items-center px-0.5 gap-x-1">
      <Input
        disabled={isLoading}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="w-full"
      />
      <Button
        disabled={isLoading}
        onClick={handleComment}
        size="icon"
        variant="linear"
      >
        <SendHorizonalIcon className="size-5" />
      </Button>
    </div>
  );
};

export default AddCommentForm;
