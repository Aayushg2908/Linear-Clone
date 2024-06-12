import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

export const WorkspaceSchema = z.object({
  name: z.string().min(5, {
    message: "Minimum 5 characters required",
  }),
});

export const IssueSchema = z.object({
  title: z.string().min(1, {
    message: "Minimum 1 character required",
  }),
  content: z.string().min(1, {
    message: "Minimum 1 character required",
  }),
});

export const ProjectSchema = z.object({
  title: z.string().min(1, {
    message: "Minimum 1 character required",
  }),
  summary: z.string().min(5, {
    message: "Minimum 5 character required",
  }),
  content: z.string().min(1, {
    message: "Minimum 1 character required",
  }),
});
