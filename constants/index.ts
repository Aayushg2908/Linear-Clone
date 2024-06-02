import { ISSUETYPE } from "@prisma/client";
import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleX,
  LucideProps,
} from "lucide-react";

export const publicRoutes = ["/", "/new-verification"];

export const authRoutes = ["/sign-in", "/sign-up"];

export const DEFAULT_REDIRECT = "/dashboard";

interface IssuesType {
  name: string;
  type: ISSUETYPE;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export const Issues: IssuesType[] = [
  {
    name: "Backlog",
    type: "BACKLOG",
    Icon: CircleDashed,
  },
  {
    name: "Todo",
    type: "TODO",
    Icon: Circle,
  },
  {
    name: "In Progress",
    type: "INPROGRESS",
    Icon: CircleDot,
  },
  {
    name: "Done",
    type: "DONE",
    Icon: CircleCheck,
  },
  {
    name: "Cancelled",
    type: "CANCELLED",
    Icon: CircleX,
  },
];
