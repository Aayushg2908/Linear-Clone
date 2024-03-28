"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {JSON.stringify(session.data)}
      <Button>Home Page</Button>
    </div>
  );
}
