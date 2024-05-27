"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { WorkspaceSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createWorkspace } from "@/actions/workspace";

const JoinPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useSession();
  if (data?.user && !data?.user?.id) {
    router.push("/sign-in");
  }

  const form = useForm<z.infer<typeof WorkspaceSchema>>({
    resolver: zodResolver(WorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof WorkspaceSchema>) {
    try {
      setIsLoading(true);
      const data = await createWorkspace({ name: values.name });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("Workspace created successfully.");
        router.push(`/dashboard/${data.id}`);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      form.reset();
    }
  }

  return (
    <div className="w-full h-full">
      <nav className="w-full flex items-center justify-between px-6 h-[70px]">
        <div
          onClick={() => router.back()}
          className="flex items-center gap-x-1 cursor-pointer"
        >
          <ArrowLeft className="size-6" />
          Back to Linear
        </div>
        <div className="flex flex-col justify-center text-sm">
          <span className="text-slate-400">Logged in as:</span>
          <span>{data?.user?.email}</span>
        </div>
      </nav>
      <main className="w-full flex flex-col items-center mt-10 gap-y-4">
        <h1 className="text-xl sm:text-2xl font-semibold">
          Create a New Workspace
        </h1>
        <p className="px-2 text-slate-400 max-w-xl text-center">
          Workspaces are shared environments where teams can work on projects,
          cycles and issues.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-xl mt-6 px-2"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        autoFocus
                        type="text"
                        className="h-[50px] text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              variant="linear"
              size="lg"
              disabled={isLoading}
              type="submit"
              className="w-full"
            >
              Create Workspace
            </Button>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default JoinPage;
