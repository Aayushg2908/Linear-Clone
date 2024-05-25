import { auth } from "@/auth";
import Footer from "./footer";
import Hero from "./hero";
import Navbar from "./navbar";
import { redirect } from "next/navigation";
import { DEFAULT_REDIRECT } from "@/constants";

export default async function Home() {
  const session = await auth();
  if (session && session.user && session.user.id) {
    return redirect(DEFAULT_REDIRECT);
  }

  return (
    <main className="w-full h-full flex flex-col">
      <Navbar />
      <Hero />
      <Footer />
    </main>
  );
}
