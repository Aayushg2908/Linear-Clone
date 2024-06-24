"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Workspace } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { updateWorkspace } from "@/actions/workspace";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Minimum 1 character required",
  }),
});

const SettingsForm = ({
  workspace,
  editable,
}: {
  workspace: Workspace;
  editable: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: workspace.name,
    },
  });

  useEffect(() => {
    if (workspace.name) {
      form.setValue("name", workspace.name);
    }
  }, [workspace, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      toast.loading("Updating workspace...");
      setIsLoading(true);
      const response = await updateWorkspace({
        id: workspace.id,
        name: values.name,
      });
      if (response.error) {
        toast.error(response.error);
      } else if (response.success) {
        toast.success("Workspace name updated successfully!");
      }
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    } finally {
      toast.dismiss();
      form.reset();
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Name</FormLabel>
              <FormControl>
                <Input
                  disabled={!editable || isLoading}
                  className="max-w-[300px]"
                  placeholder="Enter the name of your workspace"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!editable || isLoading}
          variant="linear"
        >
          Update
        </Button>
      </form>
    </Form>
  );
};

export default SettingsForm;
