import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VALID_DEPARTMENT_KEYS = [
  "engineering",
  "marketing",
  "finance",
  "it",
  "hr",
] as const;

export const DEPARTMENT_MAP: Record<
  (typeof VALID_DEPARTMENT_KEYS)[number],
  string
> = {
  engineering: "Engineering",
  marketing: "Marketing",
  finance: "Finance",
  it: "IT",
  hr: "Human Resources",
} as const;

export type Department = keyof typeof DEPARTMENT_MAP;

export const departments = VALID_DEPARTMENT_KEYS;

const isDepartment = (input: unknown): input is Department =>
  typeof input === "string" &&
  VALID_DEPARTMENT_KEYS.includes(input as Department);

export const renderDepartment = (department: string) => {
  if (isDepartment(department)) {
    return DEPARTMENT_MAP[department];
  }
  return "Unknown";
};
