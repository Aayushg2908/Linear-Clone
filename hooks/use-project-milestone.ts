import { create } from "zustand";

type Type = "CREATE" | "EDIT";

interface ProjectMilestoneState {
  type: Type;
  projectId: string;
  name: string;
  description: string;
  isOpen: boolean;
  onOpen: (type: Type, projectId: string, name?: string, description?: string) => void;
  onClose: () => void;
}

export const useProjectMilestone = create<ProjectMilestoneState>((set) => ({
  type: "CREATE",
  projectId: "",
  name: "",
  description: "",
  isOpen: false,
  onOpen: (type, projectId, name, description) => set(() => ({ isOpen: true, type, projectId, name, description })),
  onClose: () => set(() => ({ isOpen: false, type: "CREATE", projectId: "", workspaceId: "", name: "" })),
}));
