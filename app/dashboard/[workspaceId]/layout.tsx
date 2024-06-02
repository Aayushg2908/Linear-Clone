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
      <div className="max-md:hidden">
        <Sidebar workspaceId={params.workspaceId} />
      </div>
      <main className="w-full h-full md:ml-[220px]">{children}</main>
    </div>
  );
};

export default WorkspaceLayout;
