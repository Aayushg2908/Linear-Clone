import SheetMenu from "./sheet-menu";

const WorkspacePage = ({ params }: { params: { workspaceId: string } }) => {
  const { workspaceId } = params;

  return (
    <div className="w-full flex flex-col">
      <nav className="w-full h-[50px] px-4 flex items-center justify-between border-b border-b-slate-600">
        <span>All Issues</span>
        <div className="md:hidden">
          <SheetMenu workspaceId={workspaceId} />
        </div>
      </nav>
      Workspace Page
    </div>
  );
};

export default WorkspacePage;
