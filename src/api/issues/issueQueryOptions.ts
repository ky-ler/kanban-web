import { queryOptions } from "@tanstack/react-query";
import { fetchSingleIssue } from "./issues";
import { issueQueryKey } from "@/lib/query";

export const issueQueryOptions = (projectId: string, issueId: string) =>
  queryOptions({
    queryKey: issueQueryKey(projectId, issueId),
    queryFn: () => fetchSingleIssue(projectId, issueId),
  });
