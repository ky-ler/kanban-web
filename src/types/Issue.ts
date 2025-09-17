import type { User } from "./User";

export const STATUSES = [
  "Backlog",
  "Todo",
  "In Progress",
  "Done",
  "Canceled",
] as const;

export type Status = (typeof STATUSES)[number];
export function getStatusId(status: Status): number {
  const idx = STATUSES.indexOf(status);
  if (idx === -1) {
    throw new Error(`Unknown status name: ${status}`);
  }
  return idx + 1;
}

export interface PriorityAndStatusType {
  id: number;
  name: string;
}

export const PRIORITIES = ["Low", "Medium", "High", "Urgent"] as const;
export type Priority = (typeof PRIORITIES)[number];
export function getPriorityId(priority: Priority): number {
  const idx = PRIORITIES.indexOf(priority);
  if (idx === -1) {
    throw new Error(`Unknown priority name: ${priority}`);
  }
  return idx + 1;
}

export interface Issue {
  id: number;
  createdBy: User;
  assignedTo: User | null;
  project: number;
  title: string;
  description: string | undefined;
  status: string;
  priority: string;
  dateCreated: string;
  dateModified: string | null;
}

export interface IssueSummary {
  id: number;
  title: string;
  status: PriorityAndStatusType;
  priority: PriorityAndStatusType;
  assignedToUserId: number | null;
}

export interface IssueForm {
  projectId: number;
  title: string;
  description: string | undefined;
  statusId: number;
  priorityId: number;
  assignedToUsername: string | null;
}
