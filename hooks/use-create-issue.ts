import { ISSUETYPE } from "@prisma/client";
import { create } from "zustand";

interface IssueModalState {
  type: ISSUETYPE;
  isOpen: boolean;
  onOpen: (type: ISSUETYPE) => void;
  onClose: () => void;
}

export const useCreateIssue = create<IssueModalState>((set) => ({
  type: "TODO",
  isOpen: false,
  onOpen: (type) => set(() => ({ isOpen: true, type })),
  onClose: () => set(() => ({ isOpen: false, type: "TODO" })),
}));
