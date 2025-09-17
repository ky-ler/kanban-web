import { queryOptions } from "@tanstack/react-query";
import { fetchIssue } from "./issues";

export const issueQueryOptions = (projectId: string, issueId: string) =>
  queryOptions({
    queryKey: ["issue", projectId, issueId], // TODO: check if this works better than ["issue", { projectId, issueId }]
    queryFn: () => fetchIssue(projectId, issueId),
  });
