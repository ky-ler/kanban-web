import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const allProjectsQueryKey = ["projects"];

// Centralized query keys for project-related queries
export const projectQueryKey = (projectId: string | number) => [
  allProjectsQueryKey[0],
  { projectId },
];

export const allIssuesQueryKey = ["issues"];

export const issueQueryKey = (
  projectId: string | number,
  issueId: string | number,
) => [allIssuesQueryKey[0], { projectId, issueId }];
