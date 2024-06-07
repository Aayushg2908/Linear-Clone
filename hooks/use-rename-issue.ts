import { create } from "zustand";

interface RenameIssueState {
  issueId: string;
  workspaceId: string;
  value: string;
  isOpen: boolean;
  onOpen: (issueId: string, workspaceId: string, value: string) => void;
  onClose: () => void;
}

export const useRenameIssue = create<RenameIssueState>((set) => ({
  issueId: "",
  workspaceId: "",
  value: "",
  isOpen: false,
  onOpen: (issueId, workspaceId, value) =>
    set(() => ({ issueId, isOpen: true, value, workspaceId })),
  onClose: () =>
    set(() => ({ isOpen: false, issueId: "", value: "", workspaceId: "" })),
}));
