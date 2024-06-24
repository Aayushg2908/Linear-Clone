"use client";

import { useEffect, useState } from "react";
import CreateIssueModal from "../CreateIssueModal";
import RenameIssueModal from "../RenameIssueModal";
import CreateProjectModal from "../CreateProjectModal";
import RenameProjectModal from "../RenameProjectModal";
import ProjectMilestoneModal from "../ProjectMilestoneModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateIssueModal />
      <RenameIssueModal />
      <CreateProjectModal />
      <RenameProjectModal />
      <ProjectMilestoneModal />
    </>
  );
};

export default ModalProvider;
