import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useRenameProject } from "@/hooks/use-rename-project";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateProject } from "@/actions/project";
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

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Minimum 1 character required",
  }),
  summary: z.string().min(5, {
    message: "Minimum 5 character required",
  }),
});

const RenameProjectModal = () => {
  const { projectId, workspaceId, title, summary, isOpen, onClose } =
    useRenameProject();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title,
      summary: summary,
    },
  });

  useEffect(() => {
    if (title && summary) {
      form.setValue("title", title);
      form.setValue("summary", summary);
    }
  }, [title, summary, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const response = await updateProject({
        id: projectId,
        workspaceId: workspaceId,
        values: {
          title: values.title,
          summary: values.summary,
        },
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Project renamed successfully!");
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
          <DialogTitle>Rename Project</DialogTitle>
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
                      placeholder="Enter the title of your Project"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a short summary of your project"
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
              Rename Project
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameProjectModal;
