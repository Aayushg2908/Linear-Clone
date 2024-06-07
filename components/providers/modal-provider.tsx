"use client";

import { useEffect, useState } from "react";
import CreateIssueModal from "../CreateIssueModal";
import RenameIssueModal from "../RenameIssueModal";

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
    </>
  );
};

export default ModalProvider;
