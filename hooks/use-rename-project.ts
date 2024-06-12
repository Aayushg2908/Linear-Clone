import { create } from "zustand";

interface RenameProjectState {
  projectId: string;
  workspaceId: string;
  title: string;
  summary: string;
  isOpen: boolean;
  onOpen: (
    projectId: string,
    workspaceId: string,
    title: string,
    summary: string
  ) => void;
  onClose: () => void;
}

export const useRenameProject = create<RenameProjectState>((set) => ({
  projectId: "",
  workspaceId: "",
  title: "",
  summary: "",
  isOpen: false,
  onOpen: (projectId, workspaceId, title, summary) =>
    set(() => ({ projectId, isOpen: true, title, summary, workspaceId })),
  onClose: () =>
    set(() => ({
      isOpen: false,
      projectId: "",
      title: "",
      summary: "",
      workspaceId: "",
    })),
}));
