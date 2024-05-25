import Image from "next/image";

const Footer = () => {
  return (
    <div className="mt-4 w-full py-4 border-t border-t-slate-800 flex justify-between sm:justify-around items-center px-4">
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
      <span>©[2024] Linear. All rights reserved.</span>
    </div>
  );
};

export default Footer;
