import { queryOptions } from "@tanstack/react-query";
import { fetchProject } from "./projects";

export const projectQueryOptions = (projectId: string) =>
  queryOptions({
    queryKey: ["projects", { projectId }],
    queryFn: () => fetchProject(projectId),
  });
