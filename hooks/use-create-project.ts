import { PROJECTTYPE } from "@prisma/client";
import { create } from "zustand";

interface ProjectModalState {
  type: PROJECTTYPE;
  isOpen: boolean;
  onOpen: (type: PROJECTTYPE) => void;
  onClose: () => void;
}

export const useCreateProject = create<ProjectModalState>((set) => ({
  type: "PLANNED",
  isOpen: false,
  onOpen: (type) => set(() => ({ isOpen: true, type })),
  onClose: () => set(() => ({ isOpen: false, type: "PLANNED" })),
}));
