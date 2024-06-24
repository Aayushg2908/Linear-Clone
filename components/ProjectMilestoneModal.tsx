import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useEffect, useState } from "react";
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
import { Button } from "./ui/button";
import { useProjectMilestone } from "@/hooks/use-project-milestone";
import { createMilestone, updateMilestone } from "@/actions/milestone";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Minimum 1 character required",
  }),
  description: z.string().min(5, {
    message: "Minimum 5 character required",
  }),
});

const ProjectMilestoneModal = () => {
  const {type, projectId, milestoneId, name, description, isOpen, onClose} = useProjectMilestone();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: type === "EDIT" ? name : "",
      description: type === "EDIT" ? description : "",
    },
  });

  useEffect(() => {
    if (type === "EDIT" && name && description) {
      form.setValue("name", name);
      form.setValue("description", description);
    }
  }, [name, description, form, type]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      if(type === "CREATE") {
        const response = await createMilestone({
          projectId,
          name: values.name,
          description: values.description,
        })
        if(response.error) {
          toast.error(response.error);
        } else if(response.success) {
          toast.success("Milestone created successfully!");
        }
      } else {
        const response = await updateMilestone({
          id: milestoneId,
          name: values.name,
          description: values.description,
        });
        if(response.error) {
          toast.error(response.error);
        } else if(response.success) {
          toast.success("Milestone updated successfully!");
        }
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
          <DialogTitle>{type === "CREATE" ? "Create Milestone" : "Edit Milestone"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the name of your Milestone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a short description of your milestone"
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
              {type === "CREATE" ? "Create Milestone" : "Edit Milestone"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectMilestoneModal;
