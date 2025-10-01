import type { User } from "./User";
import type { Collaborator } from "./Collaborator.ts";
import type { IssueSummary } from "./Issue.ts";

export interface Project {
  id: number;
  name: string;
  description: string | undefined;
  createdBy: User;
  collaborators: Collaborator[];
  issues: IssueSummary[];
  dateCreated: string;
  dateModified: string;
}

export interface ProjectSummary {
  id: number;
  name: string;
  description: string | undefined;
  dateModified: string;
  totalIssues: number;
  doneIssues: number;
}
