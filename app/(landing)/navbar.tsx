import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full h-[60px] backdrop-blur-lg bg-transparent/50 flex justify-between sm:justify-around items-center border-b border-b-slate-800 px-4">
      <div className="flex items-center gap-x-2">
        <Image
          src="/logo.svg"
          alt="logo"
          width={20}
          height={20}
          className="size-6"
        />
        <h1 className="text-xl font-bold">Linear</h1>
      </div>
      <div className="flex items-center gap-x-2">
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "font-bold",
              size: "sm",
            })
          )}
        >
          Log in
        </Link>
        <Link
          href="/sign-up"
          className={cn(
            buttonVariants({
              variant: "linear",
              className: "font-bold",
              size: "sm",
            })
          )}
        >
          Sign up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
