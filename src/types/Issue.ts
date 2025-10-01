import type { User } from "./User";

export const STATUSES = ["Backlog", "Todo", "In Progress", "Done", "Canceled"];
export const PRIORITIES = ["Low", "Normal", "High", "Urgent"];

export interface PriorityAndStatusType {
  id: number;
  name: string;
}

export interface Issue {
  id: number;
  createdBy: User;
  assignedTo: User | null;
  project: number;
  title: string;
  description: string | undefined;
  status: PriorityAndStatusType;
  priority: PriorityAndStatusType;
  dateCreated: string;
  dateModified: string | null;
}

export interface IssueSummary {
  id: number;
  title: string;
  status: PriorityAndStatusType;
  priority: PriorityAndStatusType;
  assignedToUsername: string | null;
}

export interface IssueRequestData {
  projectId: number;
  title: string;
  description: string | undefined;
  statusName: string;
  priorityName: string;
  assignedToUsername: string | null;
}
