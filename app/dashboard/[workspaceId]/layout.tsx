import { Sidebar } from "./sidebar";

const WorkspaceLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspaceId: string };
}) => {
  return (
    <div className="w-full h-full flex">
      <Sidebar workspaceId={params.workspaceId} />
      <main className="md:ml-[220px]">{children}</main>
    </div>
  );
};

export default WorkspaceLayout;
