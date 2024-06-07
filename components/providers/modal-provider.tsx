"use client";

import { useEffect, useState } from "react";
import CreateIssueModal from "../CreateIssueModal";

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
    </>
  );
};

export default ModalProvider;
