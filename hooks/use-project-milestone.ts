import { create } from "zustand";

type Type = "CREATE" | "EDIT";

interface ProjectMilestoneState {
  type: Type;
  milestoneId: string;
  projectId: string;
  name: string;
  description: string;
  isOpen: boolean;
  onOpen: (type: Type, projectId: string, milestoneId?: string, name?: string, description?: string) => void;
  onClose: () => void;
}

export const useProjectMilestone = create<ProjectMilestoneState>((set) => ({
  type: "CREATE",
  milestoneId: "",
  projectId: "",
  name: "",
  description: "",
  isOpen: false,
  onOpen: (type, projectId, milestoneId, name, description) => set(() => ({ isOpen: true, type, projectId, name, description, milestoneId })),
  onClose: () => set(() => ({ isOpen: false, type: "CREATE", projectId: "", workspaceId: "", name: "", milestoneId: "" })),
}));
