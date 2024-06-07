import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateIssue } from "@/hooks/use-create-issue";
import { useParams } from "next/navigation";
import { IssueSchema } from "@/lib/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { createIssue } from "@/actions/issue";
import { useState } from "react";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const CreateIssueModal = () => {
  const { type, isOpen, onClose } = useCreateIssue();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof IssueSchema>>({
    resolver: zodResolver(IssueSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof IssueSchema>) {
    try {
      setIsLoading(true);
      const data = {
        title: values.title,
        content: values.content,
        workspaceId: params.workspaceId as string,
        status: type,
      };
      await createIssue(data);
      toast.success("Issue created successfully!");
    } catch (err: any) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      form.reset();
      setIsLoading(false);
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Issue</DialogTitle>
          <DialogDescription>
            A new issue will be created in the {type} section.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the title of your Issue"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Editor onChange={field.onChange} editable={true} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              type="submit"
              variant="linear"
              className="w-full"
            >
              Create Issue
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIssueModal;
