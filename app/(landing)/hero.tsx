"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const issuesRef = useRef();
  const issuesTextRef = useRef();
  const resultsRef = useRef();
  const resultsTextRef = useRef();

  useGSAP(() => {
    gsap.to(".home", {
      ease: "power1.inOut",
      opacity: 1,
      y: 0,
      delay: 1,
      stagger: 0.3,
    });

    gsap.to(".home-image", {
      ease: "power1.inOut",
      rotationY: 0,
      delay: 2,
    });
  });

  useGSAP(
    () => {
      // @ts-ignore
      const lamps = gsap.utils.toArray(issuesRef.current.children);

      lamps.forEach((lamp) => {
        gsap.to(
          // @ts-ignore
          lamp,
          {
            ease: "power1.inOut",
            opacity: 1,
            width: "30rem",
            duration: 0.8,
            scrollTrigger: {
              trigger: lamp,
              start: "top 70%",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: issuesRef }
  );

  useGSAP(
    () => {
      gsap.to(issuesTextRef.current!, {
        ease: "power1.inOut",
        y: -30,
        scrollTrigger: {
          trigger: issuesTextRef.current!,
          start: "top 90%",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    { scope: issuesTextRef }
  );

  useGSAP(
    () => {
      // @ts-ignore
      const lamps = gsap.utils.toArray(resultsRef.current.children);

      lamps.forEach((lamp) => {
        gsap.to(
          // @ts-ignore
          lamp,
          {
            ease: "power1.inOut",
            opacity: 1,
            width: "30rem",
            duration: 0.8,
            scrollTrigger: {
              trigger: lamp,
              start: "top 70%",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: resultsRef }
  );

  useGSAP(
    () => {
      gsap.to(resultsTextRef.current!, {
        ease: "power1.inOut",
        y: -30,
        scrollTrigger: {
          trigger: resultsTextRef.current!,
          start: "top 90%",
          end: "bottom bottom",
          scrub: true,
        },
      });
    },
    { scope: resultsTextRef }
  );

  return (
    <main className="w-full flex flex-col gap-y-10 sm:gap-y-8 items-center mt-[150px]">
      <h1 className="home opacity-0 -translate-y-20 text-4xl sm:text-5xl md:text-7xl text-center font-semibold px-1">
        Linear is a better way <br /> to build products
      </h1>
      <span className="home opacity-0 -translate-y-20 text-lg sm:text-xl text-center text-slate-400 font-semibold px-1">
        Meet the new standard for modern software development. <br /> Streamline
        issues, sprints, and product roadmaps.
      </span>
      <Link
        href="/sign-in"
        className={cn(
          "home mt-4 opacity-0 -translate-y-20",
          buttonVariants({
            variant: "linear",
            size: "lg",
            className: "font-bold",
          })
        )}
      >
        Get Started <ArrowRight className="ml-1 size-5" />
      </Link>
      <div
        style={{
          transform: "rotateY(90deg)",
        }}
        className="home-image max-w-5xl mt-[50px] sm:mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
      >
        <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-4">
          <Image
            src="/showcase.png"
            alt="showcase-image"
            width={1000}
            height={1000}
            className="w-full h-full"
          />
        </div>
      </div>
      <div
        // @ts-ignore
        ref={issuesRef}
        className="relative mt-60 flex w-full flex-1 scale-y-125 items-center justify-center isolate"
      >
        <div
          id="issues-lamp-1"
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            opacity: 0.5,
            width: "15rem",
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute  w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute  w-40 h-[100%] left-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </div>
        <div
          id="issues-lamp-2"
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            opacity: 0.5,
            width: "15rem",
          }}
          className="issues-lamp-2 absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute  w-40 h-[100%] right-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute  w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <h1
          // @ts-ignore
          ref={issuesTextRef}
          style={{
            transform: "translateY(30px)",
          }}
          id="issues-text"
          className="z-0 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 text-3xl sm:text-5xl md:text-7xl text-center -mt-10"
        >
          Issue tracking <br /> you&apos;ll enjoy using
        </h1>
        <Image
          src="/issues.png"
          alt="issues-image"
          width={500}
          height={500}
          className="z-50 w-[700px] h-[250px]"
        />
      </div>
      <div
        // @ts-ignore
        ref={resultsRef}
        className="relative mt-60 flex w-full flex-1 scale-y-125 items-center justify-center isolate"
      >
        <div
          id="issues-lamp-1"
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            opacity: 0.5,
            width: "15rem",
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-purple-600 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute  w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute  w-40 h-[100%] left-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </div>
        <div
          id="issues-lamp-2"
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            opacity: 0.5,
            width: "15rem",
          }}
          className="issues-lamp-2 absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-purple-600 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute  w-40 h-[100%] right-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute  w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </div>
      </div>
      <div className="flex flex-col items-center w-full">
        <h1
          // @ts-ignore
          ref={resultsTextRef}
          style={{
            transform: "translateY(30px)",
          }}
          id="issues-text"
          className="z-0 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 text-3xl sm:text-5xl md:text-7xl text-center -mt-10"
        >
          Linear workflows. <br /> Exponential results.
        </h1>
        <Image
          src="/results.png"
          alt="issues-image"
          width={600}
          height={600}
          className="z-50 w-[700px] h-[250px]"
        />
      </div>
      <div className="w-full flex flex-col items-center gap-y-8 mt-10 mb-5">
        <Image
          src="/logo.svg"
          alt="logo"
          width={50}
          height={50}
          className="w-[50px] h-[50px]"
        />
        <h1 className="text-3xl sm:text-5xl text-center">
          Built for the future. <br /> Available today.
        </h1>
        <Link
          href="/sign-up"
          className={cn(
            buttonVariants({
              variant: "linear",
              size: "lg",
              className: "font-bold",
            })
          )}
        >
          Sign up for free
        </Link>
      </div>
    </main>
  );
};

export default Hero;
