import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateProject } from "@/hooks/use-create-project";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ProjectSchema } from "@/lib/schema";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import dynamic from "next/dynamic";
import { Button } from "./ui/button";
import { createProject } from "@/actions/project";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

const CreateProjectModal = () => {
  const { type, isOpen, onClose } = useCreateProject();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ProjectSchema>>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      title: "",
      summary: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof ProjectSchema>) {
    try {
      setIsLoading(true);
      const data = {
        title: values.title,
        summary: values.summary,
        content: values.content,
        workspaceId: params.workspaceId as string,
        status: type,
      };
      await createProject(data);
      toast.success("Project created successfully!");
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
      setIsLoading(false);
      onClose();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            A new project will be created in the {type} section.
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
              Create Project
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
