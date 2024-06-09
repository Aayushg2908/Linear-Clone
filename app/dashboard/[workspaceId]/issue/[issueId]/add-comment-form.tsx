"use client";

import { addComment, updateComment } from "@/actions/comment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonalIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddCommentFormProps {
  issueId: string;
  value?: string;
  commentId?: string;
  onSubmitted?: () => void;
}

const AddCommentForm = ({
  issueId,
  value,
  commentId,
  onSubmitted,
}: AddCommentFormProps) => {
  const [comment, setComment] = useState(value || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleComment = async () => {
    try {
      setIsLoading(true);
      if (!commentId) {
        const response = await addComment({ value: comment, issueId });
        if (response.error) {
          toast.error(response.error);
        } else if (response.success) {
          toast.success("Comment added successfully!");
        }
      } else {
        const response = await updateComment({
          value: comment,
          issueId,
          commentId,
        });
        if (response.error) {
          toast.error(response.error);
        } else if (response.success) {
          toast.success("Comment updated successfully!");
          onSubmitted?.();
        }
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
      setComment("");
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleComment();
      }}
      className="w-full mt-4 flex items-center px-0.5 gap-x-1"
    >
      <Input
        disabled={isLoading}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="w-full"
      />
      <Button
        type="submit"
        disabled={isLoading}
        onClick={handleComment}
        size="icon"
        variant="linear"
      >
        <SendHorizonalIcon className="size-5" />
      </Button>
    </form>
  );
};

export default AddCommentForm;
