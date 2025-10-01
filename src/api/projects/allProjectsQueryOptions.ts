import { queryOptions } from "@tanstack/react-query";
import { fetchProjects } from "./projects";
import { allProjectsQueryKey } from "@/lib/query/query";

export const projectsQueryOptions = queryOptions({
  queryKey: allProjectsQueryKey,
  queryFn: () => fetchProjects(),
});
