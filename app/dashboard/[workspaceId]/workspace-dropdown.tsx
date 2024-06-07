"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Workspace } from "@prisma/client";
import { CheckIcon, ChevronsUpDown, PlusIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  workspaceId: string;
  workspaceName: string;
  joinedWorkspaces: Workspace[];
  width: string;
};

export const WorkspaceDropdown = ({
  workspaceId,
  workspaceName,
  joinedWorkspaces,
  width,
}: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-start">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="line-clamp-1">{workspaceName}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className={width}>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/dashboard/${workspaceId}/settings`}>
                Workspace Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Switch Workspace</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <Command>
                  <CommandInput placeholder="Search workspace..." autoFocus />
                  <CommandList>
                    <CommandEmpty>No workspace found.</CommandEmpty>
                    <CommandGroup>
                      {joinedWorkspaces.map((workspace) => (
                        <CommandItem
                          key={workspace.id}
                          value={workspace.name}
                          onSelect={() =>
                            router.push(`/dashboard/${workspace.id}`)
                          }
                          className="justify-between cursor-pointer"
                        >
                          {workspace.name}
                          {workspace.id === workspaceId && (
                            <CheckIcon className="ml-2 h-4 w-4" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        className="cursor-pointer"
                        onSelect={() => router.push("/dashboard/join")}
                      >
                        <PlusIcon className="size-4 mr-1" />
                        Create Workspace
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={async () => {
                await signOut({ callbackUrl: "/sign-in" });
              }}
            >
              Log Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
