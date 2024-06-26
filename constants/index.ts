import { ISSUELABEL, ISSUETYPE, PROJECTTYPE } from "@prisma/client";
import {
  BoxSelect,
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleX,
  LucideProps,
  Square,
  SquareCheck,
  SquareDot,
  SquareX,
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

interface IssuesLabelType {
  name: string;
  type: ISSUELABEL;
  className: string;
}

export const IssueLabel: IssuesLabelType[] = [
  {
    name: "Bug",
    type: "BUG",
    className: "bg-red-600 rounded-full size-4 mr-1",
  },
  {
    name: "Feature",
    type: "FEATURE",
    className: "bg-purple-600 rounded-full size-4 mr-1",
  },
  {
    name: "Improvement",
    type: "IMPROVEMENT",
    className: "bg-blue-600 rounded-full size-4 mr-1",
  },
];

interface ProjectsType {
  name: string;
  type: PROJECTTYPE;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export const Projects: ProjectsType[] = [
  {
    name: "Backlog",
    type: "BACKLOG",
    Icon: BoxSelect,
  },
  {
    name: "Planned",
    type: "PLANNED",
    Icon: Square,
  },
  {
    name: "In Progress",
    type: "INPROGRESS",
    Icon: SquareDot,
  },
  {
    name: "Completed",
    type: "COMPLETED",
    Icon: SquareCheck,
  },
  {
    name: "Cancelled",
    type: "CANCELLED",
    Icon: SquareX,
  },
];

interface ProjectLabelType {
  name: string;
  type: ISSUELABEL;
  className: string;
}

export const ProjectLabel: ProjectLabelType[] = [
  {
    name: "Bug",
    type: "BUG",
    className: "bg-red-600 rounded-full size-4 mr-1",
  },
  {
    name: "Feature",
    type: "FEATURE",
    className: "bg-purple-600 rounded-full size-4 mr-1",
  },
  {
    name: "Improvement",
    type: "IMPROVEMENT",
    className: "bg-blue-600 rounded-full size-4 mr-1",
  },
];
