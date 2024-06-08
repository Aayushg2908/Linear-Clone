import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRenameIssue } from "@/hooks/use-rename-issue";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateIssue } from "@/actions/issue";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Minimum 1 character required",
  }),
});

const RenameIssueModal = () => {
  const { issueId, workspaceId, value, isOpen, onClose } = useRenameIssue();
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: value,
    },
  });

  useEffect(() => {
    if (value) {
      form.setValue("title", value);
    }
  }, [value, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await updateIssue({
        id: issueId,
        userId: data?.user?.id!,
        workspaceId: workspaceId,
        values: {
          title: values.title,
        },
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Issue renamed successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      form.reset();
      onClose();
      setIsLoading(false);
      toast.dismiss();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Rename Issue</DialogTitle>
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
            <Button
              disabled={isLoading}
              type="submit"
              variant="linear"
              className="w-full"
            >
              Rename Issue
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameIssueModal;
