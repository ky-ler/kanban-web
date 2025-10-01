import { queryOptions } from "@tanstack/react-query";
import { fetchProject } from "./projects";
import { projectQueryKey } from "@/lib/query";

export const projectQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: projectQueryKey(projectId),
    queryFn: () => fetchProject(projectId),
  });
